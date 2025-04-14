
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AnimatePresence } from 'framer-motion';

// Force dark mode immediately before anything renders
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('light');
localStorage.setItem('theme', 'dark');

createRoot(document.getElementById("root")!).render(
  <AnimatePresence mode="wait">
    <App />
  </AnimatePresence>
);
