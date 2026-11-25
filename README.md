# Amigo's Coffee House: React frontend (storefront + admin)
npm install && npm run dev
- Home:  /        - Menu: /menu        - About: /about
- Admin: /admin   (demo login: admin@amigos.lk / amigos123)
Default content (menu, hero, story, about text, images) lives in src/data.js.
Admin changes are saved in the browser (localStorage) via src/store.js.
When a backend exists, replace the `actions` in src/store.js with API calls and replace the demo login in src/admin/Login.jsx.
