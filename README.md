PROJECT NAME - Motion-Predict

Overview
--------
This project is built using:
- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

Prerequisites
-------------
- Node.js (recommend using nvm to manage versions)
- npm (installed with Node.js)

Installation
------------
1. Clone the repository:
   git clone <YOUR_GIT_URL>

2. Change into the project directory:
   cd <YOUR_PROJECT_NAME>

3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

Available Scripts
-----------------
- npm run dev     — start development server
- npm run build   — build for production (outputs to `dist/`)
- npm run preview — serve the production build locally

Deployment
----------
1. Build the project:
   npm run build

2. Deploy the contents of the `dist/` folder using any static-hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - Your own server

Folder Structure
----------------
<YOUR_PROJECT_NAME>/
├── public/             Static files
├── src/                Source code
│   ├── components/     Reusable UI components
│   ├── pages/          Route-based pages
│   └── main.tsx        Application entry point
├── index.html          Main HTML template
├── package.json        Dependencies and scripts
├── tailwind.config.ts  Tailwind CSS configuration
└── vite.config.ts      Vite configuration

License
-------
Released under the MIT License.
