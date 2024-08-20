<script>
    import axios from 'axios';

    export default {
        name: "single-result",

        props: ['slug'],  

        data() {
            return {
            travel: {}
            };
        },

        mounted() {
            this.fetchTravelDetail();
        },

        methods: {
            fetchTravelDetail() {
            axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?slug=${this.slug}`)
                .then(response => {
                this.travel = response.data[0];
                console.log(response.data);
                
                })
                .catch(error => {
                console.error('There was an error fetching the travel details!', error);
                });
            }
        }
    };
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <h1>{{ travel.title }}</h1>
                <p>{{ travel.description }}</p>
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
