<script>
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"
import AppLanding from "./components/AppLanding.vue"

export default {
  components: { 
    AppHeader,
    AppFooter,
    AppLanding
  }
}
</script>

<template>
  <AppHeader/>
  <AppLanding/>
  <AppFooter/>
</template>

<style scoped lang="scss">

</style>
