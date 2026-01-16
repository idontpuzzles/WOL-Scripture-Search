
// Final Grid Generation

const words = [
    // --- Cluster 1: Main (Keep coords) ---
    { n: 1, d: 'across', a: 'BAG', c: "David put five smooth stones in his shepherd's ___ (1 Samuel 17:40)", r: 0, k: 10 },
    { n: 2, d: 'down', a: 'AIR', c: "\"Birds of the ___ have nests\" (Matthew 8:20)", r: 0, k: 11 },
    { n: 3, d: 'across', a: 'ARAD', c: "Canaanite king who fought against Israel (Numbers 21:1)", r: 2, k: 10 },
    { n: 4, d: 'down', a: 'AHBAN', c: "Son of Abishur and Abihail (1 Chronicles 2:29)", r: 2, k: 12 },
    { n: 5, d: 'down', a: 'WAR', c: "Battle or fighting", r: 1, k: 10 },
    { n: 6, d: 'across', a: 'ETA', c: "Seventh letter of the Greek alphabet", r: 2, k: 8 },
    { n: 9, d: 'down', a: 'EAGLE', c: "They shall mount up with wings as ___s (Isaiah 40:31)", r: 2, k: 8 },
    { n: 8, d: 'across', a: 'GOB', c: "Location of battles between Israel and the Philistines (2 Samuel 21:18)", r: 4, k: 10 },
    { n: 20, d: 'down', a: 'PITY', c: "Compassion or sorrow for another (Proverbs 19:17)", r: 0, k: 9 },

    { n: 11, d: 'across', a: 'BLINDGUIDES', c: "What Jesus called the Pharisees (Matthew 23:24)", r: 6, k: 9 },
    { n: 37, d: 'down', a: 'BOAR', c: "Wild beast from the woods (Psalm 80:13)", r: 6, k: 9 },
    { n: 10, d: 'down', a: 'BURYINGPLACE', c: "Site for the dead; the Cave of Machpelah was one (Genesis 23:4)", r: 5, k: 15 },
    { n: 13, d: 'across', a: 'STOICS', c: "Philosophers who debated with Paul in Athens (Acts 17:18)", r: 9, k: 12 },
    { n: 14, d: 'across', a: 'LANCE', c: "Weapon similar to a spear (Jeremiah 50:42)", r: 13, k: 15 },
    { n: 12, d: 'down', a: 'FLEECE', c: "Wool used by Gideon for a sign (Judges 6:37)", r: 11, k: 19 },
    { n: 15, d: 'down', a: 'DANNAH', c: "A city in the mountains of Judah (Joshua 15:49)", r: 14, k: 14 },
    { n: 16, d: 'across', a: 'NEEDLESEYE', c: "It is easier for a camel to go through this than a rich man to enter the Kingdom (Luke 18:25)", r: 16, k: 14 },
    { n: 17, d: 'down', a: 'SEA', c: "The Red or the Salt, for example", r: 16, k: 20 },
    { n: 18, d: 'down', a: 'CANAL', c: "Artificial waterway; river Chebar (Ezekiel 1:1)", r: 10, k: 16 },
    { n: 19, d: 'down', a: 'UNABLE', c: "Lacking the power to do something", r: 1, k: 18 },

    // --- Cluster 2: Bottom Left ---
    { n: 26, d: 'across', a: 'AHIRA', c: "Chief of the tribe of Naphtali (Numbers 1:15)", r: 18, k: 1 },
    { n: 27, d: 'down', a: 'HODIJAH', c: "A Levite who sealed the covenant (Nehemiah 10:13)", r: 18, k: 2 },
    { n: 25, d: 'down', a: 'APPAREL', c: "\"Old shoes and clouted upon their feet, and old garments upon them\" (Joshua 9:5)", r: 18, k: 5 },
    { n: 31, d: 'across', a: 'ROD', c: "\"Thy ___ and thy staff they comfort me\" (Psalm 23:4)", r: 19, k: 1 },
    { n: 32, d: 'down', a: 'REZIN', c: "King of Syria who besieged Jerusalem (2 Kings 16:5)", r: 19, k: 1 },
    { n: 34, d: 'down', a: 'EGLAH', c: "One of King David's wives (2 Samuel 3:5)", r: 19, k: 6 },
    { n: 39, d: 'across', a: 'ANAB', c: "A city in the mountains of Judah, formerly inhabited by Anakim (Joshua 11:21)", r: 18, k: 5 },
    { n: 21, d: 'across', a: 'SALMA', c: "Father of Boaz (1 Chronicles 2:11)", r: 21, k: 4 },
    { n: 40, d: 'across', a: 'WAR', c: "\"And ye shall hear of ___s and rumors of ___s\" (Matthew 24:6)", r: 22, k: 3 },

    // --- Cluster 3: Bottom Right ---
    { n: 28, d: 'across', a: 'ACCOUNTABLE', c: "Held responsible; answerable", r: 20, k: 19 },
    { n: 35, d: 'across', a: 'HEEDED', c: "Listened to or paid attention to", r: 22, k: 19 },
    { n: 35, d: 'down', a: 'HAGAB', c: "His descendants were among the Nethinim (Ezra 2:46)", r: 22, k: 14 },
    { n: 22, d: 'across', a: 'HENNA', c: "Plant used for dye and fragrance; \"camphire\" in KJV (Song of Solomon 1:14)", r: 20, k: 15 },
    { n: 23, d: 'down', a: 'INNER', c: "The ___ court of the temple (Ezekiel 10:3)", r: 18, k: 17 },
    { n: 36, d: 'across', a: 'GOMER', c: "A son of Japheth (Genesis 10:2)", r: 17, k: 17 },
    { n: 30, d: 'across', a: 'NABAL', c: "The foolish husband of Abigail (1 Samuel 25:3)", r: 19, k: 25 },
    { n: 29, d: 'down', a: 'TALENT', c: "Biblical unit of weight or currency (Matthew 25:15)", r: 18, k: 28 },
    { n: 33, d: 'across', a: 'JEEZER', c: "A descendant of Gilead (Numbers 26:30)", r: 21, k: 24 },
    { n: 38, d: 'across', a: 'HOE', c: "Tool for digging; mattock (Isaiah 7:25)", r: 21, k: 12 },
    { n: 24, d: 'across', a: 'GNAW', c: "To chew on; what bones do to the evening wolves? (Zephaniah 3:3)", r: 18, k: 12 },
];

const gridWidth = 30;
const gridHeight = 35;
const grid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));

words.forEach(w => {
    for (let i = 0; i < w.a.length; i++) {
        let r = w.r + (w.d === 'down' ? i : 0);
        let c = w.k + (w.d === 'across' ? i : 0);
        if (r < gridHeight && c < gridWidth) {
            grid[r][c] = { letter: w.a[i], number: (i === 0 ? w.n : (grid[r][c] ? grid[r][c].number : undefined)) };
        }
    }
});

const clues = {
    across: words.filter(w => w.d === 'across').map(w => ({
        number: w.n,
        clue: w.c,
        answer: w.a,
        row: w.r,
        col: w.k,
        length: w.a.length
    })).sort((a, b) => a.number - b.number),
    down: words.filter(w => w.d === 'down').map(w => ({
        number: w.n,
        clue: w.c,
        answer: w.a,
        row: w.r,
        col: w.k,
        length: w.a.length
    })).sort((a, b) => a.number - b.number)
};

const output = `// Bible Crossword Puzzles Data - Full Puzzle

const bibleCrossword1 = {
    id: 'bible-crossword-1',
    title: 'Bible Crossword #1',
    description: 'Test your Bible knowledge with this challenging crossword puzzle',
    grid: ${JSON.stringify(grid, null, 4)},
    clues: ${JSON.stringify(clues, null, 4)}
};

export const puzzles = [bibleCrossword1];

/**
 * Get a puzzle by ID
 */
export function getPuzzleById(id) {
    return puzzles.find(p => p.id === id);
}

/**
 * Get all puzzles (for listing)
 */
export function getAllPuzzles() {
    return puzzles.map(({ id, title, description }) => ({ id, title, description }));
}
`;

console.log(output);
