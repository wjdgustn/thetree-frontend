<template>
  <p>
    <i18next :translation="$t('views.recover_password_email_sent.message')">
      <template #email>
        <b>{{data.email}}</b>
      </template>
    </i18next>
  </p>
  <ul>
    <li>{{$t('views.recover_password_email_sent.list_1')}}</li>
    <li>{{$t('views.recover_password_email_sent.list_2')}}</li>
    <li>{{$t('views.recover_password_email_sent.list_3')}}</li>
  </ul>
</template>