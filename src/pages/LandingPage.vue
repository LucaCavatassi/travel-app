<script>
    import axios from "axios";

    export default {
        name: "landing-page",

        data() {
            return {
                travels: [],
            };
        },

        mounted() {
            this.fetchTravels();
        },

        methods: {
            fetchTravels() {
                axios.get('http://localhost:8888/api/travel_app_be/db_connect.php')
                    .then(response => {
                        this.travels = response.data;
                        console.log(this.travels);
                        
                    })
                    .catch(error => {
                        console.error('There was an error fetching the travels!', error);
                });
            }
        }

    }
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-md-8">
                <h1>Map</h1>
            </div>
            <div class="list-col col-12 col-md-2 flex-grow-1">
                <ul>    
                    <li v-for="travel in travels"><router-link :to="{ name: 'single-result', params: {slug: travel.slug}}">{{ travel.title }} - {{ travel.description }}</router-link></li>
                </ul>
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