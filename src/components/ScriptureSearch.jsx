import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, TextField, MenuItem, Button, Box } from '@mui/material';
import { bibleData } from '../data/books';
import { motion } from 'framer-motion';

export default function ScriptureSearch() {
    const [selectedBookIndex, setSelectedBookIndex] = useState("");
    const [selectedChapter, setSelectedChapter] = useState("");
    const [selectedVerse, setSelectedVerse] = useState("");

    const book = useMemo(() => {
        return selectedBookIndex !== "" ? bibleData[parseInt(selectedBookIndex)] : null;
    }, [selectedBookIndex]);

    const chapters = useMemo(() => {
        if (!book) return [];
        if (book.chapters.length === 1) return [1];
        return book.chapters.map((_, i) => i + 1);
    }, [book]);

    const verses = useMemo(() => {
        if (!book) return [];
        const chapterNum = book.chapters.length === 1 ? 1 : parseInt(selectedChapter);
        if (!chapterNum) return [];
        return Array.from({ length: book.chapters[chapterNum - 1] }, (_, i) => i + 1);
    }, [book, selectedChapter]);

    const handleBookChange = (e) => {
        setSelectedBookIndex(e.target.value);
        setSelectedChapter("");
        setSelectedVerse("");
    };

    const handleSearch = () => {
        if (!book || !selectedVerse) return;

        const isSingleChapter = book.chapters.length === 1;
        const chapterNum = isSingleChapter ? 1 : parseInt(selectedChapter);
        const verseNum = parseInt(selectedVerse);
        const verseCount = book.chapters[chapterNum - 1];
        const distanceToStart = verseNum - 1;
        const distanceToEnd = verseCount - verseNum;
        let furthestVerseNum = distanceToStart > distanceToEnd ? 1 : verseCount;

        let selectedVerseString = "";
        let furthestVerseString = "";

        if (isSingleChapter) {
            selectedVerseString = `${book.name} ${verseNum}`;
            furthestVerseString = `${book.name} ${furthestVerseNum}`;
        } else {
            selectedVerseString = `${book.name} ${chapterNum}:${verseNum}`;
            furthestVerseString = `${book.name} ${chapterNum}:${furthestVerseNum}`;
        }

        const query = `(${selectedVerseString}) !(${furthestVerseString})`;
        const url = `https://wol.jw.org/en/wol/s/r1/lp-e?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    };

    const isSingleChapter = book?.chapters.length === 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
        >
            <Card sx={{
                minWidth: 300,
                maxWidth: 600,
                // Match "Pure Material" + "Glow/Border" aesthetic
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    borderColor: 'primary.main', // Orange border on hover
                    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.5)'
                }
            }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5 }}>
                            WOL Scripture Search
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'primary.main', opacity: 0.8 }}>
                            Search specific verses on WOL
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, alignItems: 'center', width: '100%' }}>
                        {/* Book */}
                        <TextField
                            select
                            label="Book"
                            value={selectedBookIndex}
                            onChange={handleBookChange}
                            variant="outlined"
                            sx={{ width: 160 }}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                },
                            }}
                        >
                            {bibleData.map((b, i) => (
                                <MenuItem key={i} value={i}>
                                    {b.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Chapter */}
                        {!isSingleChapter ? (
                            <TextField
                                select
                                label="Chapter"
                                value={selectedChapter}
                                onChange={(e) => {
                                    setSelectedChapter(e.target.value);
                                    setSelectedVerse("");
                                }}
                                disabled={!book}
                                variant="outlined"
                                sx={{ width: 100 }}
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            style: {
                                                maxHeight: 300,
                                                width: 100
                                            },
                                        },
                                    },
                                }}
                            >
                                {chapters.map((c) => (
                                    <MenuItem key={c} value={c}>
                                        {c}
                                    </MenuItem>
                                ))}
                            </TextField>
                        ) : (
                            <Box sx={{
                                width: 100,
                                height: 56,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px dashed rgba(255,255,255,0.3)',
                                borderRadius: 1,
                                bgcolor: 'rgba(255,255,255,0.05)',
                                color: 'rgba(255,255,255,0.5)'
                            }}>
                                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>Chapter</Typography>
                                <Typography variant="h6" sx={{ lineHeight: 1 }}>1</Typography>
                            </Box>
                        )}

                        {/* Verse */}
                        <TextField
                            select
                            label="Verse"
                            value={selectedVerse}
                            onChange={(e) => setSelectedVerse(e.target.value)}
                            disabled={!book || (!isSingleChapter && !selectedChapter)}
                            variant="outlined"
                            sx={{ width: 100 }}
                            SelectProps={{
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                            width: 100
                                        },
                                    },
                                },
                            }}
                        >
                            {verses.map((v) => (
                                <MenuItem key={v} value={v}>
                                    {v}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={!book || !selectedVerse}
                        onClick={handleSearch}
                        sx={{
                            px: 4,
                            py: 1.5,
                            mt: 1,
                            borderRadius: 99,
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 14px 0 rgba(55, 124, 251, 0.39)'
                        }}
                    >
                        Search on WOL
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}
