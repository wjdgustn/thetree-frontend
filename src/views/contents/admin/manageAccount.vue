<template>
  <SeedForm :class="$style.form">
    <FormErrorAlert v-if="!data.targetUser"/>

    <SeedFormBlock name="query" label="query" inputId="queryInput" newStyle>
      <InputField name="query" id="queryInput" required ref="queryInput"/>
    </SeedFormBlock>
    <SeedFormBlock :class="$style['form__row--buttons']">
      <div>
        <GeneralButton theme="primary" type="submit">{{$t('views.manage_account.search')}}</GeneralButton>
      </div>
    </SeedFormBlock>

    <div v-if="data.searchData">
      <div>{{$t('views.manage_account.total', { count: data.searchData.total })}}</div>
      <PrevNextBtn flex :="data.searchData.pageProps"/>
      <ul>
        <li v-for="item in data.searchData.items" :key="item.uuid">
          <NuxtLink :to="'?uuid=' + item.uuid">{{item.name}}</NuxtLink>
        </li>
      </ul>
      <PrevNextBtn flex :="data.searchData.pageProps"/>
    </div>
  </SeedForm>

  <SeedForm v-if="data.targetUser" method="post" :class="$style.form">
    <input type="hidden" name="uuid" :value="data.targetUser.uuid">

    <FormErrorAlert/>

    <h3>{{data.targetUser.name}}</h3>
    <p v-if="data.verifyEnabled" class="phone-number-text">
      {{$t('views.manage_account.phone')}}
      <span v-if="data.phoneNumber">{{data.phoneNumber}}</span>
      <GeneralButton v-else-if="data.targetUser.mobileVerified" size="small" type="event" @click="accountAction('getPhoneNumber', false)">{{$t('views.manage_account.show')}}</GeneralButton>
      <span v-else>{{$t('views.manage_account.no_phone')}}</span>
    </p>
    <SeedFormBlock name="name" label="name" inputId="nameInput" newStyle>
      <InputField name="name" id="nameInput" :value="data.targetUser.name" required/>
    </SeedFormBlock>
    <SeedFormBlock name="email" label="email" inputId="emailInput" newStyle>
      <InputField name="email" id="emailInput" :value="data.targetUser.email" type="email" required/>
    </SeedFormBlock>
    <SeedFormBlock newStyle>
      <CheckBox name="useTotp" id="useTotpInput" :checked="data.targetUser.useTotp" :disabled="!data.targetUser.useTotp" value="Y">
        useTotp
      </CheckBox>
    </SeedFormBlock>
    <SeedFormBlock newStyle>
      <CheckBox name="usePasswordlessLogin" id="usePasswordlessLoginInput" :checked="data.targetUser.usePasswordlessLogin" value="Y">
        usePasswordlessLogin
      </CheckBox>
    </SeedFormBlock>
    <SeedFormBlock :class="$style['form__row--buttons']">
      <div>
        <GeneralButton theme="primary" type="submit">{{$t('views.manage_account.apply')}}</GeneralButton>
      </div>
    </SeedFormBlock>

    <Heading :title="$t('views.manage_account.tools.title')" folded>
      <SeedFormBlock newStyle>
        <GeneralButton theme="danger" type="event" @click="accountAction('resetLastNameChange')">{{$t('views.manage_account.tools.reset_last_name_change')}}</GeneralButton>
        <GeneralButton theme="danger" type="event" @click="accountAction('resetLastActivity')">{{$t('views.manage_account.tools.reset_last_activity')}}</GeneralButton>
        <GeneralButton theme="danger" type="event" @click="accountAction('resetPasswordLink')">{{$t('views.manage_account.tools.reset_password_link')}}</GeneralButton>
        <GeneralButton :disabled="!data.targetUser.mobileVerified" theme="danger" type="event" @click="accountAction('removePhoneNumber')">{{$t('views.manage_account.tools.remove_phone_number')}}</GeneralButton>
        <GeneralButton theme="danger" type="event" @click="accountAction('deleteAccount')">{{$t('views.manage_account.tools.delete_account')}}</GeneralButton>
      </SeedFormBlock>
    </Heading>

    <Heading v-if="data.externalProviders?.length" :title="$t('views.manage_account.external_account_list')" folded>
      <div :class="[$style.table, $style['table--bordered']]">
        <div :class="[$style.row, $style['row--head'], 'table-row']">
          <div v-for="text in ['provider', 'name', 'email'].map(a => $t('views.mypage.external_' + a))" :class="[$style.column, 'table-column']">{{text}}</div>
        </div>
        <div v-for="item in data.externalProviders" :class="[$style.row, 'table-row']">
          <div :class="[$style.column, 'table-column']">{{item.displayName}}</div>
          <div :class="[$style.column, 'table-column']">{{data.targetUser.oauth2Maps[item.name]?.name}}</div>
          <div :class="[$style.column, 'table-column']">{{data.targetUser.oauth2Maps[item.name]?.email}}</div>
        </div>
      </div>
    </Heading>
  </SeedForm>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'
import CheckBox from '@/components/form/checkBox'
import NuxtLink from '@/components/global/nuxtLink'
import PrevNextBtn from '@/components/prevNextBtn'
import Heading from '@/components/heading'
import FormErrorAlert from '@/components/form/formErrorAlert'

export default {
  mixins: [Common],
  components: {
    FormErrorAlert,
    Heading,
    PrevNextBtn,
    NuxtLink,
    CheckBox,
    GeneralButton,
    InputField,
    SeedFormBlock,
    SeedForm
  },
  mounted() {
    this.focusQuery()
  },
  watch: {
    $route() {
      this.focusQuery()
    }
  },
  methods: {
    focusQuery() {
      if(!this.data.targetUser)
        this.$refs.queryInput.focus()
    },
    async accountAction(action, danger = true) {
      if(!this.data.targetUser.uuid) return
      if(danger && !confirm('go?')) return

      await this.internalRequestAndProcess('/admin/manage_account/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          uuid: this.data.targetUser.uuid,
          action
        }).toString()
      })
    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
@import '@/styles/table.css';
</style>
<style scoped>
.phone-number-text {
  margin-top: 0;
}
</style>