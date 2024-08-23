<script>
</script>

<template>
    <nav class="navbar navbar-expand-md" aria-label="Fourth navbar example" data-bs-theme="dark">
        <div class="container-fluid ms-header">
            <router-link class="matemasie-regular fs-3" :to="{ name: 'landing-page'}"> 
               Travel Diary
            </router-link>
            
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-items" aria-controls="navbar-items" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

            <div class="collapse navbar-collapse" id="navbar-items">
                <ul class="navbar-nav ms-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <router-link :to="{ name: 'add-new-travel'}"> 
                            Add New Travel
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

</template>

<style scoped lang="scss">
@use "../style/general" as *;

    .navbar {
        height: 80px;
        background-color: $purple;
        --bs-navbar-brand-color: white;
    }
    .ms-header {
        a {
            text-decoration: none;
            color: white;
        }
    }
    .router-link-exact-active {
        text-decoration: none;
        color: $blue !important;

    }

    .matemasie-regular {
        font-family: "Matemasie", sans-serif;
        font-weight: 400;
        font-style: normal;
        }

    
</style>
