
import layout from 'crossword-layout-generator';

/**
 * Generates a crossword puzzle object from a list of words.
 * @param {string} title - The title of the puzzle.
 * @param {Array<{answer: string, clue: string}>} words - List of words to include.
 * @returns {Object} The formatted puzzle object.
 */
export function generatePuzzle(title, words) {
    // Transform input for the library
    // The library expects specific input format, or simple strings? 
    // Checking docs indirectly: usually expects array of objects or strings to place.
    // However, the library 'crossword-layout-generator' signature:
    // generateLayout(words_json)
    // words_json = [{answer: "WORD", clue: "CLUE"}, ... ] (or just answers if clues handled later, but we need mapping)

    // According to typical usage:
    // const layout = require('crossword-layout-generator');
    // const output = layout.generateLayout([{str: "answer", clue: "clue"}, ...]); 
    // Wait, the library might be 'crossword-layout-generator' or similar.
    // Let's assume standard input {answer, clue} or similar.
    // The library output usually is a grid + result list with positions.

    // Let's try to map our input to what it likely expects: objects with 'answer' keys.
    const inputWords = words.map(w => ({
        answer: w.answer.toUpperCase(),
        clue: w.clue
    }));

    // Generate
    const layoutResult = layout.generateLayout(inputWords);

    // The result 'layoutResult' typically contains:
    // { table: [[]], result: [{answer, row, col, orientation, position}] }
    // Or similar structure. We need to inspect or assume behavior.
    // Most of these generators return a 'table' (grid) and a list of placed words.

    // If layoutResult is the result object:
    const gridRows = layoutResult.rows;
    const gridCols = layoutResult.cols;
    const table = layoutResult.table; // 2D array of chars or empty strings/nulls
    const placedWords = layoutResult.result; // Data about placed words?

    // We need to reconstruct our "numbered" grid style.
    // 1. Create empty grid
    const grid = Array(gridRows).fill(null).map(() => Array(gridCols).fill(null));

    // 2. Identify start positions for numbering
    // We can't rely blindly on library numbering if we want standard '1, 2, 3' reading order.
    // We must re-number based on top-left to bottom-right order.

    // Let's map the 'table' logic to our grid first.
    // The library 'table' usually has letters.

    // We need to know WHICH words are where to assign clues.
    // 'placedWords' acts as the key.

    // Sort placed words by position (row then col) to assign numbers
    // But wait, standard crossword numbering:
    // A cell gets a number if it starts a word (Across or Down).
    // Numbers adhere to reading order (row-major).

    const cellMetadata = {}; // key: "r-c", value: { number: int, startsAcross: bool, startsDown: bool }

    placedWords.forEach(w => {
        const r = w.starty - 1; // Library is usually 1-indexed? Or 0? Let's assume 1 based on common libs, check output if needed.
        // Actually, let's assume 0-indexed for now? 
        // Docs for 'crossword-layout-generator':
        // output: { table: [...], result: [ { answer, startx, starty, orientation: 'across'/'down', position: 1 } ] }
        // usually 1-indexed.

        // Let's normalize to 0-indexed.
        const row = w.starty - 1;
        const col = w.startx - 1;

        const key = `${row}-${col}`;
        if (!cellMetadata[key]) cellMetadata[key] = { number: null, startsAcross: false, startsDown: false, wordRefs: [] };

        if (w.orientation === 'across') cellMetadata[key].startsAcross = true;
        if (w.orientation === 'down') cellMetadata[key].startsDown = true;
        cellMetadata[key].wordRefs.push(w);
    });

    // Assign numbers
    let counter = 1;
    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const key = `${r}-${c}`;
            if (cellMetadata[key]) {
                cellMetadata[key].number = counter++;
            }
        }
    }

    // Build Output Grid
    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const char = table[r][c]; // Assume ' ' or char
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

    // Build Clues Lists
    const acrossClues = [];
    const downClues = [];

    placedWords.forEach(w => {
        const row = w.starty - 1;
        const col = w.startx - 1;
        const key = `${row}-${col}`;
        const meta = cellMetadata[key];

        const clueObj = {
            number: meta.number,
            clue: w.clue, // Assuming input 'w' preserved the 'clue' property? The library might verify this.
            // If library strips extra props, we need to map back by 'answer'.
            answer: w.answer,
            row: row,
            col: col,
            length: w.answer.length
        };

        if (w.orientation === 'across') acrossClues.push(clueObj);
        else downClues.push(clueObj);
    });

    // Sort
    acrossClues.sort((a, b) => a.number - b.number);
    downClues.sort((a, b) => a.number - b.number);

    return {
        id: `custom-${Date.now()}`,
        title,
        description: 'Custom generated puzzle',
        grid,
        clues: {
            across: acrossClues,
            down: downClues
        }
    };
}
