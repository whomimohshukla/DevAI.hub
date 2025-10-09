# DevAI Hub

A modern web application built with React, TypeScript, and Node.js, designed to provide a hub for developers to access AI tools and resources.

## 🚀 Features

- **Modern UI/UX**: Built with React 19 and Tailwind CSS for a responsive and beautiful interface
- **Type Safety**: Full TypeScript support for both frontend and backend
- **Modular Architecture**: Clean separation between frontend and backend
- **Developer Friendly**: Hot reloading, linting, and type checking out of the box

## 🛠 Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- Motion for animations

### Backend
- Node.js with TypeScript
- Express.js (inferred from project structure)
- TypeScript for type safety
- Nodemon for development hot-reloading

## 📦 Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd DevAI-Hub
```

### 2. Set up the Backend
```bash
cd Backend
npm install
npm run dev
```

The backend server will start on `http://localhost:3000`

### 3. Set up the Frontend
```bash
cd ../Frontend
npm install
npm run dev
```

The frontend development server will start on `http://localhost:5173`

## 🏗 Project Structure

```
DevAI-Hub/
├── Backend/
│   ├── src/           # Source files
│   ├── dist/          # Compiled TypeScript files
│   └── package.json   # Backend dependencies
│
└── Frontend/
    ├── public/        # Static files
    ├── src/           # Source files
    │   ├── components/  # React components
    │   └── ...
    └── package.json   # Frontend dependencies
```

## 🧪 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed the database (if applicable)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Your Name]
