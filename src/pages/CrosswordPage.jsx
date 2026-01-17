import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Button, Typography, Box, Modal, IconButton } from '@mui/material';
import CrosswordGrid from '../components/CrosswordGrid';
import CluesPanel from '../components/CluesPanel';
import { getPuzzleById, getAllPuzzles } from '../data/puzzles';
import { getPuzzleProgress, savePuzzleProgress, clearPuzzleProgress } from '../utils/crosswordStorage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
                style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '42rem', zIndex: 10 }}
            >
                <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: '-0.02em', fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
                    Crossword Puzzles
                </Typography>
                {!puzzle && (
                    <Typography variant="h6" sx={{ color: 'primary.light', opacity: 0.8, mt: 2 }}>
                        Select a puzzle to get started
                    </Typography>
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
                                    sx={{
                                        aspectRatio: '1/1',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 6
                                        }
                                    }}
                                    onClick={() => setSelectedPuzzleId(p.id)}
                                >
                                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 2, p: 3 }}>
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'white' }}>
                                                {p.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'primary.light', opacity: 0.8 }}>
                                                {p.description}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ height: 32, display: 'flex', alignItems: 'center' }}>
                                            {progress?.completed ? (
                                                <Box sx={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 500, bgcolor: 'rgba(74, 222, 128, 0.1)', px: 1.5, py: 0.5, borderRadius: 99, border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                                                    ✓ Completed
                                                </Box>
                                            ) : progress ? (
                                                <Box sx={{ color: '#facc15', fontSize: '0.75rem', fontWeight: 500, bgcolor: 'rgba(250, 204, 21, 0.1)', px: 1.5, py: 0.5, borderRadius: 99, border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                                                    In Progress
                                                </Box>
                                            ) : (
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                                                    Start Puzzle
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBackToList}
                                sx={{ color: 'primary.light', '&:hover': { color: 'white' } }}
                            >
                                Back to Puzzles
                            </Button>
                            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'white' }}>
                                {puzzle.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleReset}
                                    sx={{
                                        color: 'primary.light',
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        '&:hover': { color: 'white', borderColor: 'white' }
                                    }}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </Box>

                        {/* Controls Row */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setShowErrors(!showErrors)}
                                variant={showErrors ? "contained" : "outlined"}
                                color="error"
                                sx={{
                                    borderRadius: 99,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    bgcolor: showErrors ? 'error.main' : 'rgba(255,255,255,0.05)',
                                    borderColor: showErrors ? 'error.main' : 'rgba(255,255,255,0.2)',
                                    color: showErrors ? 'white' : 'error.light',
                                    '&:hover': {
                                        bgcolor: showErrors ? 'error.dark' : 'rgba(255,255,255,0.1)',
                                    }
                                }}
                            >
                                {showErrors ? 'Errors Visible' : 'Show Errors'}
                            </Button>
                            <Button
                                onClick={handleRevealClick}
                                disabled={revealed}
                                variant="contained"
                                color="warning"
                                sx={{
                                    borderRadius: 99,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    boxShadow: revealed ? 'none' : '0 4px 14px 0 rgba(255, 193, 7, 0.3)',
                                    opacity: revealed ? 0.6 : 1
                                }}
                            >
                                {revealed ? 'Answers Revealed' : 'Reveal Answers'}
                            </Button>
                        </Box>

                        {/* Completion Message */}
                        {isComplete && !revealed && (
                            <Card sx={{ bgcolor: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80' }}>
                                <CardContent sx={{ py: 2, textAlign: 'center', '&:last-child': { pb: 2 } }}>
                                    <Typography variant="h6" sx={{ color: '#4ade80', fontWeight: 'bold' }}>
                                        🎉 Congratulations! Puzzle Complete!
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Grid and Clues */}
                        <Card sx={{
                            width: '100%',
                        }}>
                            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                                {/* Grid */}
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <CrosswordGrid
                                        puzzle={puzzle}
                                        userGrid={userGrid}
                                        onCellChange={handleCellChange}
                                        selectedClue={selectedClue}
                                        onSelectClue={setSelectedClue}
                                        showErrors={showErrors}
                                        revealed={revealed}
                                    />
                                </Box>

                                {/* Clues */}
                                <Box sx={{ width: '100%', flexGrow: 1 }}>
                                    <CluesPanel
                                        clues={puzzle.clues}
                                        selectedClue={selectedClue}
                                        onSelectClue={setSelectedClue}
                                        showAnswers={revealed}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </main>

            {/* Confirm Reveal Modal */}
            <Modal
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                aria-labelledby="reveal-modal-title"
                aria-describedby="reveal-modal-description"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{
                    position: 'relative',
                    bgcolor: '#18181b',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    boxShadow: 24,
                    width: '100%',
                    maxWidth: 400,
                    mx: 2,
                    overflow: 'hidden',
                    outline: 'none'
                }}>
                    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography id="reveal-modal-title" variant="h6" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                            Reveal Answers?
                        </Typography>
                    </Box>
                    <Box sx={{ px: 3, py: 3 }}>
                        <Typography id="reveal-modal-description" sx={{ color: 'primary.light' }}>
                            Are you sure you want to reveal all answers?
                        </Typography>
                    </Box>
                    <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            onClick={() => setShowConfirmModal(false)}
                            sx={{ color: 'primary.light', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmReveal}
                            variant="contained"
                            color="warning"
                            sx={{ color: 'black', fontWeight: 'bold' }}
                        >
                            Yes, Reveal
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
