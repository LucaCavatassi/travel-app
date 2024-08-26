<script>
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import AddressInput from './AddressInput.vue';

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
    methods: {
        handleFileUpload(event) {
            this.travel.images.push(...Array.from(event.target.files));
            console.log(this.travel.images);

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
                const geocodePromises = this.travel.locations.map((location, index) => this.geocodeLocation(location, index));
                await Promise.all(geocodePromises);

                if (this.validateForm()) {
                    const formData = new FormData();

                    // Append travel details
                    formData.append('title', this.travel.title);
                    formData.append('description', this.travel.description);
                    formData.append('date', this.travel.date);
                    formData.append('notes', this.travel.notes);

                    // Append locations, foods, facts as JSON strings
                    formData.append('locations', JSON.stringify(this.travel.locations));
                    formData.append('foods', JSON.stringify(this.travel.foods));
                    formData.append('facts', JSON.stringify(this.travel.facts));

                    // Append images if they exist
                    if (Array.isArray(this.travel.images) && this.travel.images.length > 0) {
                        this.travel.images.forEach((image, index) => {
                            formData.append('images[]', image);
                        });
                    }

                    // Make the API request
                    const response = await axios.post('http://127.0.0.1:8888/api/travel_app_be/db_connect.php', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    // Display success alert
                    const alertContainer = document.getElementById('alertContainer');
                    alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    Travel plan submitted successfully!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;

                    // Log response
                    
                    // Clear the form fields
                    this.clearForm();
                    console.log('Response:', response.data);
                    // Optionally redirect
                    const slug = response.data.slug;

                    this.$router.push({ name: 'single-result', params: { slug: slug } });
                    // Redirect to the new travel page using the slug

                } else {
                    console.error('Form validation failed.');
                }

            } catch (error) {
                // Display error alert
                const alertContainer = document.getElementById('alertContainer');
                alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                An error occurred while submitting the travel plan.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

                // Log the error
                console.error('API Error:', error.response ? error.response.data : error);
            }
        },
        clearForm() {
            // Reset the travel object to its initial state (adjust as needed for your form structure)
            this.travel = {
                title: '',
                description: '',
                date: '',
                notes: '',
                locations: [],
                foods: [],
                facts: [],
                images: []
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
        },
        addImage(file) {
            this.travel.images.push(file);
        },
        getImageUrl(file) {
            return URL.createObjectURL(file); // Generate a URL for the file
        },
        removeImage(index) {
            // Revoke the object URL before removing the image
            URL.revokeObjectURL(this.getImageUrl(this.travel.images[index]));
            this.travel.images.splice(index, 1); // Remove the image at the specified index
        },
    },
};
</script>

<template>
    <div class="container">
        <div class="row">

            <form id="travelForm" @submit.prevent="submitTravel" class="mb-3 mt-3" novalidate enctype="multipart/form-data">
                <h2 class="fw-bold">Create Travel Plan</h2>

                <div id="alertContainer"></div>
                <div class="main-info mb-2 border border-primary rounded p-4">
                    <!-- Travel Details -->
                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" v-model="travel.title" id="title" class="form-control" required />
                        <div class="invalid-feedback">Please provide a title.</div>
                    </div>
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea v-model="travel.description" id="description" class="form-control"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="date" class="form-label">Date</label>
                        <input type="date" v-model="travel.date" id="date" class="form-control" required />
                        <div class="invalid-feedback">Please provide a date.</div>
                    </div>
                    <div class="mb-3">
                        <label for="notes" class="form-label">Notes</label>
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
    
                        <div v-if="travel.images.length > 0">
                            <h3>Uploaded Images</h3>
                            <div class="d-flex">
                                <div v-for="(image, index) in travel.images" :key="index" class="image-preview">
                                    <img :src="getImageUrl(image)" alt="Image preview" class="img-thumbnail" />
                                    <button @click="removeImage(index)" id="remove_btn" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Locations -->
                <div v-if="travel.locations.length > 0" class="mb-2 border border-primary rounded p-4"> 
                    <div v-for="(location, index) in travel.locations" :key="index" class="mb-2">
                        <label :for="'location' + index" class="form-label">Location Name</label>
    
                        <div :id="'location' + index" class="input-container">
                            <AddressInput v-model="location.name" />
                        </div>
    
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-danger mt-2" @click="removeLocation(index)">Remove
                                Location</button>
                        </div>
    
                        <div class="invalid-feedback">Please provide a location.</div>
                    </div>
                </div>

                <!-- Foods -->
                <div v-if="travel.foods.length > 0" class="mb-2 border border-primary rounded p-4">
                    <div v-for="(food, index) in travel.foods" :key="index" class="mb-2">
                        <label :for="'food' + index" class="form-label">Food Title</label>
                        <input :id="'food' + index" v-model="food.title" class="form-control" required />
                        <div class="invalid-feedback">Please provide a food title.</div>
    
                        <label :for="'foodDescription' + index" class="form-label">Description</label>
                        <textarea v-model="food.description" class="form-control"></textarea>
    
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-danger mt-2" @click="removeFood(index)">Remove
                                Food</button>
                        </div>
                    </div>
                </div>

                <div v-if="travel.facts.length > 0" class="mb-2 border border-primary rounded p-4">
                    <!-- Facts -->
                    <div v-for="(fact, index) in travel.facts" :key="index" class="mb-2">
                        <label :for="'fact' + index" class="form-label">Fact Title</label>
                        <input :id="'fact' + index" v-model="fact.title" class="form-control" required />
                        <div class="invalid-feedback">Please provide a fact title.</div>
    
                        <label :for="'factDescription' + index" class="form-label mt-2">Description</label>
                        <textarea v-model="fact.description" class="form-control"></textarea>
    
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-danger mt-2" @click="removeFact(index)">Remove
                                Fact</button>
                        </div>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-3 mb-4 mt-4">
                    <button type="button" class="btn btn-primary" @click="addLocation">Add Locations</button>
                    <button type="button" class="btn btn-primary" @click="addFood">Add Foods</button>
                    <button type="button" class="btn btn-primary" @click="addFact">Add Fun Facts</button>
                </div>
                
                <div class="d-flex justify-content-end">
                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-secondary">Add Travel Plan</button>
                </div>
                <!-- Submit Button -->
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
.border-primary {
    // background-color: $purple;   
    border-color: $purple !important;
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