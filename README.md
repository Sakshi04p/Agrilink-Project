# 🌾 AgriLink v2.0

**Connecting Farmers and Agricultural Workers in Rural Areas**

---

## 📁 Project Structure

```
agrilink/
├── server.js
├── package.json
├── models/
│   ├── Worker.js       ← name, phone, skill, location, available (boolean)
│   └── Job.js          ← workType, location, phone
├── routes/
│   ├── workers.js      ← GET (with filters), POST
│   └── jobs.js         ← GET (with filters), POST
├── public/
│   ├── css/style.css
│   └── js/
│       ├── utils.js    ← showToast, formatDate, buildQuery
│       ├── worker.js   ← registration form + jobs board
│       └── farmer.js   ← search workers + post job
└── views/
    ├── index.html      ← Home / role selection
    ├── worker.html     ← Register tab + Jobs Board tab
    └── farmer.html     ← Find Workers tab + Post Job tab
```

---

## 🚀 Setup

```bash
cd agrilink
npm install
# Make sure MongoDB is running
npm start          # production
npm run dev        # with nodemon (auto-restart)
```

Open: http://localhost:3000

---

## 🔌 API Reference

### Workers
| Method | Endpoint         | Query Params                          |
|--------|-----------------|---------------------------------------|
| GET    | /api/workers    | ?location= &skill= &available=true/false |
| POST   | /api/workers    | body: { name, phone, skill, location, available } |

### Jobs
| Method | Endpoint      | Query Params              |
|--------|--------------|---------------------------|
| GET    | /api/jobs    | ?location= &workType=     |
| POST   | /api/jobs    | body: { workType, location, phone } |

---

## ✨ Features (v2)

- Worker registers with **availability status** (Available / Unavailable)
- **Farmer page** — search workers by location + skill + availability chips
- **Worker page** — "Jobs Board" tab shows all farmer-posted jobs
- Workers can filter jobs by location and work type
- Real-time result count shown after every search
- Mobile-first, no login required

---

🌱 *Built for rural agricultural communities — simple, fast, free.*
