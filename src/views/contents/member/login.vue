<template>
  <FormErrorAlert/>
  <SeedForm method="post" captcha>
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
        <GeneralButton href="/member/signup">계정 만들기</GeneralButton>
        <GeneralButton type="submit" theme="primary">로그인</GeneralButton>
      </template>
    </FlexFormBlock>

    <template v-if="externalProviders.length">
      <hr>
      <div class="external-login-buttons">
        <GeneralButton v-for="item in externalProviders" block :style="{
        '--login-button-background-color': ($store.state.isDark && item.buttonColor) || item.buttonColor || undefined,
        '--login-button-background-hover-color': item.buttonHoverColor || undefined,
        '--login-button-background-dark-hover-color': item.darkButtonHoverColor || undefined,
        '--login-button-color': ($store.state.isDark && item.darkTextColor) || item.textColor || undefined
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
      return [
        {
          text: 'Google 로그인'
        },
        {
          text: 'Kakao 로그인',
          buttonColor: '#fee500',
          darkTextColor: '#000000'
        },
        {
          text: 'Naver 로그인',
          buttonColor: '#03c157',
          textColor: '#ffffff'
        }
      ].map(a => {
        const buttonHoverColor = a.buttonColor && Color(a.buttonColor).darken(0.1).hex()
        return {
          ...a,
          buttonHoverColor,
          darkButtonHoverColor: (a.darkButtonColor && Color(a.darkButtonColor).lighten(0.1).hex()) || buttonHoverColor
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

.external-login-buttons div {
  margin-top: .5rem;
  --button-background-color: var(--login-button-background-color);
  --button-background-hover-color: var(--login-button-background-hover-color);
  --button-background-dark-hover-color: var(--login-button-background-dark-hover-color);
  --button-color: var(--login-button-color);
}

.external-login-buttons div img {
  width: 20px;
  height: 20px;
  min-width: 20px;
}
</style>