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
                const response = await axios.get('https://powerful-ridge-67538-6182a975cd63.herokuapp.com/index.php');
                console.log(response.data);

                this.travels = response.data;
            } catch (error) {
                console.error('Error fetching travels:', error);
            }
        },
        async fetchLocations() {
            try {
                const response = await axios.get('https://powerful-ridge-67538-6182a975cd63.herokuapp.com/index.php?locations=all');
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
            <div class="list-col col-12 col-md-2 flex-grow-1 p-3">
                <h3 class="fw-bold">Your travels</h3>
                <ul class="px-0 py-2">
                    <li class="mb-3 p-3" v-for="travel in travels" :key="travel.id">
                        <template v-if="travel.slug">
                            <router-link id="link" :to="{ name: 'single-result', params: { slug: travel.slug } }">
                                {{ travel.title }}
                            </router-link><br>
                        </template>
                        <template v-else>
                            {{ travel.title }}<br>
                        </template>
                        {{ travel.description }}
                    </li>
                </ul>
            </div>
            <div class="col-12 col-md-8 px-0 d-none d-md-block">
                <MapboxMapComponent :locations="locations" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../style/general" as *;

.row {
    height: calc(100vh - $header-height - $footer-height);
}

.list-col {
    height: calc(100vh - $header-height - $footer-height);
    overflow-y: auto;

    li {
        list-style-type: none;
        border: 1px solid $blue;
        border-radius: 15px;
    }
}

#link {
    text-decoration: none;
    color: $purple;
}
#link:hover {
    text-decoration: none;
    color: $light-purple;
}
</style>