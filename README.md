# Mobile Store

A responsive, multilingual e-commerce frontend for mobile phones and accessories, built with React and TypeScript.

**Live Demo:** https://yosefkarimi.ir/works/mobile/

## Features

- Product catalog with search, filtering, sorting, and categories
- Product detail pages
- Shopping cart and quantity management
- Checkout and order confirmation demo
- Login and registration interfaces
- Customer account pages
- Wishlist and product comparison
- Promotional offers and featured products
- Demo administration dashboard
- Persian, English, Arabic, Spanish, and Brazilian Portuguese
- RTL and LTR layout support
- Dark and light themes
- Responsive design
- Progressive Web App (PWA) support

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Zustand
- i18next
- Formik and Yup
- vite-plugin-pwa
- Workbox

## Getting Started

### Requirements

- Node.js
- npm

### Installation

```bash
git clone https://github.com/yosef-karimi/mobile-store.git
cd mobile-store
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
├── components/
├── data/
├── i18n/
│   └── locales/
├── lib/
├── pages/
│   └── account/
├── stores/
├── App.tsx
└── main.tsx

public/
└── products/
```

## Demo Limitations

This repository is a frontend demonstration project.

Product information and application data use local/mock data. Authentication, checkout, order management, and the administration dashboard are frontend demonstration flows.

There is currently no production backend, server-side authentication, payment gateway, or real order-processing service.

A backend and API integration are required before using this project as a production e-commerce platform.

## License and Attribution

This project is based on an MIT-licensed e-commerce template.

The original copyright and license notice are retained in the [LICENSE](./LICENSE) file. Please preserve the original attribution when redistributing the original template or substantial portions of it.
