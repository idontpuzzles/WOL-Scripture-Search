import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navigation() {
    const linkClasses = ({ isActive }) =>
        `px-4 py-2 rounded-full transition-all duration-300 font-medium ${isActive
            ? 'bg-white/20 text-white shadow-lg'
            : 'text-primary-200/70 hover:text-white hover:bg-white/10'
        }`;

    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 mb-8 p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
        >
            <NavLink to="/" className={linkClasses}>
                Scripture Search
            </NavLink>
            <NavLink to="/crossword" className={linkClasses}>
                Crossword Puzzles
            </NavLink>
        </motion.nav>
    );
}
