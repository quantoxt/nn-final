export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {}
  },

  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" },
  },
  
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
      allowedHosts: ['.loca.lt']
    }
  },

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/',
      callback: '/',
      include: [],
      exclude: []
    },
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/supabase',
  ],
  
  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/global.css",
    "~/assets/css/cards.css",
    "~/assets/css/default.css",
  ],
  
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
})

