import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'packages/react-frontend', // Set the root directory for Vite to the react-frontend folder
  plugins: [react()],
  build: {
    outDir: '../../dist' // Output the build to the root folder
  }
})
