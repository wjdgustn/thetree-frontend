<template>
  <div class="top-page-block">
    <PrevNextBtn class="top-page top-page-item" flex v-bind="pageProps"/>
    <RevInput blockClass="top-page-item"/>
  </div>
  <SeedForm :beforeSubmit="beforeDiff" :action="doc_action_link(data.document, 'diff')">
    <p>
      <GeneralButton type="submit">{{$t('views.history.diff_selected_rev')}}</GeneralButton>
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
              :rel="action.follow ? null : 'nofollow'">
            {{$t('document.' + action.action)}}
          </a>
          <a
              v-else-if="action.post"
              @click="postAction(rev, action.action)"
              :rel="action.follow ? null : 'nofollow'">
            {{$t('document.' + action.action)}}
          </a>
          <NuxtLink
              v-else
              :to="doc_action_link(data.document, action.action, { uuid: rev.uuid })"
              :rel="action.follow ? null : 'nofollow'">
            {{$t('document.' + action.action)}}
          </NuxtLink>
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
        <i v-if="rev.infoText">({{removeHtmlTags(rev.infoText)}}) </i>
        <strong>
          <a class="rev-text" href="#" @click.prevent="copyUuid(rev)">r{{rev.rev}}</a>
        </strong>
        <span>
          (<DiffCount :count="rev.diffLength"/>)
        </span>
        <NuxtLink v-if="rev.editRequest" :to="'/edit_request/' + rev.editRequest.url">
          <i>({{$t('views.history.edit_request_mark')}})</i>&nbsp;
        </NuxtLink>
        <AuthorSpan :account="rev.user" :pos="`${doc_fulltitle(data.document)} r${rev.rev}`"/>

        <template v-if="rev.troll">
          [<i18next :translation="$t('views.history.marked_troll')">
            <template #trollBy>
              <AuthorSpan :account="rev.trollBy"/>
            </template>
          </i18next>]
        </template>
        <template v-else-if="rev.log || rev.hideLog">
          <template v-if="rev.hideLog">
            (<span class="log"><i18next :translation="$t('views.history.hidden_log')">
            <template #hideLogBy>
              <AuthorSpan :account="rev.hideLogBy"/>
            </template>
          </i18next></span>)
          </template>

          <template v-if="rev.hideLog && !rev.forceShowLog">
            <GeneralButton v-if="data.permissions.hide" class="show-log-button" size="small" :whenClick="() => rev.forceShowLog = true">{{$t('views.history.force_show_log')}}</GeneralButton>
          </template>
          <template v-else>
            (<span class="log"><template v-if="rev.hideLog">{{$t('views.history.force_show_log_prefix')}} </template>{{rev.log}}</span>)
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
      const permissions = this.data.permissions

      const actions = [
        ...((rev.troll && !permissions.troll) ? [] : [{
          action: 'w',
          follow: true
        }]),
        {
          action: 'raw'
        },
        {
          action: 'blame'
        },
        ...(rev.troll ? [] : [{
          action: 'revert'
        }]),
        ...(rev.rev > 1 ? [{
          action: 'diff'
        }] : [])
      ]

      if(rev.transfer) actions.push({
        action: 'transfer_contribution',
        post: true
      })

      if(permissions.troll) actions.push(rev.troll ? {
        action: 'unmark_troll',
        admin: true
      } : {
        action: 'mark_troll',
        admin: true
      })

      if(rev.log && permissions.log) actions.push(rev.hideLog ? {
        action: 'unhide_log',
        admin: true
      } : {
        action: 'hide_log',
        admin: true
      })

      if(permissions.hide) actions.push(rev.hidden ? {
        action: 'unhide',
        admin: true
      } : {
        action: 'hide',
        admin: true
      })

      if(permissions.config && (rev.fileKey || rev.videoFileKey)) actions.push({
        action: 'delete_file',
        admin: true
      })

      return actions
    },
    copyUuid(rev) {
      navigator.clipboard.writeText(rev.uuid)
      toast(this.$t('views.history.copied_uuid', { rev: rev.rev }))
    },
    async adminAction(rev, action) {
      await this.internalRequestAndProcess(this.doc_action_link(this.data.document, 'a/' + action, { uuid: rev.uuid }))
    },
    async postAction(rev, action) {
      await this.internalRequestAndProcess(this.doc_action_link(this.data.document, action), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ uuid: rev.uuid }).toString()
      })
    },
    beforeDiff() {
      return !!this.diffOldRev && !!this.diffRev
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
  margin: 0 !important;
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