<template>
  <SeedForm method="post" :class="[$style.form, $style['form--full'], $style['form--row-bordered']]">
    <div class="mypage-block">
      <div class="avatar-block">
        <img :src="session.gravatar_url + '&s=512'" class="avatar-image">
        <div class="avatar-description">
          사용자 아바타는 <a href="https://gravatar.com" rel="noopener" target="_blank">Gravatar</a>에서 제공됩니다.
        </div>
      </div>
      <div class="form-block">
        <div :class="$style.form__row">
          <div :class="$style['form__row-inner']">
            <label for="usernameInput">사용자 이름</label>
            <GeneralButton theme="link" href="/member/change_name">변경</GeneralButton>
          </div>
          <div>{{data.user.name}}</div>
        </div>
        <div :class="$style.form__row">
          <div :class="$style['form__row-inner']">
            <label for="emailInput">Email</label>
            <GeneralButton theme="link" href="/member/change_email">변경</GeneralButton>
          </div>
          <div>{{data.user.email}}</div>
        </div>
        <div :class="$style.form__row">
          <label for="emailInput">비밀번호</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton :class="$style.button" href="/member/change_password">변경</GeneralButton>
          </div>
        </div>
        <div :class="$style.form__row">
          <label for="permInput">권한</label>
          <div>{{data.permissions.join(', ')}}</div>
        </div>
        <div v-if="data.verifyEnabled" :class="$style.form__row">
          <label for="permInput">모바일 인증</label>
          <div :class="$style['form__row-inner']">
            <span v-if="data.permissions.includes('mobile_verified_member')" class="color-text color-text-green">
            <FontAwesomeIcon icon="fa-circle-check"/>
            인증됨
          </span>
            <GeneralButton v-else :class="$style.button" href="/member/signup_verify">인증</GeneralButton>
          </div>
        </div>
        <SeedFormBlock newStyle :class="$style.form__row" label="스킨" inputId="skinSelect">
          <div :class="$style['form__row-inner']">
            <SelectMenu id="skinSelect" name="skin" v-model="data.user.skin">
              <option value="default">기본 스킨</option>
              <option v-for="skin in data.skins">{{skin}}</option>
            </SelectMenu>
          </div>
        </SeedFormBlock>
        <div :class="$style.form__row">
          <label>일회용 비밀번호 (OTP)</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton v-if="data.hasTotp" theme="danger" :class="$style.button" href="/member/deactivate_otp">비활성화</GeneralButton>
            <GeneralButton v-else :class="$style.button" href="/member/activate_otp">활성화</GeneralButton>
          </div>
        </div>
        <div v-if="data.externalProviders?.length" :class="$style.form__row">
          <label>외부 계정 연결</label>
          <div :class="[$style.table, $style['table--bordered']]">
            <div :class="[$style.row, $style['row--head'], 'table-row']">
              <div v-for="text in ['제공자', '이름', '이메일', '']" :class="[$style.column, 'table-column']">{{text}}</div>
            </div>
            <div v-for="item in data.externalProviders" :class="[$style.row, 'table-row']">
              <div :class="[$style.column, 'table-column']">{{item.displayName}}</div>
              <div :class="[$style.column, 'table-column']">{{data.oauth2Maps[item.name]?.name}}</div>
              <div :class="[$style.column, 'table-column']">{{data.oauth2Maps[item.name]?.email}}</div>
              <div :class="[$style.column, $style['column--button-parent'], 'table-column']">
                <GeneralButton v-if="data.oauth2Maps[item.name]" theme="danger" size="small" :whenClick="() => removeExternalAccount(item.name)">해제</GeneralButton>
                <GeneralButton v-else theme="primary" size="small" :href="'/member/login/oauth2/' + item.name">등록</GeneralButton>
              </div>
            </div>
          </div>
        </div>
        <div v-if="data.hasTotp" :class="$style.form__row">
          <label>Passkey</label>
          <div :class="[$style.table, $style['table--bordered']]">
            <div :class="[$style.row, $style['row--head'], 'table-row']">
              <div v-for="text in ['이름', '등록 시각', '마지막 사용 시각', '']" :class="[$style.column, 'table-column']">{{text}}</div>
            </div>
            <div v-if="data.passkeys.length" v-for="passkey in data.passkeys" :class="[$style.row, 'table-row']">
              <div :class="[$style.column, 'table-column']">{{passkey.name}}</div>
              <div :class="[$style.column, 'table-column']"><LocalDate :date="passkey.createdAt"/></div>
              <div :class="[$style.column, 'table-column']">
                <LocalDate v-if="passkey.lastUsedAt" :date="passkey.lastUsedAt"/>
                <template v-else>Not used</template>
              </div>
              <div :class="[$style.column, $style['column--button-parent'], 'table-column']">
                <GeneralButton theme="danger" size="small" :whenClick="() => deletePasskey(passkey.name)">삭제</GeneralButton>
              </div>
            </div>
            <div v-else :class="[$style.row, 'table-row']">
              <div :class="[$style.column, $style['column--single'], 'table-column', 'no-passkey']">
                (등록된 Passkey가 없습니다.)
              </div>
            </div>
          </div>
          <div class="new-passkey-block">
            <InputField ref="passkeyName" class="passkey-name" type="text" placeholder="새 Passkey 이름"/>
            <GeneralButton :whenClick="addPasskey">추가</GeneralButton>
          </div>
          <CheckBox name="usePasswordlessLogin" value="Y" :checked="data.user.usePasswordlessLogin">비밀번호 없이 패스키만 이용해 로그인</CheckBox>
        </div>
        <div :class="$style.form__row">
          <label>API Token</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton :class="$style.button" :whenClick="showTokenModal">발급</GeneralButton>
          </div>
        </div>
        <div v-if="data.canWithdraw" :class="$style.form__row">
          <label>계정</label>
          <div :class="$style['form__row-inner']">
            <GeneralButton :class="$style.button" theme="danger" href="/member/withdraw">계정 삭제</GeneralButton>
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
        <GeneralButton :class="$style.button" theme="primary" type="submit">저장</GeneralButton>
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