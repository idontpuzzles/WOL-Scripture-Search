
const layout = require('crossword-layout-generator');

const words = [
    { answer: "FIRSTRIPEFRUITS", clue: "Although the quantity was not specified, Jehovah required that the nation of Israel offer the best of these to him [3 words] (Exodus 23:19)" },
    { answer: "YIRON", clue: "One of the fortified cities in the territory of Naphtali (Joshua 19:38)" },
    { answer: "GOG", clue: "He is drawn into attacking God’s people because they enjoy prosperity and seem unprotected (Ezekiel 38:10-12, 14-16)" },
    { answer: "FELIX", clue: "Hoping to get a bribe from Paul, he held the apostle prisoner for two years in Caesarea (Acts 24:26, 27)" },
    { answer: "UNCLEAN", clue: "What lepers in Israel were required to call out, so as to warn others to stay away and not become contaminated (Leviticus 13:45)" },
    { answer: "GRAVE", clue: "Jacob stationed a pillar over Rachel’s (Genesis 35:20)" },
    { answer: "EXILE", clue: "Because of unfaithfulness to the covenant that they had made with Jehovah, the Israelites were led into this (Jeremiah 20:4)" },
    { answer: "REVENGE", clue: "Retaliation in kind or degree (Jeremiah 20:10)" },
    { answer: "EARTHLY", clue: "James said that jealousy, contentiousness, and lying against the truth is this and not the wisdom from above (James 3:15)" },
    { answer: "ALMUG", clue: "A tree that Solomon requested of King Hiram for use in construction of the temple and for making harps and stringed instruments (1 Kings 10:11, 12, King James Version)" },
    { answer: "SYRIA", clue: "Jehovah commissioned Elijah to anoint Hazael as king of this nation (1 Kings 19:15)" },
    { answer: "AMARIAH", clue: "He was the chief priest “for every matter of Jehovah” during Jehoshaphat’s reign (2 Chronicles 19:11)" },
    { answer: "RAISE", clue: "Resurrect (Hebrews 11:19)" },
    { answer: "AIM", clue: "Paul advised Timothy to train himself with godly devotion as this (1 Timothy 4:7)" },
    { answer: "NECHO", clue: "Nebuchadnezzar defeated this Egyptian Pharaoh at Carchemish during the reign of King Jehoiakim of Judah (Jeremiah 46:2)" },
    { answer: "SHEDDINGOFBLOOD", clue: "Because of Abigail’s sensibleness, David avoided this rash act [3 words] (1 Samuel 25:31)" },
    { answer: "FLYINGCREATURES", clue: "Alternate expression used in the Bible to indicate birds [2 words] (Genesis 1:26)" },
    { answer: "RARE", clue: "Infrequent (Proverbs 25:17)" },
    { answer: "TONGUE", clue: "Control of this body member plays a large role in gaining Jehovah’s favor (1 Peter 3:10-12)" },
    { answer: "PEOPLES", clue: "Bodies of persons distinguished by something they hold in common (Revelation 7:9)" },
    { answer: "REFINE", clue: "To separate and purify metals (Job 28:1)" },
    { answer: "IDLE", clue: "Useless, lacking worth (1 Timothy 1:6)" },
    { answer: "SIXTEENYEARSOLD", clue: "It was at this age that Uzziah began to reign over Judah in place of his father Amaziah [3 words] (2 Chronicles 26:1-3)" },
    { answer: "AVVIM", clue: "Early settlers in a western part of Canaan (Deuteronomy 2:23)" },
    { answer: "IBHAR", clue: "One of David’s sons who was born in Jerusalem (2 Samuel 5:15)" },
    { answer: "AGE", clue: "Maturity (John 9:21)" },
    { answer: "RAM", clue: "This animal served as an installation offering for the Aaronic priesthood (Leviticus 8:22-28)" },
    { answer: "MARKING", clue: "Indelible coloring of the skin by tattoos (Leviticus 19:28)" },
    { answer: "GALEED", clue: "The name Jacob gave to the place where he and Laban concluded a covenant of peace (Genesis 31:43-53)" },
    { answer: "SHINAB", clue: "This king of Admah was one of the five monarchs who unsuccessfully rebelled against King Chedorlaomer (Genesis 14:2-5)" },
    { answer: "WINE", clue: "What Jesus made in his first miracle (John 2:7-11)" },
    { answer: "ECHO", clue: "To repeat or imitate" }
];

// Re-using the generatePuzzle logic from src/utils/puzzleGenerator.js but adapted for Node
function generatePuzzle(title, words) {
    const inputWords = words.map(w => ({
        answer: w.answer.toUpperCase(),
        clue: w.clue
    }));

    const layoutResult = layout.generateLayout(inputWords);

    const gridRows = layoutResult.rows;
    const gridCols = layoutResult.cols;
    const table = layoutResult.table; // 2D array of chars or empty strings/nulls
    const placedWords = layoutResult.result;

    const grid = Array(gridRows).fill(null).map(() => Array(gridCols).fill(null));

    const cellMetadata = {};

    placedWords.forEach(w => {
        const row = w.starty - 1;
        const col = w.startx - 1;

        const key = `${row}-${col}`;
        if (!cellMetadata[key]) cellMetadata[key] = { number: null, startsAcross: false, startsDown: false, wordRefs: [] };

        if (w.orientation === 'across') cellMetadata[key].startsAcross = true;
        if (w.orientation === 'down') cellMetadata[key].startsDown = true;
        cellMetadata[key].wordRefs.push(w);
    });

    let counter = 1;
    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const key = `${r}-${c}`;
            if (cellMetadata[key]) {
                cellMetadata[key].number = counter++;
            }
        }
    }

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const char = table[r][c];
            if (char && char !== '-' && char !== '') {
                const key = `${r}-${c}`;
                grid[r][c] = {
                    letter: char,
                    number: cellMetadata[key] ? cellMetadata[key].number : undefined
                };
            } else {
                grid[r][c] = null;
            }
        }
    }

    const acrossClues = [];
    const downClues = [];

    placedWords.forEach(w => {
        const row = w.starty - 1;
        const col = w.startx - 1;
        const key = `${row}-${col}`;
        const meta = cellMetadata[key];

        const clueObj = {
            number: meta.number,
            clue: w.clue,
            answer: w.answer,
            row: row,
            col: col,
            length: w.answer.length
        };

        if (w.orientation === 'across') acrossClues.push(clueObj);
        else downClues.push(clueObj);
    });

    acrossClues.sort((a, b) => a.number - b.number);
    downClues.sort((a, b) => a.number - b.number);

    return {
        id: `custom-${Date.now()}`,
        title,
        description: 'WOL Crossword g05 8/8',
        grid,
        clues: {
            across: acrossClues,
            down: downClues
        }
    };
}

const puzzle = generatePuzzle('g05 8/8', words);
console.log(JSON.stringify(puzzle, null, 4));
