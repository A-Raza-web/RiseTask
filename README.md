# 📝 RiseTask — Task Manager App

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%26%20Desktop-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> **RiseTask** is a fully responsive Task Manager application built with the MERN Stack. Create, manage, and track your daily tasks with ease — on mobile or laptop.

---

## 🚀 Live Demo

<!-- Add your deployed link here -->
🔗 [Live App](https://your-live-link.com)

---

## ✨ Features

- ✅ Create, update, and delete tasks
- 📱 Fully Responsive — works perfectly on both mobile and laptop
- 🔐 User Authentication (Login / Register)
- 📋 Task categories and priority levels
- 🌙 Clean and modern UI
- ⚡ Fast performance with React frontend
- 🗄️ Persistent data storage with MongoDB

---

## 🛠️ Tech Stack

| Layer      | Technology         |
|------------|-------------------|
| Frontend   | React.js           |
| Backend    | Node.js + Express  |
| Database   | MongoDB + Mongoose |
| Styling    | CSS / Tailwind CSS |
| Auth       | JWT Tokens         |

---

## 📁 Project Structure

```
risetask/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # App pages
│       ├── context/        # State management
│       └── App.js
│
├── server/                 # Node.js + Express Backend
│   ├── config/             # DB connection
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/risetask.git
cd risetask
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 🌐 Running the App

| Service   | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:3000    |
| Backend   | http://localhost:5000    |

---

## 📱 Responsive Design

RiseTask is built with a mobile-first approach:

- 📱 **Mobile** — Smooth touch-friendly UI
- 💻 **Laptop/Desktop** — Full-width layout with sidebar
- 🖥️ **Tablet** — Adaptive grid layout

---

## 📸 Screenshots

<!-- Add your screenshots here -->
| Mobile View | Desktop View |
|-------------|--------------|
| ![mobile](./screenshots/mobile.png) | ![desktop](./screenshots/desktop.png) |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project or fix a bug:

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Your Name**

- GitHub: [@your-username](https://github.com/your-username)
- Email: your.email@example.com

---

> ⭐ If you found this project helpful, please give it a star!
