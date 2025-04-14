<template>
  <form method="post">
    <div class="form-block">
      <label for="usernameInput">사용자 이름</label>
      <p>{{data.user.name}}</p>
      <SeedLinkButton to="/member/change_name" info>이름 변경</SeedLinkButton>
    </div>

    <div class="form-block">
      <label for="emailInput">이메일</label>
      <p>
        {{data.user.email}}
        <SeedLinkButton to="/member/change_email" info>이메일 변경</SeedLinkButton>
      </p>
    </div>

    <div class="form-block">
      <label for="permInput">권한</label>
      <p>{{data.permissions.join(', ')}}</p>
    </div>

    <div class="form-block">
      <label for="passwordInput">비밀번호</label>
      <SeedLinkButton to="/member/change_password" info>비밀번호 변경</SeedLinkButton>
    </div>

    <div class="form-block">
      <label for="skinInput">스킨</label>
      <select id="skinInput" name="skin">
        <option value="default" :selected="data.user.skin === 'default'">기본 스킨</option>
        <template v-for="skin in data.skins">
          <option :selected="data.user.skin === skin">{{skin}}</option>
        </template>
      </select>
    </div>

    <div class="form-block">
      <label>이중인증</label>
      <template v-if="data.hasTotp">
        <SeedLinkButton to="/member/deactivate_otp" danger>TOTP 비활성화</SeedLinkButton>
        <div class="new-passkey-block">
          <input id="passkey-name-input" type="text" placeholder="Passkey Name">
          <SeedButton id="add-passkey-button" type="button" submit>Passkey 추가</SeedButton>
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
                <SeedButton type="button" danger>삭제</SeedButton>
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
    </div>

    <div class="form-block">
      <label for="passwordInput">API Token</label>
      <SeedButton type="button" danger>발급</SeedButton>
    </div>

    <div class="button-block">
      <SeedLinkButton v-if="data.canWithdraw" to="/member/withdraw" danger>계정 삭제</SeedLinkButton>
      <SeedButton submit>변경</SeedButton>
    </div>
  </form>
</template>
<script>
import SeedButton from '@/components/seedButton.vue';
import SeedLinkButton from '@/components/seedLinkButton.vue'
import LocalDate from '@/components/localDate.vue';

export default {
  components: {
    SeedButton,
    SeedLinkButton,
    LocalDate
  },
  computed: {
    data() {
      return this.$store.state.viewData;
    }
  }
}
</script>
<style scoped>
form div.form-block {
  margin-bottom: 15px;
}

@media screen and (min-width: 34rem) {
  form label {
    display: block;
  }
}

form label {
  margin-bottom: .5rem;
}

form input,form select {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  display: inline-block;
  font-size: .9rem;
  line-height: 1.5;
  margin: 0 0 0 .7rem;
  padding: .25rem .5rem;
  width: calc(100% - .7rem);
}

form div.button-block {
  column-gap: .25rem;
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.theseed-dark-mode form input, .theseed-dark-mode form select {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
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