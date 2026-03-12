<template>
  <SeedForm flex box>
    <label for="namespaceSelect">{{$t('components.namespace_selector.namespace')}}</label>
    <SelectMenu id="namespaceSelect" name="namespace" :value="selected || $route.query.namespace || actualNamespaces[0]">
      <option v-for="item in actualNamespaces" :value="item">{{$t(`namespaces.${item}`, { defaultValue: item, lng: config.lang || 'ko' })}}</option>
    </SelectMenu>
    <GeneralButton type="submit" theme="primary">{{$t('components.namespace_selector.submit')}}</GeneralButton>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SelectMenu from '@/components/selectMenu'
import GeneralButton from '@/components/generalButton'

export default {
  components: {
    SeedForm,
    SelectMenu,
    GeneralButton
  },
  props: {
    namespaces: Array,
    selected: String
  },
  computed: {
    actualNamespaces() {
      return this.namespaces || this.data.namespaces
    }
  }
}
</script>
<style scoped>
select {
  min-width: 12rem;
}

@media screen and (max-width: 1023.98px) {
  form {
    width: 100%;
  }
}

@media screen and (max-width: 727.98px) {
  form {
    flex-direction: column;
  }

  form>* {
    width: 100%;
  }

  select {
    min-width: 10rem;
  }
}
</style>