<script>
import TravelForm from '../components/TravelForm.vue';

    export default {
        name: "add-new-travel",
        components: {
            TravelForm
        }
    }
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <TravelForm/>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../style/general" as *;    

    .row {
        height: calc(100vh - $header-height - $footer-height);
    }
</style>