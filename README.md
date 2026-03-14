<div align="center">

# ChatFlow

**Real-time communication, reimagined.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white)](https://socket.io/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)

A high-performance chat application frontend featuring a modern UI, optimistic UI updates for zero-latency feel, and smart caching for instant history loading.

</div>

---

## 🌟 Features

- **⚡ Real-Time Messaging**
  - Instant message delivery via persistent WebSocket connection.
  - **Typing Indicators:** See when the other person is typing.
  - **Voice Indicators:** Visual feedback for voice-based interactions.
  - **Message Status:** Track Sent, Delivered, and Seen states.

- **🚀 Optimized User Experience**
  - **Optimistic UI Updates:** Messages appear instantly in the UI before server confirmation, eliminating network lag feel.
  - **Smart Caching:** Chat history is cached locally; return visits load messages instantly without loading spinners.
  - **Media Support:** Share images and files seamlessly within conversations.

- **🎨 Modern Interface**
  - Built with **Tailwind CSS** for a fully responsive, mobile-first design.
  - **GSAP Animations:** Smooth, scroll-triggered entrance animations for components.
  - **Dynamic Icons:** Beautiful iconography powered by Lucide React.

- **🔐 Secure & Private**
  - Private 1-to-1 Chat functionality.
  - Secure authentication flow.

---

## 🛠️ Tech Stack

- **React 18** with Hooks (`useRef`, `useEffect`, `useContext`)
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for utility-first styling
- **Socket.io Client** for real-time bidirectional events
- **GSAP (ScrollTrigger)** for high-performance animations
- **Axios** for API requests
- **Lucide React** for icons

---

## ⚙️ Installation

**Prerequisites:**

- Node.js installed.
- Backend server running (Socket.io server must be active).

1.  **Clone the repository**

    ```bash
    git clone https://github.com/ankitbareth-dev/Chat-App-Frontend.git
    cd Chat-App-Frontend
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**

    Create a `.env` file in the root directory:

    ```env
    VITE_API_URL=http://localhost:5000
    VITE_SOCKET_URL=http://localhost:5000
    ```

4.  **Start the Development Server**

    ```bash
    npm run dev
    ```

    The application will open at `http://localhost:5173` (or your configured port).

---

## 📖 Usage Guide

1.  **Authentication**
    - Sign up for a new account or Log in.
2.  **Select a User**
    - View the list of active users or search for a specific person.
    - Click to open the chat window.
3.  **Send Messages**
    - Type your message and hit send. Notice the **Optimistic UI**—it appears immediately.
    - Observe the **Status Indicators** (clock icon → single tick → double tick).
4.  **Share Media**
    - Use the attachment button to share images or files.
5.  **View History**
    - Scroll up to load older messages. Revisit the chat later to see **Instant Loading** via caching.

---

## 🗺️ Roadmap

- [ ] Group Chat Functionality
- [ ] End-to-End Encryption
- [ ] Dark Mode Toggle
- [ ] Push Notifications

---

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/ankitbareth-dev">Ankit Bareth</a></sub>
</div>
