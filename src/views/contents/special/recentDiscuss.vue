<template>
  <LinkTab
      class="link-tab"
      :items="[
          {
            title: $t('views.recent_discuss.normal_thread'),
            href: '?logtype=normal_thread',
            active: !$route.query.logtype || $route.query.logtype === 'normal_thread'
          },
          {
            title: $t('views.recent_discuss.old_thread'),
            href: '?logtype=old_thread',
            active: $route.query.logtype === 'old_thread'
          },
          {
            title: $t('views.recent_discuss.pause_thread'),
            href: '?logtype=pause_thread',
            active: $route.query.logtype === 'pause_thread'
          },
          {
            title: $t('views.recent_discuss.closed_thread'),
            href: '?logtype=closed_thread',
            active: $route.query.logtype === 'closed_thread'
          },
          {
            title: $t('views.recent_discuss.open_editrequest'),
            href: '?logtype=open_editrequest',
            active: $route.query.logtype === 'open_editrequest'
          },
          {
            title: $t('views.recent_discuss.accepted_editrequest'),
            href: '?logtype=accepted_editrequest',
            active: $route.query.logtype === 'accepted_editrequest'
          },
          {
            title: $t('views.recent_discuss.closed_editrequest'),
            href: '?logtype=closed_editrequest',
            active: $route.query.logtype === 'closed_editrequest'
          },
          {
            title: $t('views.recent_discuss.old_editrequest'),
            href: '?logtype=old_editrequest',
            active: $route.query.logtype === 'old_editrequest'
          }
      ]"
  />
  <div class="list-table">
    <div class="table-row table-heading">
      <div class="table-item">{{$t('views.user_contribution.topic')}}</div>
      <div class="table-item">{{$t('views.recent_changes.author')}}</div>
      <div class="table-item">{{$t('views.user_contribution.date')}}</div>
    </div>
    <div v-for="item in [...data.threads, ...data.editRequests]" :key="item.url" class="table-row">
      <div class="table-item">
        <NuxtLink :to="(item.topic ? '/thread/' : '/edit_request/') + item.url">{{item.topic || $t('views.user_contribution.edit_request_link', { slug: item.url })}}</NuxtLink>
        <DiffCount class="diff-count" v-if="item.diffLength != null" :count="item.diffLength"/>
        <span class="document-group">
          <span class="document-icon">
            <FontAwesomeIcon icon="fa-regular fa-file-lines" />
          </span>
          <NuxtLink :to="doc_action_link(item.document.parsedName, 'discuss')" class="document-link">{{doc_fulltitle(item.document.parsedName)}}</NuxtLink>
        </span>
      </div>
      <div class="table-item">
        <AuthorSpan :account="item.lastUpdateUser || item.createdUser" :pos="$t(item.lastUpdateUser ? 'document.discuss' : 'document.edit_request') + ' ' + (item.url)"/>
      </div>
      <div class="table-item">
        <LocalDate :date="item.lastUpdatedAt" relative/>
      </div>
    </div>
  </div>
</template>
<script>
import Common from '@/mixins/common'
import LinkTab from '@/components/linkTab'
import NuxtLink from '@/components/global/nuxtLink'
import DiffCount from '@/components/diffCount'
import GeneralButton from '@/components/generalButton'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'

export default {
  mixins: [Common],
  components: {
    LinkTab,
    NuxtLink,
    DiffCount,
    GeneralButton,
    AuthorSpan,
    LocalDate
  }
}
</script>
<style scoped>
@media screen and (max-width: 1023.98px) {
  .table-heading+.table-row {
    border-top:1px solid #e0e0e0;
  }

  .theseed-dark-mode .table-heading+.table-row {
    border-top-color: #575757;
  }
}

.link-tab {
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.list-table {
  display: flex;
  flex-direction: column;
}

.table-row {
  border-bottom: 1px solid #e0e0e0;
  display: grid;
}

.theseed-dark-mode .table-row {
  border-bottom-color: #575757;
}

.table-row:not(.table-heading):hover {
  background-color: #fbfbfb;
}

.theseed-dark-mode .table-row:not(.table-heading):hover {
  background-color: #2a2a2a;
}

.table-heading {
  border-bottom-width: 2px;
  font-weight: 600;
}

@media screen and (max-width: 1023.98px) {
  .table-heading {
    display: none;
  }

  .table-heading+.table-row {
    border-top: 1px solid #e0e0e0;
  }
}

.table-item {
  padding: .5rem .75rem;
}

.table-row {
  grid-template-columns: 1fr 11rem 13rem
}

@media screen and (max-width: 1023.98px) {
  .table-row {
    gap:.1rem;
    grid-template-columns: none;
    padding: .5rem
  }

  .table-item {
    margin: 0!important;
    padding: 0!important
  }

  .table-item:first-child {
    font-size: 1.05rem
  }

  .table-item:nth-child(3) {
    color: #888;
    font-size: .85rem;
    order: -1
  }
}

.diff-count {
  font-size: .8rem;
  margin: 0 0 0 .35rem;
  vertical-align: bottom;
}

.document-icon {
  color: #aaa;
  display: inline-block;
  margin: 0 .3rem 0 .15rem;
  width: .65rem;
}

.document-icon svg {
  height: 100%;
  margin: 0 0 -.1em;
  width: 100%;
  fill: currentColor;
}

.document-group {
  font-size: .85rem;
  margin: 0 0 0 .35rem;
}

.document-link {
  color: var(--light-text-color, var(--text-color, #212529));
}

.theseed-dark-mode .document-link {
  color: var(--dark-text-color, var(--text-color, #e0e0e0));
}
</style>