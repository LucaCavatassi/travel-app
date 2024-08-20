<script>
    export default {
        name: "single-result"
    }
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <h1>Single-Travel</h1>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../style/general" as *;    

    .row {
        height: calc(100vh - $header-height - $footer-height);
    }
</style>
