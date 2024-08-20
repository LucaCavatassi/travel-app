<script>
</script>

<template>
    <nav class="navbar navbar-expand-md" aria-label="Fourth navbar example">
        <div class="container-fluid ms-header">
            <router-link :to="{ name: 'landing-page'}"> 
                <a class="navbar-brand" href="#">Travel-Tracker</a>
            </router-link>
            
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-items" aria-controls="navbar-items" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

            <div class="collapse navbar-collapse" id="navbar-items">
                <ul class="navbar-nav ms-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">
                            <router-link :to="{ name: 'add-new-travel'}"> 
                                <span>Add New Travel</span>
                            </router-link>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

</template>

<style scoped lang="scss">
    .navbar {
        height: 80px;
        background-color: grey;
        --bs-navbar-brand-color: white;

    }
</style>
