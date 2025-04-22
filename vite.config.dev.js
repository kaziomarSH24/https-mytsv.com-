// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//     root: "react-app",
//     build: {
//         outDir: "../public",
//         emptyOutDir: false,
//     },
//     plugins: [react()],
//     host: false,
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    root: "react-app",
    build: {
        outDir: "../public",
        emptyOutDir: false,
    },
    plugins: [react()],
    server: {
        host: true,
        port: 5173
    }
});
