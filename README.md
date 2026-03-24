# 💬 Real-Time Chat Application

A secure, Full-Stack real-time communication application. Built with React, Node.js, PostgreSQL, and Socket.io. The project features an **Enterprise-grade authentication architecture** (Silent Refresh, in-memory Access Tokens, and HttpOnly Refresh Cookies), completely eliminating the use of `localStorage` for storing sensitive data.

## ✨ Key Features

* **Real-Time Communication:** Instant sending and receiving of messages using WebSockets (Socket.io).
* **Advanced Authentication:**
  * Short-lived Access Tokens (2 minutes) stored in RAM.
  * Long-lived Refresh Tokens (1 hour) stored in `HttpOnly` cookies.
  * *Silent Refresh* mechanism utilizing Axios Interceptors.
* **Chat Management:** Creating new conversations via a modal, hiding chats with automatic restoration upon receiving a new message.
* **Live Notifications:** Automatic refreshing of the incoming chats list via Socket.io "private rooms".
* **Full Validation:** Strong client-side and server-side input validation using the **Zod** library.
* **ORM:** Secure database and relationship management using **TypeORM** (SQL Injection protection, transaction management).

## 🛠️ Technologies Used

### Frontend (Client)
* **React 18** + **TypeScript**
* **Vite** (fast building and HMR)
* **React Router v6** (SPA routing)
* **Axios** (HTTP client with interceptors)
* **Socket.io-client** (WebSockets client)
* **React Hook Form** + **Zod** (form handling and validation)
* **Context API** (global user state management)
* Custom CSS (Modals, Toasts, Glassmorphism/Blur effects)

### Backend (Server)
* **Node.js** + **Express.js** + **TypeScript**
* **Socket.io** (WebSockets server)
* **TypeORM** (Object-Relational Mapping)
* **PostgreSQL** (relational database)
* **JSON Web Tokens (JWT)** + **Bcrypt** (password hashing and authorization)
* **Zod** (middleware for Request Body validation)
