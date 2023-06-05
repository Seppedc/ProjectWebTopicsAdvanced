import { defineConfig } from 'npm:vite@^4.0.4'
import vue from '@vitejs/plugin-vue';


import 'npm:vue@^3.2.45'
import "npm:vue-router@4";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
