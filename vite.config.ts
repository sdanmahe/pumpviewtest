import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite" // Add loadEnv

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('🚀 Vite Config - Mode:', mode)
  console.log('🚀 Available VITE_ vars:', 
    Object.keys(env).filter(key => key.startsWith('VITE_')))
  
  return {
    base: './',
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Optional: Define env vars explicitly
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE),
    },
  }
});