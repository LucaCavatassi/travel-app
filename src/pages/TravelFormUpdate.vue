<script>
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import AddressInput from '../components/AddressInput.vue';

export default {
    data() {
        return {
            travel: {
                title: '',
                description: '',
                date: '',
                notes: '',
                locations: [],
                foods: [],
                facts: [],
                images: []
            },
            mapboxToken: 'pk.eyJ1IjoibHVjYW1hcmlhY2F2YXRhc3NpIiwiYSI6ImNtMDNpZjlncDBid3oyaXFscGh5ODk5YWkifQ.w7Bhbf-lZDgIxyvCmGfT1A', // Replace with your Mapbox token
        };
    },
    components: {
        AddressInput
    },
    created() {
        this.fetchTravelDetail();
        // console.log(this.travel.images);

    },
    methods: {
        handleFileUpload(event) {
            const files = Array.from(event.target.files);
            const validImages = files.filter(file => {
                // Check if the file is an image
                return file && file.type.startsWith('image/');
            });

            if (validImages.length === 0) {
                console.error('No valid images selected.');
                return;
            }

            this.travel.images.push(...validImages);
            console.log(this.travel.images);
        },
        getImageUrl(image) {
            // Handle the case where `image` is a File object
            if (image instanceof File) {
                return URL.createObjectURL(image);
            }

            // Handle the case where `image` is an object with `image_url` property
            if (typeof image === 'object' && image !== null && image.image_url) {
                return `http://localhost:8888/api/travel_app_be/uploads/${image.image_url}`;
            }

            // Handle unexpected types
            console.error('Unexpected image type:', image);
            return '';
        },
        removeImage(index) {

            const imageName = this.travel.images[index].image_url;

            // Log the URL to be removed for debugging purposes
            console.log('Removing image:', this.travel.images[index].image_url);

            // Remove the image at the specified index
            this.travel.images.splice(index, 1);
            // Send an AJAX POST request to the server to remove the image
            axios.post('http://localhost:8888/api/travel_app_be/remove_image.php', new URLSearchParams({
                image: imageName
            }))
                .then(response => {
                    console.log('Server response:', response.data);
                })
                .catch(error => {
                    console.error('Error removing image:', error);
                });
        },
        async fetchTravelDetail() {
            try {
                const slug = this.$route.params.slug;

                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?slug=${slug}`);
                // console.log(response.data[0]);

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
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?images=${travelId}`);
                this.travel.images = response.data;
                // console.log(this.travel.images);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        },

        async fetchLocations(travelId) {
            try {
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?locations=${travelId}`);
                this.travel.locations = response.data;
                // console.log(this.locations);



            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        },

        async fetchFoods(travelId) {
            try {
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?foods=${travelId}`);
                this.travel.foods = response.data;

            } catch (error) {
                console.error('Error fetching foods:', error);
            }
        },

        async fetchFacts(travelId) {
            try {
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?facts=${travelId}`);
                this.travel.facts = response.data;

            } catch (error) {
                console.error('Error fetching facts:', error);
            }
        },
        initializeGeocoder() {
            // Initialize the Mapbox Geocoder
            mapboxgl.accessToken = this.mapboxToken;
            this.geocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: 'Search for places',
                countries: 'us'
            });
        },
        async geocodeLocation(location, index) {
            try {
                const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location.name)}.json`, {
                    params: {
                        access_token: this.mapboxToken
                    }
                });

                const features = response.data.features;
                if (features.length > 0) {
                    const [long, lat] = features[0].geometry.coordinates;

                    console.log(long, lat);
                    location.long = long
                    location.lat = lat

                } else {
                    console.error('No results found for location:', location.name);
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        },
        async submitTravel() {
    try {
        // Perform geocoding for locations
        const geocodePromises = this.travel.locations.map((location, index) => this.geocodeLocation(location, index));
        await Promise.all(geocodePromises);

        if (this.validateForm()) {
            const payload = {
                id: this.travel.id,
                title: this.travel.title,
                description: this.travel.description,
                date: this.travel.date,
                notes: this.travel.notes,
                locations: this.travel.locations,
                foods: this.travel.foods,
                facts: this.travel.facts
            };

            // Handle image uploads separately if needed
            if (Array.isArray(this.travel.images) && this.travel.images.length > 0) {
                // Convert images to Base64 or another format if necessary
                // payload.images = await this.convertImagesToBase64(this.travel.images);
            }

            // Log payload for debugging
            console.log('Payload:', payload);

            // Make the API request
            const response = await axios.put('http://127.0.0.1:8888/api/travel_app_be/db_connect.php', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check for successful response
            if (response.data.success) {
                const alertContainer = document.getElementById('alertContainer');
                alertContainer.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        Travel plan submitted successfully!
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;

                console.log('Response:', response.data);

                this.clearForm();
                const slug = response.data.slug;
                this.$router.push({ name: 'single-result', params: { slug: slug } });
            } else {
                console.error('API Error:', response.data);
                throw new Error('Travel update failed.');
            }
        } else {
            console.error('Form validation failed.');
        }
    } catch (error) {
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                An error occurred while submitting the travel plan. Please try again.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        console.error('API Error:', error.response ? error.response.data : error.message);
    }
},
        clearForm() {
            // Reset the travel object to its initial state (adjust as needed for your form structure)
            this.travel = {
                locations: [],
                // Reset other fields if necessary
            };

            // Optionally, if you're using a form element, you can reset it
            const form = document.getElementById('travelForm'); // Replace with your form ID
            if (form) {
                form.reset();
            }
        },

        validateForm() {
            const form = document.querySelector('form');
            if (form.checkValidity() === false) {
                form.classList.add('was-validated');
                return false;
            }
            return true;
        },

        addLocation() {
            this.travel.locations.push({ name: '', rating: 0, is_done: false, lat: null, long: null });
        },
        removeLocation(index) {
            this.travel.locations.splice(index, 1);
        },
        addFood() {
            this.travel.foods.push({ title: '', description: '', rating: 0, is_done: false });
        },
        removeFood(index) {
            this.travel.foods.splice(index, 1);
        },
        addFact() {
            this.travel.facts.push({ title: '', description: '', is_done: false });
        },
        removeFact(index) {
            this.travel.facts.splice(index, 1);
        }
    },
    mounted() {
        this.addLocation(); // Start with one location
    }
};
</script>


<template>
    <div class="container">
        <div class="row">
            <form id="travelForm" @submit.prevent="submitTravel" class="mb-3 mt-3" novalidate>
                <h2 class="fw-bold">Update Travel</h2>

                <div id="alertContainer"></div>

                <!-- Travel Details -->
                <div class="main-info mb-2 border border-primary rounded p-4">
                    <div class="mb-3">
                        <label for="title" class="form-label mb-2">Title</label>
                        <input type="text" v-model="travel.title" id="title" class="form-control" required />
                        <div class="invalid-feedback">Please provide a title.</div>
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label mb-2">Description</label>
                        <textarea v-model="travel.description" id="description" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="date" class="form-label mb-2">Date</label>
                        <input type="date" v-model="travel.date" id="date" class="form-control" required />
                        <div class="invalid-feedback">Please provide a date.</div>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label mb-2">Notes</label>
                        <textarea v-model="travel.notes" id="notes" class="form-control"></textarea>
                    </div>
                </div>
                <!-- Images -->
                <div class="mb-2 border border-primary rounded p-4">
                    <div class="images mb-2">
                        <div class="mb-3">
                            <label for="images" class="form-label">Upload Images</label>
                            <input type="file" id="images" class="form-control" @change="handleFileUpload" multiple />
                            <div class="invalid-feedback">Please upload at least one image.</div>
                        </div>

                        <div v-if="travel.images?.length > 0">
                            <h3>Uploaded Images</h3>
                            <div class="d-flex">
                                <div v-for="(image, index) in travel.images" :key="index" class="image-preview">
                                    <p>{{ image.id }}</p>
                                    <img :src="getImageUrl(image)" alt="Image preview" class="img-thumbnail" />
                                    <button @click="removeImage(index)" id="remove_btn" class="btn btn-danger"><i
                                            class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Locations -->
                <h3 class="fw-bold">Locations</h3>
                <div class="mb-2 border border-primary rounded p-4">
                    <div v-for="(location, index) in travel.locations" :key="index" class="mb-3">
                        <label :for="'location' + index" class="form-label mb-2">Location Name</label>

                        <div :id="'location' + index" class="input-container">
                            <AddressInput v-model="location.name" />
                            <!-- <input v-model="location.name" class="form-control" required /> -->
                        </div>
                        <div class="invalid-feedback">Please provide a location.</div>

                        <label :for="'locationRating' + index" class="form-label mb-2">Rating:</label>
                        <input type="number" v-model="location.rating" min="0" max="5" class="form-control" />

                        <div class="d-flex align-items-center justify-content-between mt-2">
                            <div class="">
                                <label :for="'locationDone' + index" class="form-label mb-2 m-0">Visited</label>
                                <input type="checkbox" v-model="location.is_done" class="ms-2 form-check-input" />
                            </div>

                            <button type="button" class="btn btn-danger" @click="removeLocation(index)">Remove
                                Location</button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary mb-3" @click="addLocation">Add Location</button>
                </div>

                <!-- Foods -->
                <h3 class="fw-bold">Foods</h3>
                <div class="mb-2 border border-primary rounded p-4">
                    <div v-for="(food, index) in travel.foods" :key="index" class="mb-3">
                        <label :for="'food' + index" class="form-label mb-2">Food Name</label>
                        <input :id="'food' + index" v-model="food.title" class="form-control mb-2" required />
                        <div class="invalid-feedback">Please provide a food title.</div>

                        <label :for="'foodDescription' + index" class="form-label mb-2">Description</label>
                        <textarea v-model="food.description" class="form-control mb-2"></textarea>

                        <label :for="'foodRating' + index" class="form-label mb-2">Rating</label>
                        <input type="number" v-model="food.rating" min="0" max="5" class="form-control mb-2" />

                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <label :for="'foodDone' + index" class="form-label mb-2 m-0">Tried</label>
                                <input type="checkbox" v-model="food.is_done" class="form-check-input ms-2" />
                            </div>
                            <button type="button" class="btn btn-danger mt-2" @click="removeFood(index)">Remove
                                Food</button>
                        </div>

                    </div>
                    <button type="button" class="btn btn-primary mb-3" @click="addFood">Add Food</button>
                </div>

                <!-- Facts -->
                <h3 class="fw-bold">Facts</h3>
                <div class="mb-2 border border-primary rounded p-4">
                    <div v-for="(fact, index) in travel.facts" :key="index" class="mb-3">
                        <label :for="'fact' + index" class="form-label mb-2">Fact Title</label>
                        <input :id="'fact' + index" v-model="fact.title" class="form-control mb-2" required />
                        <div class="invalid-feedback">Please provide a fact title.</div>

                        <label :for="'factDescription' + index" class="form-label mb-2">Description</label>
                        <textarea v-model="fact.description" class="form-control mb-2"></textarea>

                        <div class="d-flex justify-content-end align-items-center mt-2">
                            <button type="button" class="btn btn-danger" @click="removeFact(index)">Remove Fact</button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary mb-3" @click="addFact">Add Fact</button>
                </div>

                <div class="d-flex justify-content-end">
                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-secondary">Update Plan</button>
                </div>
            </form>
        </div>
    </div>
</template>


<style scoped lang="scss">
@use "../style/general" as *;

.image-preview {
    width: 200px;
    height: auto;
    position: relative;
}

#remove_btn {
    position: absolute;
    top: 5px;
    right: 5px;
}

.row {
    height: calc(100vh - $header-height - $footer-height);
    overflow-y: auto;
}

.was-validated .form-control:invalid,
.was-validated .form-check-input:invalid {
    border-color: #dc3545;
}

.was-validated .form-control:valid,
.was-validated .form-check-input:valid {
    border-color: #28a745;
}

.map-container {
    width: 0;
    height: 0;
    visibility: hidden;
}

.btn-primary {
    background-color: $purple;
    border-color: $purple;
}

.border-primary {
    // background-color: $purple;   
    border-color: $purple !important;
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
</style>