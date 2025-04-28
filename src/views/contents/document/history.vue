<template>
  <div class="top-page-block">
    <PrevNextBtn class="top-page top-page-item" flex v-bind="pageProps"/>
    <RevInput blockClass="top-page-item"/>
  </div>
  <SeedForm :action="doc_action_link(data.document, 'diff')">
    <p>
      <GeneralButton type="submit">선택 리비전 비교</GeneralButton>
    </p>
    <ul>
      <li v-for="rev in data.revs" :class="{ troll: rev.troll }" :key="rev.uuid">
        <span>
          <LocalDate :date="rev.createdAt"/>
        </span>
        <span class="history-action">
          (<template v-for="(action, index) in getActions(rev)">
          <template v-if="index !== 0"> | </template>
          <a
              v-if="action.admin"
              @click="adminAction(rev, action.action)"
              v-text="action.text"/>
          <NuxtLink
              v-else
              :to="doc_action_link(data.document, action.action, { uuid: rev.uuid })"
              :rel="action.follow ? null : 'nofollow'"
              v-text="action.text"
          />
          </template>)
        </span>
        <span v-if="!rev.troll">
          <input type="radio"
                 name="olduuid"
                 :value=rev.uuid
                 :checked="rev.uuid === diffOldRev"
                 @click="diffOldRev = rev"
                 :style="{ visibility: !diffRev || rev.rev < diffRev.rev ? 'visible' : 'hidden' }"
          />
          <input
              type="radio"
              name="uuid"
              :value=rev.uuid
              :checked="rev.uuid === diffRev"
              @click="diffRev = rev"
              :style="{ visibility: !diffOldRev || rev.rev > diffOldRev.rev ? 'visible' : 'hidden' }"
          />
        </span>
        <i v-if="rev.infoText" v-html="'(' + removeHtmlTags(rev.infoText) + ') '"/>
        <strong>
          <a class="rev-text" href="#" @click="copyUuid(rev)">r{{rev.rev}}</a>
        </strong>
        <span>
          (<DiffCount :count="rev.diffLength"/>)
        </span>
        <NuxtLink v-if="rev.editRequest" :to="'/edit_request/' + rev.editRequest.url">
          <i>(편집 요청)</i>&nbsp;
        </NuxtLink>
        <AuthorSpan :account="rev.user" :pos="`${doc_fulltitle(data.document)} r${rev.rev}`"/>

        <template v-if="rev.troll">
          [<AuthorSpan :account="rev.trollBy"/> 사용자에 의해 반달로 표시됨]
        </template>
        <template v-else-if="rev.log">
          <template v-if="rev.hideLog">
            (<span class="log"><AuthorSpan :account="rev.hideLogBy"/> 사용자에 의해 편집 요약 숨겨짐</span>)
          </template>

          <template v-if="rev.hideLog && !rev.forceShowLog">
            <GeneralButton class="show-log-button" size="small" :whenClick="() => rev.forceShowLog = true">내용 보기</GeneralButton>
          </template>
          <template v-else>
            (<span class="log"><template v-if="rev.hideLog">내용: </template>{{rev.log}}</span>)
          </template>
        </template>
      </li>
    </ul>
    <PrevNextBtn flex v-bind="pageProps"/>
  </SeedForm>
</template>
<script>
import { toast } from 'vue-sonner'

import Common from '@/mixins/common'
import AuthorSpan from '@/components/authorSpan'
import PrevNextBtn from '@/components/prevNextBtn'
import RevInput from '@/components/revInput'
import SeedForm from '@/components/form/seedForm'
import GeneralButton from '@/components/generalButton'
import LocalDate from '@/components/localDate'
import NuxtLink from '@/components/global/nuxtLink'
import DiffCount from '@/components/diffCount'

export default {
  mixins: [Common],
  components: {
    SeedForm,
    PrevNextBtn,
    RevInput,
    GeneralButton,
    LocalDate,
    NuxtLink,
    DiffCount,
    AuthorSpan
  },
  data() {
    return {
      diffOldRev: null,
      diffRev: null
    }
  },
  computed: {
    pageProps() {
      const revs = this.data.revs
      const lastRev = revs[revs.length - 1]
      return {
        prev: revs[0].uuid !== this.data.latestRev.uuid ? { query: { until: revs[0].rev + 1 } } : null,
        next: lastRev.rev > 1 ? { query: { from: lastRev.rev - 1 } } : null
      }
    }
  },
  methods: {
    getActions(rev) {
      const actions = [
        ...(rev.troll ? [] : [{
          action: 'w',
          text: '보기',
          follow: true
        }]),
        {
          action: 'raw',
          text: 'RAW'
        },
        {
          action: 'blame',
          text: 'Blame'
        },
        ...(rev.troll ? [] : [{
          action: 'revert',
          text: '이 리비전으로 되돌리기'
        }]),
        ...(rev.rev > 1 ? [{
          action: 'diff',
          text: '비교'
        }] : [])
      ]

      const permissions = this.data.permissions
      if(permissions.troll) actions.push(rev.troll ? {
        action: 'unmark_troll',
        text: '[A]반달표시 해제',
        admin: true
      } : {
        action: 'mark_troll',
        text: '[A]반달로 표시',
        admin: true
      })

      if(rev.log && permissions.log) actions.push(rev.hideLog ? {
        action: 'unhide_log',
        text: '[A]편집요약 숨기기 해제',
        admin: true
      } : {
        action: 'hide_log',
        text: '[A]편집요약 숨기기',
        admin: true
      })

      if(permissions.hide) actions.push(rev.hidden ? {
        action: 'unhide',
        text: '[A]리비전 숨기기 해제',
        admin: true
      } : {
        action: 'hide',
        text: '[A]리비전 숨기기',
        admin: true
      })

      return actions
    },
    copyUuid(rev) {
      navigator.clipboard.writeText(rev.uuid)
      toast(`r${rev.rev}의 UUID가 복사되었습니다.`)
    },
    async adminAction(rev, action) {
      await this.internalRequestAndProcess(this.doc_action_link(this.data.document, 'a/' + action, { uuid: rev.uuid }))
    }
  }
}
</script>
<style scoped>
.top-page-block {
  align-items: center;
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

@media screen and (max-width: 727.98px) {
  .top-page-block {
    align-items: stretch;
  }
}

.top-page {
  margin: 0;
}

@media screen and (max-width: 727.98px) {
  .top-page {
    flex: 1;
  }
}

:deep() {
  .top-page-item> *:first-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .top-page-item> *:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .top-page-item> *:not(:last-child) {
    border-right-width: 0;
  }

  .top-page-item> *:not(:first-child):not(:last-child) {
    border-radius: 0;
  }

  .top-page-item> *:focus {
    z-index: 200;
  }
}

ul {
  margin: .4em 0 .4em 1.5em;
  padding-left: .5rem;
}

ul>li {
  font-size: .9rem;
  list-style: inherit !important;
  margin: .4em 0;
}

.troll {
  font-size: 7pt;
}

a {
  cursor: pointer;
}

.troll span.history-action, span.history-action {
  font-size: 8pt;
}

a.rev-text {
  color: inherit;
}

span.log {
  color: gray
}

.show-log-button {
  font-size: .7rem;
  height: 1.4rem;
}
</style>