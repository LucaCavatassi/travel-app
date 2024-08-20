<script>
    export default {
        name: "landing-page",
    }
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-md-8">
                <h1>Map</h1>
            </div>
            <div class="list-col col-12 col-md-2 flex-grow-1">
                <router-link :to="{ name: 'single-result'}"> 
                    <h1>List</h1> 
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../style/general" as *;    
    .row {
        height: calc(100vh - $header-height - $footer-height);
    }
    .list-col{
        height: calc(100% - $header-height - $footer-height);
        overflow-y: auto;
    }
</style>