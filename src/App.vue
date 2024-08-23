<script>
import AppHeader from "./components/AppHeader.vue"
import AppFooter from "./components/AppFooter.vue"

export default {
  components: { 
    AppHeader,
    AppFooter,
  }
}
</script>

<template>
  <div class="lato-regular">
    <AppHeader/>
    <router-view></router-view>
    <AppFooter/>
  </div>
</template>

<style>
  .lato-regular {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>
