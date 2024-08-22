<template>
    <div>
      <input
        type="text"
        v-model="query"
        @input="handleInput"
        placeholder="Search for a place"
        class="form-control" required
      />
      <ul v-if="suggestions.length">
        <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
          {{ suggestion.place_name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      modelValue: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        query: this.modelValue, // Initialize with the value passed from parent
        suggestions: [],
      };
    },
    watch: {
      modelValue(newValue) {
        // Update the query whenever the modelValue changes (from the parent component)
        this.query = newValue;
      },
    },
    methods: {
      async handleInput(event) {
        const inputValue = event.target.value;
        
        // Emit the value to the parent component to update v-model
        this.$emit('update:modelValue', inputValue);
        
        // Fetch suggestions asynchronously based on the input value
        await this.fetchSuggestions(inputValue);
      },
      async fetchSuggestions(query) {
        if (query.length < 2) {
          // Avoid making requests for very short queries
          this.suggestions = [];
          return;
        }
  
        const accessToken = 'pk.eyJ1IjoibHVjYW1hcmlhY2F2YXRhc3NpIiwiYSI6ImNtMDNpZjlncDBid3oyaXFscGh5ODk5YWkifQ.w7Bhbf-lZDgIxyvCmGfT1A'; // Replace with your Mapbox access token
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
  
        try {
          const response = await axios.get(endpoint, {
            params: {
              access_token: accessToken,
            },
          });
  
          this.suggestions = response.data.features;
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      },
      selectSuggestion(suggestion) {
        // Set the input value to the selected suggestion
        const selectedValue = suggestion.place_name;
        this.query = selectedValue;
  
        // Emit the selected suggestion to the parent component to update v-model
        this.$emit('update:modelValue', selectedValue);
  
        // Optionally clear suggestions after selection
        this.suggestions = [];
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any styles you want here */
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    cursor: pointer;
    padding: 8px;
    border-bottom: 1px solid #ddd;
  }
  
  li:hover {
    background-color: #f0f0f0;
  }
  </style>