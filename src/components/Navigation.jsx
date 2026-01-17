import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine if we are on the Crossword page
    // Default to 'option1' (Search Tools) if not on crossword
    const isCrossword = location.pathname.includes('crossword');

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="filter-switch"
        >
            <input
                checked={!isCrossword}
                onChange={() => navigate('/')}
                id="option1"
                name="options"
                type="radio"
            />
            <label htmlFor="option1" className="option">
                Search Tools
            </label>

            <input
                checked={isCrossword}
                onChange={() => navigate('/crossword')}
                id="option2"
                name="options"
                type="radio"
            />
            <label htmlFor="option2" className="option">
                Crossword Puzzles
            </label>

            <span className="background"></span>
        </motion.div>
    );
}
