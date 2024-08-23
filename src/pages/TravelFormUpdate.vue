<template>
    <div class="container mt-5 ms_container">
        <h2>Create Travel Plan</h2>

        <div id="alertContainer"></div>

        <form id="travelForm" @submit.prevent="submitTravel" novalidate>
            <!-- Travel Details -->
            <div class="mb-3">
                <label for="title" class="form-label">Title:</label>
                <input type="text" v-model="travel.title" id="title" class="form-control" required />
                <div class="invalid-feedback">Please provide a title.</div>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description:</label>
                <textarea v-model="travel.description" id="description" class="form-control"></textarea>
            </div>
            <div class="mb-3">
                <label for="date" class="form-label">Date:</label>
                <input type="date" v-model="travel.date" id="date" class="form-control" required />
                <div class="invalid-feedback">Please provide a date.</div>
            </div>
            <div class="mb-3">
                <label for="notes" class="form-label">Notes:</label>
                <textarea v-model="travel.notes" id="notes" class="form-control"></textarea>
            </div>

            <!-- Locations -->
            <div v-for="(location, index) in travel.locations" :key="index" class="mb-3">
                <label :for="'location' + index" class="form-label">Location Name:</label>

                <div :id="'location' + index" class="input-container">
                    <AddressInput v-model="location.name" />
                    <!-- <input v-model="location.name" class="form-control" required /> -->
                </div>
                <div class="invalid-feedback">Please provide a location.</div>

                <label :for="'locationRating' + index" class="form-label">Rating:</label>
                <input type="number" v-model="location.rating" min="1" max="5" class="form-control" />

                <label :for="'locationDone' + index" class="form-label">Is Done:</label>
                <input type="checkbox" v-model="location.is_done" class="form-check-input" />

                <button type="button" class="btn btn-danger mt-2" @click="removeLocation(index)">Remove
                    Location</button>
            </div>
            <button type="button" class="btn btn-primary mb-3" @click="addLocation">Add Location</button>

            <!-- Foods -->
            <div v-for="(food, index) in travel.foods" :key="index" class="mb-3">
                <label :for="'food' + index" class="form-label">Food Title:</label>
                <input :id="'food' + index" v-model="food.title" class="form-control" required />
                <div class="invalid-feedback">Please provide a food title.</div>

                <label :for="'foodDescription' + index" class="form-label">Description:</label>
                <textarea v-model="food.description" class="form-control"></textarea>

                <label :for="'foodRating' + index" class="form-label">Rating:</label>
                <input type="number" v-model="food.rating" min="1" max="5" class="form-control" />

                <label :for="'foodDone' + index" class="form-label">Is Done:</label>
                <input type="checkbox" v-model="food.is_done" class="form-check-input" />

                <button type="button" class="btn btn-danger mt-2" @click="removeFood(index)">Remove Food</button>
            </div>
            <button type="button" class="btn btn-primary mb-3" @click="addFood">Add Food</button>

            <!-- Facts -->
            <div v-for="(fact, index) in travel.facts" :key="index" class="mb-3">
                <label :for="'fact' + index" class="form-label">Fact Title:</label>
                <input :id="'fact' + index" v-model="fact.title" class="form-control" required />
                <div class="invalid-feedback">Please provide a fact title.</div>

                <label :for="'factDescription' + index" class="form-label">Description:</label>
                <textarea v-model="fact.description" class="form-control"></textarea>

                <label :for="'factDone' + index" class="form-label">Is Done:</label>
                <input type="checkbox" v-model="fact.is_done" class="form-check-input" />

                <button type="button" class="btn btn-danger mt-2" @click="removeFact(index)">Remove Fact</button>
            </div>
            <button type="button" class="btn btn-primary mb-3" @click="addFact">Add Fact</button>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-success">Submit Travel Plan</button>
        </form>
    </div>
</template>

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
                facts: []
            },
            mapboxToken: 'pk.eyJ1IjoibHVjYW1hcmlhY2F2YXRhc3NpIiwiYSI6ImNtMDNpZjlncDBid3oyaXFscGh5ODk5YWkifQ.w7Bhbf-lZDgIxyvCmGfT1A', // Replace with your Mapbox token
        };
    },
    components: {
        AddressInput
    },
    created() {
        this.fetchTravelDetail(); 
    },
    methods: {
        async fetchTravelDetail() {
            try {
                const slug = this.$route.params.slug;
                
                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?slug=${slug}`);
                console.log(response.data[0]);
                
                this.travel = response.data[0];
                // console.log(this.travel.id);
                
                
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
    if (!this.validateForm()) return; // Ensure form is valid before proceeding

    try {
        // Ensure payload has proper data
        const payload = {
            id: this.travel.id, // Include ID if required
            title: this.travel.title,
            description: this.travel.description,
            date: this.travel.date,
            notes: this.travel.notes,
            locations: this.travel.locations,
            foods: this.travel.foods,
            facts: this.travel.facts,
        };

        // Log the data to be sent for debugging
        console.log('Sending data:', payload);

        // Send a PUT request to update the travel record
        const response = await axios.put(
            'http://localhost:8888/api/travel_app_be/db_connect.php', 
            payload,  // Send as JSON object
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Log server response
        console.log('Response:', response.data);

        // Display success alert
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                Travel plan updated successfully!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        // Optionally navigate back or to another page
        // this.$router.push({ name: 'single-result', params: { slug: this.travel.slug } });

    } catch (error) {
        // Display error alert
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                An error occurred while updating the travel plan.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        // Log the error
        console.error('API Error:', error.response ? error.response.data : error);
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


<style scoped lang="scss">
@use "../style/general" as *;

.ms_container {
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
</style>