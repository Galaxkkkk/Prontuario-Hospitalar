import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: './dist',  // Agora gera na pasta dist/ na raiz
    emptyOutDir: true
  }
})