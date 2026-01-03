# Verdant & Vine

A calm, nature-inspired plant nursery application featuring an interactive catalog, a virtual terrarium game, and vibrant animations.

## Features

- 🌿 **Interactive Plant Catalog**: Filter by category, sunlight, and difficulty.
- 🎮 **Virtual Terrarium**: "Water" plants to level them up and watch them grow in a gamified garden.
- 🎨 **Beautiful UI**: Built with Tailwind CSS and Framer Motion for organic, smooth animations.
- 📱 **Responsive Design**: Works on desktop and mobile.
- 📊 **Dynamic Data**: Fetches plant data from a public Google Sheet, falling back to local data if offline.

## Setup & Running

This project is completely client-side and requires **no API keys**. All dependencies are managed locally via npm.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`.

## Data Source

Plant data is sourced from a public Google Sheet CSV. You can modify the URL in `services/plantDataService.ts` to use your own sheet, or rely on the local fallback data in `constants.ts`.

## Technologies

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
