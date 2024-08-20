<script>
import axios from 'axios';

export default {
    name: "single-result",

    props: ['slug'],  

    data() {
        return {
            travel: {},
            locations: [],
            foods: [],
            facts: [],
        };
    },

    mounted() {
        this.fetchTravelDetail();
    },

    methods: {
        async fetchTravelDetail() {
            try {
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?slug=${this.slug}`);
                this.travel = response.data[0];
                
                if (this.travel && this.travel.id) {
                    await Promise.all([
                        this.fetchLocations(this.travel.id),
                        this.fetchFoods(this.travel.id),
                        this.fetchFacts(this.travel.id)
                    ]);
                }
            } catch (error) {
                console.error('There was an error fetching the travel details!', error);
            }
        },

        async fetchLocations(travelId) {
            try {
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?locations=${travelId}`);
                this.locations = response.data;
            
                
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        },

        async fetchFoods(travelId) {
            try {
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?foods=${travelId}`);
                this.foods = response.data;

            } catch (error) {
                console.error('Error fetching foods:', error);
            }
        },

        async fetchFacts(travelId) {
            try {
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?facts=${travelId}`);
                this.facts = response.data;
                
            } catch (error) {
                console.error('Error fetching facts:', error);
            }
        },
    }
};
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <h1>{{ travel.title }}</h1>
                <p>{{ travel.date }}</p>
                <p>{{ travel.description }}</p>
                <p>{{ travel.notes }}</p>

                <h2>Locations</h2>
                <ul v-if="locations.length">
                    <li v-for="location in locations" :key="location.id">
                        <p>{{ location.name }}</p>
                        <p>Lat: {{ location.lat }}, Long: {{ location.long }}</p>
                        <p>Rating: {{ location.rating }}</p>
                        <p>Done: {{ location.is_done ? 'Yes' : 'No' }}</p>
                    </li>
                </ul>
                <p v-else>No locations available.</p>

                <h2>Foods</h2>
                <ul v-if="foods.length">
                    <li v-for="food in foods" :key="food.id">
                        <p>{{ food.title }}</p>
                        <p>{{ food.description }}</p>
                        <p>Rating: {{ food.rating }}</p>
                        <p>Done: {{ food.is_done ? 'Yes' : 'No' }}</p>
                    </li>
                </ul>
                <p v-else>No foods available.</p>

                <h2>Facts</h2>
                <ul v-if="facts.length">
                    <li v-for="fact in facts" :key="fact.id">
                        <p>{{ fact.title }}</p>
                        <p>{{ fact.description }}</p>
                        <p>Done: {{ fact.is_done ? 'Yes' : 'No' }}</p>
                    </li>
                </ul>
                <p v-else>No facts available.</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @use "../style/general" as *;    

    .row {
        height: calc(100vh - $header-height - $footer-height);
        overflow-y: auto;
    }
</style>