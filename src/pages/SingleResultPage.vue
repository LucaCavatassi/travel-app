<script>
import axios from 'axios';
import MapboxMapComponent from '../components/MapboxMapComponent.vue';

export default {
    name: "single-result",

    props: ['slug'],

    data() {
        return {
            travel: {},
            locations: [],
            foods: [],
            facts: [],
            images: [],
            travelIdToDelete: null,
        };
    },
    components: {
        MapboxMapComponent
    },

    mounted() {
        this.fetchTravelDetail();
        console.log(this.images);
        
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
                        this.fetchFacts(this.travel.id),
                        this.fetchImages(this.travel.id)
                    ]);
                }
            } catch (error) {
                console.error('There was an error fetching the travel details!', error);
            }
        },
        async fetchImages(travelId) {
            try {
                const response = await axios.get(`http://127.0.0.1:8888/api/travel_app_be/getImagesByTravelId.php`, {
                    params: { travel_id: travelId }
                });
                this.images = response.data;
            } catch (error) {
                console.error('Error fetching images:', error);
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
        async deleteTravel(travelId) {
            if (!travelId) {
                console.error('No travel ID to delete');
                return;
            }

            try {
                // Send DELETE request to the server
                const response = await axios.delete('http://localhost:8888/api/travel_app_be/db_connect.php', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: {
                        id: travelId,
                    },
                });

                if (response.data.success) {
                    console.log('Travel deleted successfully:', response.data);
                    this.$router.push({ name: 'landing-page' });
                } else {
                    console.error('Error deleting travel:', response.data.error);
                }
            } catch (error) {
                console.error('Error deleting travel:', error);
            }
        }

    }
};
</script>

<template>
    <div class="container-fluid">
        <div id="alertContainer"></div>
        <div class="row">
            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Confirm</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to delete <strong><i>{{ travel.title }}?</i></strong>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button @click="deleteTravel(travel.id)" type="button"
                                class="btn btn-primary">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CONTENT -->
            <div class="col">
                <!-- HEADER -->
                <div class="d-flex justify-content-between align-items-center">
                    <h1 class="mt-3 fw-bold">Travel details</h1>
                    <div class="btn-info">
                        <button class="btn btn-secondary me-3"><router-link id="link"
                                :to="{ name: 'edit-form', params: { slug: travel.slug } }">Edit
                                travel</router-link></button><button class="btn btn-secondary me-3"><router-link id="link"
                                :to="{ name: 'add-images', params: { slug: travel.slug } }">Add Images</router-link></button>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#exampleModal">Delete travel</button>
                    </div>
                </div>

                <!-- MAIN-INFO -->
                <div class="py-3 main-info">
                    <h3 class="mb-0 fw-bolder">Title</h3>
                    <p class="fs-6 mb-3">{{ travel.title }}</p>
                    <h5 class="mb-0 fw-bolder">Date</h5>
                    <p class="fs-6 mb-3">{{ travel.date }}</p>

                    <h5 class="mb-0 fw-bolder">Description</h5>
                    <p class="fs-6 mb-3">{{ travel.description }}</p>

                    <h5 class="mb-0 fw-bolder">Notes</h5>
                    <p class="fs-6 mb-3">{{ travel.notes }}</p>
                </div>

                <div class="col-12 col-md-8 px-0 d-block">
                    <h3 class="fw-bold">Map</h3>
                    <MapboxMapComponent :locations="locations" />
                </div>
                <!-- LOCATIONS -->
                <div class="locations">
                    <h3 class="fw-bold">Locations to visit</h3>
                    <ul class="ps-0" v-if="locations.length">
                        <li class="d-flex" v-for="location in locations" :key="location.id">
                            <p class="me-3 fst-italic">{{ location.name }}</p>
                            <div class="dropdown">
                                <a class="dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    More Details
                                </a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <p class="me-2 dropdown-item">Rating: {{ location.rating }}</p>
                                    </li>
                                    <li>
                                        <p class="me-2 dropdown-item">Visited: {{ location.is_done == 1 ? 'Yes' : 'No'
                                            }}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <p v-else>No locations available.</p>
                </div>

                <!-- FOODS -->
                <div class="foods">
                    <h3 class="fw-bold">Foods to try</h3>
                    <ul class="ps-0" v-if="foods.length">
                        <li class="d-flex" v-for="food in foods" :key="food.id">
                            <p class="me-3 fst-italic">{{ food.title }}</p>
                            <div class="dropdown">
                                <a class="dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    More Details
                                </a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <p class="me-2 dropdown-item">Rating: {{ food.rating }}</p>
                                    </li>
                                    <li>
                                        <p class="me-2 dropdown-item">Tried: {{ food.is_done == 1 ? 'Yes' : 'No' }}</p>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <p v-else>No foods available.</p>
                </div>

                <!-- FACTS -->
                <div class="facts">
                    <h3 class="fw-bold">Fun Facts</h3>
                    <ul class="ps-0" v-if="facts.length">
                        <li class="d-flex" v-for="fact in facts" :key="fact.id">
                            <p class="me-3 fst-italic">{{ fact.title }}</p>
                            <div class="dropdown">
                                <a class="dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    More Details
                                </a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <p class="me-2 dropdown-item">{{ fact.description }}</p>
                                    </li>
                                </ul>
                            </div>

                        </li>
                    </ul>
                    <p v-else>No fun facts available.</p>
                </div>

                <div class="images">
                    <h3 class="fw-bold">Images</h3>
                    <div v-if="images.length">
                        <div id="carouselExampleIndicators" class="carousel slide">
                            <div class="carousel-indicators">
                                <button
                                    v-for="(image, index) in images"
                                    :key="index"
                                    type="button"
                                    :data-bs-target="'#carouselExampleIndicators'"
                                    :data-bs-slide-to="index"
                                    :class="{ active: index === 0 }"
                                    :aria-label="'Slide ' + (index + 1)"
                                ></button>
                            </div>
                            <div class="carousel-inner">
                                <div v-for="(image, index) in images" :key="index" class="carousel-item" :class="{ active: index === 0 }">
                                    <img :src="`http://127.0.0.1:8888/api/travel_app_be/uploads/${image}`" alt="Travel Image" />
                                </div>
                            </div>
                            <div v-if="images.length > 1">
                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p v-else>No images available</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../style/general" as *;

img {
    max-width: 100%;
    height: auto;
}

.image-container {
    margin-bottom: 15px;
    position: relative;
}

.row {
    height: calc(100vh - $header-height - $footer-height);
    overflow-y: auto;
}

.btn-primary {
    background-color: $purple;
    border-color: $purple;
}

.btn-primary:hover {
    background-color: $light-purple;
    border-color: $light-purple;
}

.btn-secondary {
    background-color: $secondary-blue;
    border-color: $secondary-blue;
}

.btn-secondary:hover {
    background-color: $blue;
    border-color: $blue;
}

#link {
    text-decoration: none;
    color: inherit;
}

.matemasie-regular {
    font-family: "Matemasie", sans-serif;
    font-weight: 400;
    font-style: normal;
}
</style>