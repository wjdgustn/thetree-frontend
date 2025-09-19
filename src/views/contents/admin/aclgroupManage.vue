<template>
  <SeedForm :class="$style.form" method="post">
    <h3>{{group.name}}</h3>
    <input type="hidden" name="uuid" v-model="group.uuid">
    <SeedFormBlock newStyle inputId="nameInput" label="name" name="name">
      <InputField type="text" id="nameInput" name="name" :value="group.name"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="withdraw_period_hoursInput" label="withdraw_period_hours" name="withdrawPeriodHours">
      <InputField type="text" id="withdraw_period_hoursInput" name="withdrawPeriodHours" v-model="group.withdrawPeriodHours"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="signup_policyInput" label="signup_policy" name="signupPolicy">
      <SelectMenu id="signup_policyInput" name="signupPolicy" :value="group.signupPolicy">
        <option value="0">none</option>
        <option value="1">block</option>
      </SelectMenu>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="max_durationInput" label="max_duration" name="maxDuration">
      <InputField type="text" id="max_durationInput" name="maxDuration" v-model="group.maxDuration"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="max_duration_ipInput" label="max_duration_ip" name="maxDurationIp">
      <InputField type="text" id="max_duration_ipInput" name="maxDurationIp" v-model="group.maxDurationIp"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="max_duration_accountInput" label="max_duration_account" name="maxDurationAccount">
      <InputField type="text" id="max_duration_accountInput" name="maxDurationAccount" v-model="group.maxDurationAccount"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="max_ipv4_cidrInput" label="max_ipv4_cidr" name="maxIpv4Cidr">
      <InputField type="text" id="max_ipv4_cidrInput" name="maxIpv4Cidr" v-model="group.maxIpv4Cidr"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="max_ipv6_cidrInput" label="max_ipv6_cidr" name="maxIpv6Cidr">
      <InputField type="text" id="max_ipv6_cidrInput" name="maxIpv6Cidr" v-model="group.maxIpv6Cidr"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="access_flagsInput" label="access_flags" name="accessPerms">
      <InputField type="text" id="access_flagsInput" name="accessPerms" v-model="group.accessPerms"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="add_flagsInput" label="add_flags" name="addPerms">
      <InputField type="text" id="add_flagsInput" name="addPerms" v-model="group.addPerms"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="remove_flagsInput" label="remove_flags" name="removePerms">
      <InputField type="text" id="remove_flagsInput" name="removePerms" v-model="group.removePerms"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="managePermsInput" label="manage_flags" name="managePerms">
      <InputField type="text" id="managePermsInput" name="managePerms" v-model="group.managePerms"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="styleInput" label="style" name="userCSS">
      <InputField type="text" id="styleInput" name="userCSS" v-model="group.userCSS"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="messageInput" label="message" name="aclMessage">
      <InputField type="text" id="messageInput" name="aclMessage" v-model="group.aclMessage"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle inputId="self_remove_noteInput" label="self_remove_note" name="selfRemoveNote">
      <InputField type="text" id="self_remove_noteInput" name="selfRemoveNote" v-model="group.selfRemoveNote"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle>
      <CheckBox id="show_user_documentInput" name="forBlock" v-model="group.forBlock" value="Y">show_user_document</CheckBox>
    </SeedFormBlock>
    <SeedFormBlock newStyle>
      <CheckBox id="self_removableInput" name="selfRemovable" v-model="group.selfRemovable" value="Y">self_removable</CheckBox>
    </SeedFormBlock>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton theme="danger" type="button" :whenClick="deleteGroup">삭제</GeneralButton>
        <GeneralButton :class="$style.button" theme="primary" type="submit">수정</GeneralButton>
      </div>
    </div>
  </SeedForm>
</template>
<style module>
@import '@/styles/form.css';
</style>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import InputField from '@/components/form/inputField'
import SelectMenu from '@/components/selectMenu'
import CheckBox from '@/components/form/checkBox'
import GeneralButton from '@/components/generalButton'

export default {
  components: {
    GeneralButton,
    CheckBox,
    InputField,
    SeedFormBlock,
    SeedForm,
    SelectMenu
  },
  computed: {
    group() {
      return this.data.group
    }
  },
  methods: {
    async deleteGroup() {
      if(!confirm(`${this.group.name} 그룹을 삭제하겠습니까?`)) return

      await this.internalRequestAndProcess('/aclgroup/group_remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          uuid: this.group.uuid
        }).toString()
      })
    }
  }
}
</script>