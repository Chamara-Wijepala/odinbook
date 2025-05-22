# Odinbook

Odinbook is a fullstack social media web app that replicates key features of platforms like X and Reddit. Users can register, create posts, comment, reply, like content at multiple levels, follow/unfollow others, and upload profile pictures.\
It demonstrates my ability to design and implement a complete CRUD-based application with authentication, interactivity, and a responsive UI.

**Built with React, Node.js, and PostgreSQL.**

[Live Demo](https://odinbook-client-tm1f.onrender.com)

## 🧠 Detailed Description

Odinbook is the final project from [The Odin Project](https://www.theodinproject.com/). It's a project where you put everything that you've learned over the course into use to build a full-stack application.

### 🔍 Features

- 📝 **Create and manage content** – Users can create posts, comment on posts, and reply to comments, with full support for editing and deleting their own content.

- 💬 **Infinitely nested replies** – Comment threads support infinite nesting, enabling structured, Reddit-style conversations.

- ❤️ **Like system** – Posts, comments, and replies can all be liked independently, supporting engagement at every level.

- 👥 **Follow/unfollow users** – Build your own network by following other users and viewing posts from those you follow.

- 🖼️ **Profile customization** – Users can upload, crop, and update their profile pictures for a more personalized profile.

- 📊 **Sorting options** – Posts and comments can be sorted by recency or popularity for a more tailored experience.

- 🔐 **Authentication** – Secure registration and login using token-based authentication with JSON Web Tokens (JWT). The system automatically refreshes expired access tokens using a valid refresh token, allowing users to stay logged in seamlessly until their refresh token expires.

- 📱 **Responsive design** – Fully functional on both desktop and mobile screens.

### 🧠 Challenges & Lessons Learned

Building Odinbook was a deep dive into full-stack development with several firsts and complex architectural decisions:

- 🧩 **Monorepo setup with pnpm workspaces** – This was my first time using a monorepo, and I quickly saw the benefits of shared packages between client and server, like shared TypeScript types and utility functions. However, deployment was more challenging than a traditional multi-repo setup and required learning how to manage builds across workspaces.

- 🔄 **Token refresh system with Axios interceptors** – I implemented a fully automated JWT auth flow using Axios interceptors to handle expired access tokens. The app checks token validity in the background and requests a new one using the refresh token without user interaction. I also used the same interceptors to gracefully handle expected errors across the app.

- 🧪 **Testing backend with Vitest** – I learned how to write integration tests for existing backend routes, including setting up test environments and mocking authenticated requests.

- 🧠 **Backend architecture** – Midway through the project, I refactored the backend to follow the controller–service–repository pattern, which made it easier to test and maintain. This also helped separate concerns more cleanly across layers.

- 🔐 **JWT security with RSA keys** – Rather than using symmetric secrets, I implemented asymmetric RSA key pairs to sign and verify JWTs, improving overall security.

- 🛡️ **Express middleware** – I built custom middleware for centralized error handling and verifying JWTs across protected routes, improving both developer experience and app stability.

- 💬 **Infinitely nested comments** – Designing both the UI and backend logic to support Reddit-style comment threads with infinite nesting was a rewarding challenge. It taught me how to recursively render React components.

- 🖼️ **Image cropping** – I implemented an image cropping tool for profile picture uploads.

## 📦 Tech Stack & Packages

**Frontend**

- Vite

- React, React Router

- Zustand

- TailwindCSS

- Axios

- Luxon - Date/time utilities

- react-toastify - Toast notifications

- react-easy-crop - Image cropping library

- react-icons, react-spinners - UI enchancements

**Backend**

- Node.js + Express

- Prisma + PostgreSQL

- Vitest - Testing framework

- jsonwebtoken

- bcryptjs

- multer + cloudinary - File upload and cloud image storage

- cookie, cookie-parser - Cookie management

- cors

**Monorepo & Tooling**

- pnpm with Workspaces

- TypeScript - Shared across client and server

- Zod - Shared schema validation

## 🛠️ Installation & Setup

```bash
git clone https://github.com/Chamara-Wijepala/odinbook.git

cd odinbook

pnpm install

# create env files from examples (make sure to fill in relevant variables)
cp app/client/.env.example app/client/.env
cp app/server/.env.example app/server/.env

# create rsa key pair & run prisma migrate dev
pnpm setup:server

# start dev server
pnpm start
```

## 🧪 Testing

```bash
pnpm test:server

pnpm test:server:coverage
```
