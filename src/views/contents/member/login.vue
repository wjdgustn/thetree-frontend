<template>
  <FormErrorAlert/>
  <SeedForm method="post" captcha>
    <template v-if="!data.disableInternal">
      <FlexFormBlock label="Email" name="email" inputId="emailInput">
        <InputField id="emailInput" name="email"/>
      </FlexFormBlock>
      <FlexFormBlock label="Password" name="password" inputId="passwordInput">
        <InputField id="passwordInput" name="password" type="password"/>
      </FlexFormBlock>
      <FlexFormBlock flexStart>
        <NuxtLink to="/member/recover_password">비밀번호를 잊으셨나요?</NuxtLink>
      </FlexFormBlock>
      <FlexFormBlock buttons padding>
        <CheckBox name="autologin" value="Y">자동 로그인</CheckBox>
        <template #buttons>
          <GeneralButton v-if="!data.disableSignup" href="/member/signup">계정 만들기</GeneralButton>
          <GeneralButton type="submit" theme="primary">로그인</GeneralButton>
        </template>
      </FlexFormBlock>
    </template>

    <template v-if="externalProviders.length">
      <div class="or" v-if="!data.disableInternal">외부 로그인</div>
      <div class="external-login-buttons">
        <GeneralButton v-for="item in externalProviders" block class="external-login-button" :href="`/member/login/oauth2/${item.name}?redirect=${encodeURIComponent($route.query.redirect)}`" :style="{
        '--light-article-background-color': item.buttonColor || undefined,
        '--dark-article-background-color': item.darkButtonColor || undefined,
        '--button-background-hover-color': item.buttonHoverColor || undefined,
        '--button-background-dark-hover-color': item.darkButtonHoverColor || undefined,
        '--light-text-color': item.textColor || undefined,
        '--dark-text-color': item.darkTextColor || undefined
      }">
          <img v-if="item.logo || item.darkLogo" :src="($store.state.isDark && item.darkLogo) || item.logo || item.darkLogo">
          {{($store.state.isDark && item.darkText) || item.text}}
        </GeneralButton>
      </div>
    </template>

    <input type="hidden" name="redirect" :value="$route.query.redirect">
  </SeedForm>
</template>
<script>
import Color from 'color'

import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import FlexFormBlock from '@/components/form/flexFormBlock'
import InputField from '@/components/form/inputField'
import NuxtLink from '@/components/global/nuxtLink'
import CheckBox from '@/components/form/checkBox'
import GeneralButton from '@/components/generalButton'

export default {
  components: {
    SeedForm,
    FormErrorAlert,
    FlexFormBlock,
    InputField,
    NuxtLink,
    CheckBox,
    GeneralButton
  },
  computed: {
    externalProviders() {
      return this.data.externalProviders?.map(a => {
        const buttonHoverColor = a.buttonColor && Color(a.buttonColor).darken(0.1).hex()
        const darkButtonHoverColor = a.darkButtonColor && Color(a.darkButtonColor).lighten(0.1).hex()
        return {
          ...a,
          buttonHoverColor,
          darkButtonHoverColor
        }
      })
    }
  }
}
</script>
<style scoped>
form {
  margin: 0 auto;
  max-width: 28rem;
}

.buttons-group {
  align-items: center;
  column-gap: .5rem;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
}

.or {
  display: flex;
  align-items: center;
  text-align: center;
}

.or::before,
.or::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e1e8ed;
}

.or:not(:empty)::before {
  margin-right: .25em;
}

.or:not(:empty)::after {
  margin-left: .25em;
}

.external-login-button {
  margin-top: .5rem;
}

.external-login-button:last-child {
  margin-bottom: .5rem;
}

.external-login-button img {
  width: 20px;
  min-width: 20px;
}
</style>