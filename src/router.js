import { createRouter, createWebHistory } from "vue-router";

import SingleResultPage from "./pages/SingleResultPage.vue";
import LandingPage from "./pages/LandingPage.vue";
import NewTravelPage from "./pages/NewTravelPage.vue";
import TravelFormUpdate from "./pages/TravelFormUpdate.vue";



const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "landing-page",
			component: LandingPage,
			props: true,
		},
		{
			path: "/travel/:slug",
			name: "single-result",
			component: SingleResultPage,
			props: true,
		},
		{
			path: "/add-new-travel",
			name: "add-new-travel",
			component: NewTravelPage,
			props: true,
		},
		{
			path: "/edit-travel/:slug",
			name: "edit-form",
			component: TravelFormUpdate,
			props: true,
		},
	],
});

export { router };
