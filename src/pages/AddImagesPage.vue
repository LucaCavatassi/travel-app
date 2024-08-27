<script>
import axios from 'axios';

export default {
    data() {
        return {
            travel: {
                id: '',
                title: '',
                description: '',
                date: '',
                notes: '',
                locations: [],
                foods: [],
                facts: [],
                images: []
            },
        };
    },
    created() {
        this.fetchTravelDetail();
        // console.log(this.travel.images);

    },
    methods: {
        async fetchTravelDetail() {
            try {
                const slug = this.$route.params.slug;

                const response = await axios.get(`http://localhost:8888/api/travel_app_be/db_connect.php?slug=${slug}`);
                // console.log(response.data[0]);

                this.travel = response.data[0];
                console.log(this.travel);
                console.log('Travel ID:', this.travel.id);

            } catch (error) {
                console.error('There was an error fetching the travel details!', error);
            }
        },
        handleFileUpload(event) {
            if (!this.travel.images) {
                this.travel.images = [];  // Initialize images if undefined
            }
            this.travel.images.push(...Array.from(event.target.files));
            console.log(this.travel.images);
        },
        async submitTravel() {
            try {
                if (this.validateForm()) {
                    const formData = new FormData();

                    // Append travel details
                    formData.append('title', this.travel.title);
                    formData.append('description', this.travel.description);
                    formData.append('date', this.travel.date);
                    formData.append('id', this.travel.id);

                    console.log(formData);

                    // Append images if they exist
                    if (Array.isArray(this.travel.images) && this.travel.images.length > 0) {
                        this.travel.images.forEach((image, index) => {
                            formData.append('images[]', image);
                        });
                    }

                    // Make the API request
                    const response = await axios.post('http://127.0.0.1:8888/api/travel_app_be/add_image.php', formData, {
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

            <form id="travelForm" @submit.prevent="submitTravel" class="mb-3 mt-3" novalidate
                enctype="multipart/form-data">
                <h2 class="fw-bold">Create Travel Plan</h2>

                <div id="alertContainer"></div>
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
                                    <img :src="getImageUrl(image)" alt="Image preview" class="img-thumbnail" />
                                    <button @click="removeImage(index)" id="remove_btn" class="btn btn-danger"><i
                                            class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
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