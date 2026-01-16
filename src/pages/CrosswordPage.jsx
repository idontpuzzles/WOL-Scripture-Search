import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import CrosswordGrid from '../components/CrosswordGrid';
import CluesPanel from '../components/CluesPanel';
import { puzzles, getPuzzleById, getAllPuzzles } from '../data/puzzles';
import { getPuzzleProgress, savePuzzleProgress, clearPuzzleProgress } from '../utils/crosswordStorage';

export default function CrosswordPage() {
    const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
    const [userGrid, setUserGrid] = useState(null);
    const [selectedClue, setSelectedClue] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [showErrors, setShowErrors] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Use either the selected static puzzle or the generated custom one
    const puzzle = selectedPuzzleId ? getPuzzleById(selectedPuzzleId) : null;
    const puzzleList = getAllPuzzles();

    // Initialize user grid when puzzle is selected
    useEffect(() => {
        if (puzzle) {
            // Check for saved progress (only for static puzzles)
            const saved = getPuzzleProgress(puzzle.id);

            if (saved?.userGrid) {
                setUserGrid(saved.userGrid);
                setIsComplete(saved.completed || false);
            } else {
                // Create empty grid
                const emptyGrid = puzzle.grid.map(row =>
                    row.map(cell => (cell ? '' : null))
                );
                setUserGrid(emptyGrid);
                setIsComplete(false);
            }
            // Reset toggles when switching puzzles
            setShowErrors(false);
            setRevealed(false);
        }
    }, [puzzle]);

    // Handle cell change
    const handleCellChange = useCallback((row, col, value) => {
        if (!puzzle || !userGrid || revealed) return; // Don't allow changes when revealed

        const newGrid = userGrid.map((r, ri) =>
            r.map((c, ci) => (ri === row && ci === col ? value : c))
        );
        setUserGrid(newGrid);

        // Check if puzzle is complete
        let complete = true;
        for (let r = 0; r < puzzle.grid.length; r++) {
            for (let c = 0; c < puzzle.grid[r].length; c++) {
                const cell = puzzle.grid[r][c];
                if (cell && newGrid[r][c]?.toUpperCase() !== cell.letter) {
                    complete = false;
                    break;
                }
            }
            if (!complete) break;
        }
        setIsComplete(complete);

        // Save progress (skip for custom if ephemeral, or enable saving later)
        savePuzzleProgress(puzzle.id, newGrid, complete);
    }, [puzzle, userGrid, revealed]);

    // Reveal all answers (shows answers below clues only)
    const handleRevealClick = () => {
        if (!puzzle || revealed) return;
        setShowConfirmModal(true);
    };

    const confirmReveal = () => {
        setRevealed(true);
        setShowConfirmModal(false);
    };

    // Reset puzzle
    const handleReset = () => {
        if (!puzzle) return;
        const emptyGrid = puzzle.grid.map(row =>
            row.map(cell => (cell ? '' : null))
        );
        setUserGrid(emptyGrid);
        setIsComplete(false);
        setRevealed(false);
        setShowErrors(false);
        clearPuzzleProgress(puzzle.id);
    };

    // Go back to puzzle list
    const handleBackToList = () => {
        setSelectedPuzzleId(null);
        setUserGrid(null);
        setSelectedClue(null);
        setIsComplete(false);
        setShowErrors(false);
        setRevealed(false);
    };

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center space-y-4 max-w-2xl z-10 mb-8"
            >
                <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-sm tracking-tight">
                    Crossword Puzzles
                </h1>
                {!puzzle && (
                    <p className="text-lg text-primary-200/80">
                        Select a puzzle to get started
                    </p>
                )}
            </motion.header>

            <main className="w-full max-w-6xl flex flex-col gap-8 z-10">
                {!puzzle ? (
                    // Puzzle List
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {puzzleList.map((p) => {
                            const progress = getPuzzleProgress(p.id);
                            return (
                                <Card
                                    key={p.id}
                                    isPressable
                                    onPress={() => setSelectedPuzzleId(p.id)}
                                    className="w-full aspect-square bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/10 transition-all hover:scale-[1.02] hover:shadow-xl"
                                >
                                    <CardBody className="px-6 py-4 flex flex-col justify-center items-center text-center gap-4 h-full">
                                        <div className="flex-1 flex flex-col justify-center items-center gap-2">
                                            <h3 className="text-2xl font-bold text-white">{p.title}</h3>
                                            <p className="text-primary-300/80 text-sm">{p.description}</p>
                                        </div>

                                        <div className="h-8 flex items-center">
                                            {progress?.completed ? (
                                                <span className="text-green-400 font-medium text-xs bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                                                    ✓ Completed
                                                </span>
                                            ) : progress ? (
                                                <span className="text-yellow-400 font-medium text-xs bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                                                    In Progress
                                                </span>
                                            ) : (
                                                <span className="text-white/30 font-medium text-xs">
                                                    Start Puzzle
                                                </span>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </motion.div>
                ) : (
                    // Active Puzzle
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Puzzle Header */}
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="light"
                                onPress={handleBackToList}
                                className="text-primary-200 hover:text-white"
                            >
                                ← Back to Puzzles
                            </Button>
                            <h2 className="text-2xl font-bold text-white">{puzzle.title}</h2>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="bordered"
                                    onPress={handleReset}
                                    className="border-white/20 text-primary-200 hover:text-white"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <button
                                onClick={() => setShowErrors(!showErrors)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium
                                    transition-all duration-300 ease-out
                                    flex items-center gap-2
                                    ${showErrors
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-105'
                                        : 'bg-white/10 text-primary-200 hover:bg-white/20 border border-white/20'
                                    }
                                `}
                            >
                                <span className={`w-3 h-3 rounded-full transition-colors ${showErrors ? 'bg-white' : 'bg-red-400'}`}></span>
                                {showErrors ? 'Errors Visible' : 'Show Errors'}
                            </button>
                            <button
                                onClick={handleRevealClick}
                                disabled={revealed}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium
                                    transition-all duration-300 ease-out
                                    ${revealed
                                        ? 'bg-warning-500/50 text-warning-200 cursor-not-allowed opacity-60'
                                        : 'bg-gradient-to-r from-warning-500 to-warning-600 text-black shadow-lg shadow-warning-500/30 hover:from-warning-400 hover:to-warning-500'
                                    }
                                `}
                            >
                                {revealed ? 'Answers Revealed' : 'Reveal Answers'}
                            </button>
                        </div>

                        {/* Completion Message */}
                        {isComplete && !revealed && (
                            <Card className="bg-green-500/20 border border-green-400/30">
                                <CardBody className="py-3 text-center">
                                    <span className="text-green-300 font-bold text-lg">
                                        🎉 Congratulations! Puzzle Complete!
                                    </span>
                                </CardBody>
                            </Card>
                        )}

                        {/* Grid and Clues */}
                        <Card className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
                            <CardBody className="px-6 py-6 flex flex-col gap-8 items-center">
                                {/* Grid */}
                                <div className="flex-shrink-0 w-full flex justify-center">
                                    <CrosswordGrid
                                        puzzle={puzzle}
                                        userGrid={userGrid}
                                        onCellChange={handleCellChange}
                                        selectedClue={selectedClue}
                                        onSelectClue={setSelectedClue}
                                        showErrors={showErrors}
                                        revealed={revealed}
                                    />
                                </div>

                                {/* Clues */}
                                <div className="flex-grow w-full">
                                    <CluesPanel
                                        clues={puzzle.clues}
                                        selectedClue={selectedClue}
                                        onSelectClue={setSelectedClue}
                                        showAnswers={revealed}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                )}
            </main>

            {/* Confirm Reveal Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowConfirmModal(false)}
                    />
                    <div className="relative bg-zinc-900 border border-white/20 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white">Reveal Answers?</h3>
                        </div>
                        <div className="px-6 py-4">
                            <p className="text-primary-200">
                                Are you sure you want to reveal all answers?
                            </p>
                        </div>
                        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 rounded-lg text-primary-200 hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReveal}
                                className="px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
                            >
                                Yes, Reveal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
