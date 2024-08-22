<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox GL JS CSS


export default {
    name: 'MapboxMapComponent',
    props: {
        locations: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const mapContainer = ref(null);

        onMounted(() => {
            mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYW1hcmlhY2F2YXRhc3NpIiwiYSI6ImNtMDNpZjlncDBid3oyaXFscGh5ODk5YWkifQ.w7Bhbf-lZDgIxyvCmGfT1A'; // Replace with your Mapbox token
            const map = new mapboxgl.Map({
                container: mapContainer.value,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [12.4964, 41.9028], // Default center (Rome)
                zoom: 3.3,
            });
            
            map.on('load', () => {
            props.locations.forEach((location) => {

                new mapboxgl.Marker()
                    .setLngLat([location.long, location.lat])
                    .addTo(map);
            });
        });
        });

        return {
            mapContainer,
        };
    },
};
</script>

<style scoped lang="scss">
@use "../style/general" as *;    
.map-container {
    width: 100%;
    height: calc(100vh - $header-height - $footer-height);
}
</style>