// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@nuxt/ui"],
    runtimeConfig: {
        MONGODB_URI: process.env.MONGODB_URI,
        BASE_URL: process.env.BASE_URL,
    },
});
