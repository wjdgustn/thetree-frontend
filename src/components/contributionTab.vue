<template>
  <LinkTab
      class="link-tab"
      :items="[
          {
            title: '문서',
            href: contribution_link(data.account.uuid),
            active: data.contributionType === 'document'
          },
          {
            title: '토론',
            href: contribution_link_discuss(data.account.uuid),
            active: data.contributionType === 'discuss'
          },
          {
            title: '편집 요청',
            href: contribution_link_edit_request(data.account.uuid),
            active: data.contributionType === 'edit_request'
          },
          {
            title: '승인한 편집 요청',
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