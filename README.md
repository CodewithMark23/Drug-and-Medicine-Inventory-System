# Drug and Medicine Inventory System (Single Page Application)

A simple, plain React SPA with Laravel backend and SQLite database persistence.

---

## 1. Credentials

- **Username**: `pharmacist`
- **Password**: `med123`

---

## 2. React Router Client-Side Routes

All protected routes require logging in as `pharmacist`:

| Route | Component | Description |
|---|---|---|
| `/login` | `Login.jsx` | Login screen with validation |
| `/medicines` | `MedicineList.jsx` | Full medicine table with search filter |
| `/medicines/create` | `AddMedicine.jsx` | Dedicated screen to add a medicine |
| `/medicines/:id` | `MedicineDetails.jsx` | Detailed review screen for a medicine |
| `/medicines/:id/edit` | `EditMedicine.jsx` | Screen to edit an existing medicine |

You can navigate directly to the add screen using the URL:
```
http://localhost:8000/medicines/create
```

---

## 3. Running the Application

Open two terminals in the project root:

**Terminal 1 (Backend):**
```bash
php artisan serve
```

**Terminal 2 (Frontend React):**
```bash
npm run dev
```

Open browser: **http://localhost:8000**

---

## 4. Database Reset / Seed

```bash
php artisan migrate:fresh --seed
```
