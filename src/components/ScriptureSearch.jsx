import React, { useState, useMemo } from 'react';
import { Select, SelectItem, Button, Card, CardBody, CardHeader } from "@heroui/react";
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

    // Glassmorphism Styles for Book (Full Width)
    const bookSelectClassNames = {
        trigger: "bg-white/10 border-white/20 data-[hover=true]:bg-white/20 backdrop-blur-md transition-all duration-300 text-center rounded-full",
        value: "text-white font-medium text-center",
        selectorIcon: "hidden",
        popoverContent: "bg-[#14291c] border-white/10 dark rounded-xl",
        base: "text-white"
    };

    // Glassmorphism Styles for Chapter/Verse (Smaller, Centered)
    const smallSelectClassNames = {
        trigger: "bg-white/10 border-white/20 data-[hover=true]:bg-white/20 backdrop-blur-md transition-all duration-300 text-center min-h-unit-10 rounded-full",
        value: "text-white font-medium text-center",
        selectorIcon: "hidden",
        popoverContent: "bg-[#14291c] border-white/10 dark min-w-[120px] rounded-xl",
        base: "text-white max-w-[140px]"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
        >
            <Card className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-visible">
                <CardHeader className="flex gap-3 px-6 pt-6 pb-2">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-white">Scripture Search</h2>
                        <p className="text-small text-primary-400/80">Search specific verses on WOL</p>
                    </div>
                </CardHeader>
                <CardBody className="px-6 py-6 flex flex-col gap-6">
                    {/* All Selectors in One Row */}
                    <div className="flex justify-center items-end gap-4 flex-wrap">
                        {/* Book */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-primary-400 text-sm font-medium">Book</label>
                            <Select
                                placeholder="Select Book"
                                classNames={bookSelectClassNames}
                                variant="bordered"
                                radius="full"
                                selectedKeys={selectedBookIndex !== "" ? [selectedBookIndex] : []}
                                onChange={handleBookChange}
                                aria-label="Select Bible Book"
                                className="min-w-[180px]"
                            >
                                {bibleData.map((b, i) => (
                                    <SelectItem key={i} value={i} textValue={b.name} className="text-white data-[hover=true]:bg-white/10 data-[hover=true]:text-white text-center">
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        {/* Chapter */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-primary-200 text-sm font-medium">Chapter</label>
                            {!isSingleChapter ? (
                                <Select
                                    placeholder="-"
                                    isDisabled={!book}
                                    classNames={smallSelectClassNames}
                                    variant="bordered"
                                    radius="full"
                                    selectedKeys={selectedChapter ? [selectedChapter.toString()] : []}
                                    onChange={(e) => {
                                        setSelectedChapter(e.target.value);
                                        setSelectedVerse("");
                                    }}
                                    aria-label="Select Chapter"
                                    className="min-w-[100px]"
                                >
                                    {chapters.map((c) => (
                                        <SelectItem key={c} value={c} textValue={c.toString()} className="text-white data-[hover=true]:bg-white/10 text-center">
                                            {c.toString()}
                                        </SelectItem>
                                    ))}
                                </Select>
                            ) : (
                                <div className="px-4 py-2 text-primary-200/50 text-sm flex items-center justify-center border border-dashed border-white/10 rounded-full bg-white/5 min-w-[100px]">
                                    1
                                </div>
                            )}
                        </div>

                        {/* Verse */}
                        <div className="flex flex-col items-center gap-1">
                            <label className="text-primary-200 text-sm font-medium">Verse</label>
                            <Select
                                placeholder="-"
                                isDisabled={!book || (!isSingleChapter && !selectedChapter)}
                                classNames={smallSelectClassNames}
                                variant="bordered"
                                radius="full"
                                selectedKeys={selectedVerse ? [selectedVerse.toString()] : []}
                                onChange={(e) => setSelectedVerse(e.target.value)}
                                aria-label="Select Verse"
                                className="min-w-[100px]"
                            >
                                {verses.map((v) => (
                                    <SelectItem key={v} value={v} textValue={v.toString()} className="text-white data-[hover=true]:bg-white/10 text-center">
                                        {v.toString()}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        radius="full"
                        isDisabled={!book || !selectedVerse}
                        onPress={handleSearch}
                        className="font-bold mt-2 px-8 py-3 text-lg bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-black shadow-lg shadow-primary-500/30 transition-[transform,shadow] active:scale-95 self-center"
                        variant="shadow"
                    >
                        Search on WOL
                    </Button>
                </CardBody>
            </Card>
        </motion.div>
    );
}
