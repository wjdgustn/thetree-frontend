<template>
  <SeedForm method="post">
    <SeedFormBlock label="사용자 이름">
      <p>{{data.user.name}}</p>
      <SeedLinkButton to="/member/change_name" info>이름 변경</SeedLinkButton>
    </SeedFormBlock>

    <SeedFormBlock label="이메일">
      <p>
        {{data.user.email}}
        <SeedLinkButton to="/member/change_email" info>이메일 변경</SeedLinkButton>
      </p>
    </SeedFormBlock>

    <SeedFormBlock label="권한">
      <p>{{data.permissions.join(', ')}}</p>
    </SeedFormBlock>

    <SeedFormBlock label="비밀번호">
      <SeedLinkButton to="/member/change_password" info>비밀번호 변경</SeedLinkButton>
    </SeedFormBlock>

    <SeedFormBlock label="스킨" for="skinInput" name="skin">
      <SeedFormInput tag="select" id="skinInput" name="skin">
        <option value="default" :selected="data.user.skin === 'default'">기본 스킨</option>
        <template v-for="skin in data.skins">
          <option :selected="data.user.skin === skin">{{skin}}</option>
        </template>
      </SeedFormInput>
    </SeedFormBlock>

    <SeedFormBlock label="이중인증">
      <template v-if="data.hasTotp">
        <SeedLinkButton to="/member/deactivate_otp" danger>TOTP 비활성화</SeedLinkButton>
        <div class="new-passkey-block">
          <SeedFormInput ref="passkeyName" type="text" placeholder="Passkey Name"/>
          <SeedButton type="button" submit @click="addPasskey">Passkey 추가</SeedButton>
        </div>
        <table>
          <thead>
          <tr>
            <th>이름</th>
            <th>등록일</th>
            <th>마지막 사용</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <template v-if="data.passkeys.length" v-for="passkey in data.passkeys">
            <tr>
              <td>{{passkey.name}}</td>
              <td><LocalDate :date="passkey.createdAt"/></td>
              <td>
                <LocalDate v-if="passkey.lastUsedAt" :date="passkey.lastUsedAt"/>
                <template v-else>Not used</template>
              </td>
              <td>
                <SeedButton type="button" danger @click="deletePasskey(passkey.name)">삭제</SeedButton>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="4">등록된 Passkey가 없습니다.</td>
            </tr>
          </template>
          </tbody>
        </table>
      </template>
      <template v-else>
        <SeedLinkButton to="/member/activate_otp" info>TOTP 활성화</SeedLinkButton>
      </template>
    </SeedFormBlock>

    <SeedFormBlock label="API Token">
      <SeedButton type="button" danger>발급</SeedButton>
    </SeedFormBlock>

    <div class="button-block">
      <SeedLinkButton v-if="data.canWithdraw" to="/member/withdraw" danger>계정 삭제</SeedLinkButton>
      <SeedButton submit>변경</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import { startRegistration } from '@simplewebauthn/browser'

import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm.vue'
import SeedFormBlock from '@/components/form/seedFormBlock.vue'
import SeedFormInput from '@/components/form/seedFormInput.vue'
import SeedButton from '@/components/seedButton.vue'
import SeedLinkButton from '@/components/seedLinkButton.vue'
import LocalDate from '@/components/localDate.vue'

export default {
  mixins: [Common],
  components: {
    SeedForm,
    SeedFormBlock,
    SeedFormInput,
    SeedButton,
    SeedLinkButton,
    LocalDate
  },
  computed: {
    data() {
      return this.$store.state.viewData;
    }
  },
  methods: {
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

      let attResp
      try {
        attResp = await startRegistration({ optionsJSON })
      } catch(e) {
        console.error(e)
        alert(e.toString())
        return
      }

      const res = await this.internalRequest('/member/register_webauthn/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attResp)
      })
      await this.processInternalResponse(res)
    },
    async deletePasskey(name) {
      const res = await this.internalRequest('/member/delete_webauthn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name
        })
      })
      await this.processInternalResponse(res)
    }
  }
}
</script>
<style scoped>
.seed-form-input {
  width: calc(100% - .7rem);
}

form div.button-block {
  column-gap: .25rem;
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

table {
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 1rem;
  max-width: 100%;
  width: 100%;
}

table td, table th {
  border-top: 1px solid #eceeef;
  line-height: 1.5;
  padding: .5rem .7rem;
}

table tr:last-of-type td {
  border-bottom: 1px solid #eceeef;
}

table th {
  border-bottom: 2px solid #eceeef;
  text-align: left;
  vertical-align: bottom;
}

div.new-passkey-block {
  margin-top: 1rem;
}

div.new-passkey-block input {
  width: 30%;
}
</style>