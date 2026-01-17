import ScriptSearch from '../components/ScriptureSearch';
import ImageSearch from '../components/ImageSearch';
import { motion } from 'framer-motion';

export default function HomePage() {
    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center space-y-4 max-w-2xl z-10 mb-8"
            >
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-sm tracking-tight">
                    Search Tools
                </h1>
            </motion.header>

            <main className="w-full max-w-xl flex flex-col gap-8 z-10">
                <section className="w-full">
                    <ScriptSearch />
                </section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="w-full"
                >
                    <ImageSearch />
                </motion.section>
            </main>
        </>
    );
}
