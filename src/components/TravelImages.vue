<template>
    <div>
        <h1>Travel Images</h1>
        <!-- Image upload form -->
        <div>
            <input type="file" @change="handleFileUpload" multiple />
            <button @click="uploadImages">Upload Images</button>
        </div>
        
        <!-- Display images -->
        <div v-if="images.length">
            <div v-for="image in images" :key="image" class="image-container">
                <img :src="`http://127.0.0.1:8888/api/travel_app_be/uploads/${image}`" alt="Travel Image" />
                <button @click="deleteImage(image)">Delete</button>
            </div>
        </div>
        <p v-else>No images available</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            images: [], // To hold image URLs
            travelId: null, // The travel ID for fetching images
            selectedFiles: [] // To hold selected files for upload
        };
    },
    async created() {
        // Replace with actual travel ID
        this.travelId = 76; // Example travel ID
        await this.fetchImages();
    },
    methods: {
        async fetchImages() {
            try {
                const response = await axios.get(`http://127.0.0.1:8888/api/travel_app_be/getImagesByTravelId.php`, {
                    params: { travel_id: this.travelId }
                });
                this.images = response.data;
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        },
    }
};
</script>

<style scoped>
img {
    max-width: 100%;
    height: auto;
}

.image-container {
    margin-bottom: 15px;
    position: relative;
}

button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>