<template>
  <LinkTab
      class="link-tab"
      :items="[
          {
            title: $t('components.contribution_tab.document'),
            href: contribution_link(data.account.uuid),
            active: data.contributionType === 'document'
          },
          {
            title: $t('components.contribution_tab.discuss'),
            href: contribution_link_discuss(data.account.uuid),
            active: data.contributionType === 'discuss'
          },
          {
            title: $t('components.contribution_tab.edit_request'),
            href: contribution_link_edit_request(data.account.uuid),
            active: data.contributionType === 'edit_request'
          },
          {
            title: $t('components.contribution_tab.accepted_edit_request'),
            href: contribution_link_accepted_edit_request(data.account.uuid),
            active: data.contributionType === 'accepted_edit_request'
          }
      ]"
  />
</template>
<script>
import Common from '@/mixins/common'
import LinkTab from '@/components/linkTab'

export default {
  mixins: [Common],
  components: {
    LinkTab
  }
}
</script>