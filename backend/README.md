# 🚀 Full-Stack Portfolio — Backend API

A production-ready REST API for the personal portfolio website, built with Node.js, Express.js, and MongoDB.

## ✨ Features

- JWT Authentication with bcrypt password hashing
- CRUD for Projects, Certifications, Contact Messages
- Image uploads via Multer
- Email notifications via Nodemailer
- Visitor counter
- Rate limiting & security headers (helmet)
- Admin-protected routes

---

## 📁 Folder Structure

```
portfolio-backend/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── certificationController.js
│   ├── contactController.js
│   └── projectController.js
├── middleware/
│   ├── auth.js           # JWT protect + adminOnly
│   └── upload.js         # Multer image uploads
├── models/               # Mongoose schemas
│   ├── Certification.js
│   ├── Contact.js
│   ├── Project.js
│   ├── User.js
│   └── Visitor.js
├── routes/
│   ├── auth.js
│   ├── certifications.js
│   ├── contact.js
│   ├── projects.js
│   └── stats.js
├── utils/
│   └── seed.js           # Database seeder
├── uploads/              # (auto-created) uploaded images
├── .env.example
├── package.json
└── server.js
```

---

## 🛠️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Seed the database
```bash
node utils/seed.js
```

### 4. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login → JWT |
| GET | `/api/auth/me` | Protected | Current user |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | Public | All projects (supports ?search=&category=) |
| GET | `/api/projects/:id` | Public | Single project |
| POST | `/api/projects` | Admin | Create project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |

### Certifications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/certifications` | Public | All certifications |
| POST | `/api/certifications` | Admin | Add certification |
| PUT | `/api/certifications/:id` | Admin | Update |
| DELETE | `/api/certifications/:id` | Admin | Delete |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Send message |
| GET | `/api/contact` | Admin | View all messages |
| PATCH | `/api/contact/:id/read` | Admin | Mark as read |
| DELETE | `/api/contact/:id` | Admin | Delete message |

### Stats
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/stats/visit` | Public | Increment visitor count |
| GET | `/api/stats/visits` | Public | Get total count |

---

## 🌐 Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set **Build command**: `npm install`
5. Set **Start command**: `npm start`
6. Add all environment variables from `.env.example`
7. Done! Your API is live.

---

## 🖥️ Frontend Deployment (Vercel)

1. Set `VITE_API_URL=https://your-render-app.onrender.com` in Vercel environment variables
2. Push frontend to GitHub → import in Vercel → Deploy

---

## 📧 Gmail App Password Setup

1. Enable 2FA on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate a password for "Mail"
4. Use that 16-char password as `EMAIL_PASS` in `.env`
