import { createRouter, createWebHistory } from "vue-router";

import SingleResultPage from "./pages/SingleResultPage.vue";
import LandingPage from "./pages/LandingPage.vue";


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: "/",
			name: "landing-page",
			component: LandingPage,
		},
		{
			path: "/single-result",
			name: "single-result",
			component: SingleResultPage,
			props: true,
		},
	],
});

export { router };
