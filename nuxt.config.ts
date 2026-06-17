export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/**': {
        proxy: 'http://localhost/api/**' 
      }
    }
  },

})