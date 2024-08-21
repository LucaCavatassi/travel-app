<script>
    import axios from "axios";
    import MapboxMapComponent from '../components/MapboxMapComponent.vue';

    export default {
        name: "landing-page",
        components: {
            MapboxMapComponent,
        },
        data() {
            return {
                travels: [],
                locations: []
            };
        },

        mounted() {
            this.fetchTravels();
            this.fetchLocations();
        },

        methods: {
            async fetchTravels() {
                try {
                    const response = await axios.get('http://localhost:8888/api/travel_app_be/db_connect.php');
                    this.travels = response.data;
                } catch (error) {
                    console.error('Error fetching travels:', error);
                }
            },
            async fetchLocations() {
                try {
                    const response = await axios.get('http://localhost:8888/api/travel_app_be/db_connect.php?locations=all');
                    this.locations = response.data;
                } catch (error) {
                    console.error('Error fetching locations:', error);
                }
            },
        }

    }
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-md-8 px-0">
                <MapboxMapComponent :locations="locations" />
            </div>
            <div class="list-col col-12 col-md-2 flex-grow-1 h-100 p-3">
                <h3>All my travels</h3>
                <ul class="px-0 py-2">    
                    <li class="mb-3 p-3" v-for="travel in travels"><router-link :to="{ name: 'single-result', params: {slug: travel.slug}}">{{ travel.title }}
                        </router-link><br> {{ travel.description }}</li>
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
        li {
            list-style-type: none;
            border: 1px solid black;
            border-radius: 15px;
        }
    }
</style>