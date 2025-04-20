<template>
  <SeedForm flex box>
    <label for="namespaceSelect">이름공간:</label>
    <SelectMenu id="namespaceSelect" name="namespace" :value="$route.query.namespace || namespaces[0]?.namespace">
      <option v-for="ns in namespaces" :value="ns.namespace">{{ns.namespace}} ({{ns.count}})</option>
    </SelectMenu>
    <SelectMenu name="flag" :value="$route.query.flag || 0">
      <option value="0">(전체)</option>
      <option value="1">link</option>
      <option value="2">file</option>
      <option value="4">include</option>
      <option value="8">redirect</option>
    </SelectMenu>
    <GeneralButton type="submit" theme="primary">제출</GeneralButton>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SelectMenu from '@/components/SelectMenu'
import GeneralButton from '@/components/generalButton'

export default {
  components: {
    SeedForm,
    SelectMenu,
    GeneralButton
  },
  props: {
    namespaces: {
      type: Array,
      required: true
    }
  }
}
</script>
<style scoped>
select {
  min-width: 12rem;
}
</style>