import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CrosswordPage from './pages/CrosswordPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full flex flex-col items-center justify-start py-12 px-4 text-foreground gap-4 relative overflow-hidden">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <Navigation />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/crossword" element={<CrosswordPage />} />
        </Routes>

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
