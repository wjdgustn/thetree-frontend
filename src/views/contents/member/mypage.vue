<template>
  <SeedForm method="post" :class="[$style.form, $style['form--full'], $style['form--row-bordered']]">
    <div class="mypage-block">
      <div class="avatar-block">
        <img :src="session.gravatar_url + '&s=512'" class="avatar-image">
        <div class="avatar-description">
          <i18next :translation="$t('views.mypage.gravatar')">
            <template #gravatar>
              <a href="https://gravatar.com" rel="noopener" target="_blank">Gravatar</a>
            </template>
          </i18next>
        </div>
      </div>
      <div class="form-block">
        <div :class="$style.form__row">
          <div :class="$style['form__row-inner']">
            <label for="usernameInput">{{$t('views.mypage.username')}}</label>
            <GeneralButton theme="link" href="/member/change_name">{{$t('views.mypage.change')}}</GeneralButton>
          </div>
          <div>{{data.user.name}}</div>
        </div>
        <div :class="$style.form__row">
          <div :class="$style['form__row-inner']">
            <label for="emailInput">{{$t('views.mypage.email')}}</label>
            <GeneralButton theme="link" href="/member/change_email">{{$t('views.mypage.change')}}</GeneralButton>
          </div>
          <div>{{data.user.email}}</div>
        </div>
        <div :class="$style.form__row">
          <label for="emailInput">{{$t('views.mypage.password')}}</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton :class="$style.button" href="/member/change_password">{{$t('views.mypage.change')}}</GeneralButton>
          </div>
        </div>
        <div :class="$style.form__row">
          <label for="permInput">{{$t('views.mypage.permission')}}</label>
          <div>{{data.permissions.join(', ')}}</div>
        </div>
        <div v-if="data.verifyEnabled" :class="$style.form__row">
          <label for="permInput">{{$t('views.mypage.mobile_verify')}}</label>
          <div :class="$style['form__row-inner']">
            <span v-if="data.permissions.includes('mobile_verified_member')" class="color-text color-text-green">
            <FontAwesomeIcon icon="fa-circle-check"/>
            {{$t('views.mypage.mobile_verified')}}
          </span>
            <GeneralButton v-else :class="$style.button" href="/member/signup_verify">{{$t('views.mypage.mobile_verify_button')}}</GeneralButton>
          </div>
        </div>
        <SeedFormBlock newStyle :class="$style.form__row" :label="$t('views.mypage.skin')" inputId="skinSelect">
          <div :class="$style['form__row-inner']">
            <SelectMenu id="skinSelect" name="skin" :value="data.user.skin">
              <option value="default">{{$t('views.mypage.default_skin')}}</option>
              <option v-for="skin in data.skins" :selected="skin === data.user.skin">{{skin}}</option>
            </SelectMenu>
          </div>
        </SeedFormBlock>
        <div :class="$style.form__row">
          <label>{{$t('views.mypage.otp')}}</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton v-if="data.hasTotp" theme="danger" :class="$style.button" href="/member/deactivate_otp">{{$t('views.mypage.deactivate')}}</GeneralButton>
            <GeneralButton v-else :class="$style.button" href="/member/activate_otp">{{$t('views.mypage.activate')}}</GeneralButton>
          </div>
        </div>
        <div v-if="data.externalProviders?.length" :class="$style.form__row">
          <label>{{$t('views.mypage.connect_external_account')}}</label>
          <div :class="[$style.table, $style['table--bordered']]">
            <div :class="[$style.row, $style['row--head'], 'table-row']">
              <div v-for="text in ['provider', 'name', 'email', ''].map(a => a && $t('views.mypage.external_' + a))" :class="[$style.column, 'table-column']">{{text}}</div>
            </div>
            <div v-for="item in data.externalProviders" :class="[$style.row, 'table-row']">
              <div :class="[$style.column, 'table-column']">{{item.displayName}}</div>
              <div :class="[$style.column, 'table-column']">{{data.oauth2Maps[item.name]?.name}}</div>
              <div :class="[$style.column, 'table-column']">{{data.oauth2Maps[item.name]?.email}}</div>
              <div :class="[$style.column, $style['column--button-parent'], 'table-column']">
                <GeneralButton v-if="data.oauth2Maps[item.name]" theme="danger" size="small" :whenClick="() => removeExternalAccount(item.name)">{{$t('views.mypage.external_remove')}}</GeneralButton>
                <GeneralButton v-else theme="primary" size="small" :href="'/member/login/oauth2/' + item.name">{{$t('views.mypage.external_add')}}</GeneralButton>
              </div>
            </div>
          </div>
        </div>
        <div v-if="data.hasTotp" :class="$style.form__row">
          <label>{{$t('views.mypage.passkey')}}</label>
          <div :class="[$style.table, $style['table--bordered']]">
            <div :class="[$style.row, $style['row--head'], 'table-row']">
              <div v-for="text in ['name', 'created', 'last_used', ''].map(a => a && $t('views.mypage.passkey_' + a))" :class="[$style.column, 'table-column']">{{text}}</div>
            </div>
            <div v-if="data.passkeys.length" v-for="passkey in data.passkeys" :class="[$style.row, 'table-row']">
              <div :class="[$style.column, 'table-column']">{{passkey.name}}</div>
              <div :class="[$style.column, 'table-column']"><LocalDate :date="passkey.createdAt"/></div>
              <div :class="[$style.column, 'table-column']">
                <LocalDate v-if="passkey.lastUsedAt" :date="passkey.lastUsedAt"/>
                <template v-else>{{$t('views.mypage.passkey_not_used')}}</template>
              </div>
              <div :class="[$style.column, $style['column--button-parent'], 'table-column']">
                <GeneralButton theme="danger" size="small" :whenClick="() => deletePasskey(passkey.name)">{{$t('views.mypage.passkey_remove')}}</GeneralButton>
              </div>
            </div>
            <div v-else :class="[$style.row, 'table-row']">
              <div :class="[$style.column, $style['column--single'], 'table-column', 'no-passkey']">
                ({{$t('views.mypage.no_passkey')}})
              </div>
            </div>
          </div>
          <div class="new-passkey-block">
            <InputField ref="passkeyName" class="passkey-name" type="text" :placeholder="$t('views.mypage.new_passkey_name')"/>
            <GeneralButton :whenClick="addPasskey">{{$t('views.mypage.passkey_add')}}</GeneralButton>
          </div>
          <CheckBox name="usePasswordlessLogin" value="Y" :checked="data.user.usePasswordlessLogin">{{$t('views.mypage.use_passwordless_login')}}</CheckBox>
        </div>
        <div :class="$style.form__row">
          <label>{{$t('views.mypage.api_token')}}</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton :class="$style.button" :whenClick="showTokenModal">{{$t('views.mypage.api_token_button')}}</GeneralButton>
          </div>
        </div>
        <div v-if="data.canWithdraw" :class="$style.form__row">
          <label>{{$t('views.mypage.account')}}</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton :class="$style.button" theme="danger" href="/member/withdraw">{{$t('views.mypage.withdraw')}}</GeneralButton>
          </div>
        </div>
        <div v-if="data.permissions.includes('engine_developer')" :class="$style.form__row">
          <label>엔진 개발자</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton v-if="data.permissions.includes('developer')" theme="danger" :whenClick="removeDeveloperPerm">개발자 권한 제거</GeneralButton>
            <GeneralButton v-else theme="primary" :whenClick="getDeveloperPerm">개발자 권한 받기</GeneralButton>
          </div>
        </div>
      </div>
    </div>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" theme="primary" type="submit">{{$t('views.mypage.submit')}}</GeneralButton>
      </div>
    </div>
  </SeedForm>
</template>
<script>
import { startRegistration } from '@simplewebauthn/browser'

import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import GeneralButton from '@/components/generalButton'
import SelectMenu from '@/components/selectMenu'
import LocalDate from '@/components/localDate'
import InputField from '@/components/form/inputField'
import ApiTokenModal from '@/components/apiTokenModal'
import SeedFormBlock from '@/components/form/seedFormBlock'
import CheckBox from '@/components/form/checkBox'

export default {
  mixins: [Common],
  components: {
    CheckBox,
    SeedFormBlock,
    InputField,
    LocalDate,
    GeneralButton,
    SeedForm,
    SelectMenu
  },
  computed: {
    data() {
      return this.$store.state.viewData;
    }
  },
  methods: {
    showTokenModal() {
      this.$vfm.show({ component: ApiTokenModal })
    },
    async addPasskey() {
      const optionsJSON = await this.internalRequest('/member/register_webauthn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.$refs.passkeyName.$el.value
        })
      })
      if(!optionsJSON) return
      if(optionsJSON.data) return alert(optionsJSON.data)

      let attResp
      try {
        attResp = await startRegistration({ optionsJSON })
      } catch(e) {
        console.error(e)
        alert(e.toString())
        return
      }

      await this.internalRequestAndProcess('/member/register_webauthn/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attResp)
      })
    },
    async deletePasskey(name) {
      await this.internalRequestAndProcess('/member/delete_webauthn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name
        })
      })
    },
    async getDeveloperPerm() {
      const reason = prompt('요청 사유 입력')
      if(!reason) return

      await this.internalRequestAndProcess('/member/get_developer_perm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          reason
        }).toString()
      })
    },
    async removeDeveloperPerm() {
      await this.internalRequestAndProcess('/member/remove_developer_perm', {
        method: 'POST'
      })
    },
    async removeExternalAccount(provider) {
      await this.internalRequestAndProcess(`/member/login/oauth2/${provider}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
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
.mypage-block {
  display: flex;
  gap: 2rem;
}

@media screen and (max-width: 727.98px) {
  .mypage-block {
    flex-direction: column;
  }
}

.avatar-block {
  align-items: center;
  display: flex;
  flex-direction: column;
  row-gap: .5rem;
  width: 10rem;
}

@media screen and (max-width: 727.98px) {
  .avatar-block {
    flex: 1;
    justify-content: center;
    width: auto;
  }
}

.avatar-image {
  aspect-ratio: 1/1;
  border-radius: 8px;
  display: block;
  width: 100%;
}

@media screen and (max-width: 727.98px) {
  .avatar-image {
    width: 8rem;
  }
}

@media screen and (max-width: 371.98px) {
  .avatar-image {
    width: 5rem;
  }
}

.avatar-description {
  font-size: .85rem;
  text-align: center;
  word-break: keep-all;
}

.form-block {
  flex: 1;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 4rem;
}

@media screen and (max-width: 1023.98px) {
  .table-row {
    gap:.1rem;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    padding: .5rem;
  }

  .table-column {
    margin: 0 !important;
    padding: 0 !important;
  }

  .table-column:first-child {
    grid-column: 1/2;
  }

  .table-column:nth-child(2),.table-column:nth-child(3) {
    font-size: .85rem;
    grid-column: 1/2;
  }
}

.table-column:nth-child(4) {
  justify-content: flex-end;
}

@media screen and (max-width: 1023.98px) {
  .table-column:nth-child(4) {
    grid-column: 2;
    grid-row: 1/3;
  }
}

.no-passkey {
  grid-column: 1/5;
}

.mobile-th {
  display: none;
  margin: 0 .25rem 0 0;
}

@media screen and (max-width: 1023.98px) {
  .mobile-th {
    display: initial;
  }
}

.new-passkey-block {
  align-self: flex-end;
  margin-top: .25rem;
  max-width: 20rem;
  width: 100%;
}

@media screen and (max-width: 1023.98px) {
  .new-passkey-block {
    align-self: auto;
    max-width: none;
  }
}

.passkey-name {
  width: 100%;
}

.new-passkey-block {
  display: flex;
}

.new-passkey-block> *:first-child {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.new-passkey-block> *:last-child {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

.new-passkey-block> *:not(:last-child) {
  border-right-width: 0;
}

.new-passkey-block> *:not(:first-child):not(:last-child) {
  border-radius: 0;
}

.new-passkey-block> *:focus {
  z-index: 200;
}

.color-text {
  align-items: center;
  display: inline-flex;
  gap: .4rem;
}

.color-text-green {
  color: #00a91c;
}

.theseed-dark-mode .color-text-green {
  color: #216e1f;
}

.color-text svg {
  height: 1em;
  fill: currentColor;
  overflow: visible;
}
</style>