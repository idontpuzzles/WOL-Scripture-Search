import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CrosswordPage from './pages/CrosswordPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen w-full flex flex-col items-center justify-start py-12 px-4 gap-4 relative overflow-hidden">

        <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-8">
          <Navigation />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/crossword" element={<CrosswordPage />} />
          </Routes>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-auto pt-12 text-center text-xs text-primary-300/40 z-10"
        >
          <p>© {new Date().getFullYear()} WOL Scripture Search</p>
        </motion.footer>
      </div>
    </BrowserRouter>
  )
}

export default App
