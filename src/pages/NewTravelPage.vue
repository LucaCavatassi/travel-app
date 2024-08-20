<script>
    export default {
        name: "add-new-travel",
    }
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <h1>New Travel Page</h1>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../style/general" as *;    

    .row {
        height: calc(100vh - $header-height - $footer-height);
    }
</style>