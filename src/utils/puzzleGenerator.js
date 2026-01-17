
import layout from 'crossword-layout-generator';

/**
 * Generates a crossword puzzle object from a list of words.
 * @param {string} title - The title of the puzzle.
 * @param {Array<{answer: string, clue: string}>} words - List of words to include.
 * @param {string} description - Description of the puzzle.
 * @returns {Object} The formatted puzzle object.
 */
export function generatePuzzle(title, words, description = 'Custom generated puzzle') {
    const inputWords = words.map(w => ({
        answer: w.answer.toUpperCase(),
        clue: w.clue
    }));

    // Generate with retries to ensure connectivity
    const MAX_RETRIES = 20;
    let bestResult = null;
    let bestScore = -1; // Score based on connectivity and placement count

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const layoutResult = layout.generateLayout(inputWords);
        const placedWords = layoutResult.result;

        // Check 1: Did we place all words?
        // Check 2: Are all placed words connected?

        // Build adjacency graph for connectivity check
        const graph = new Map(); // index -> Set of indices
        placedWords.forEach((_, i) => graph.set(i, new Set()));

        // Naive intersection check: O(N^2) but N is small (30)
        for (let i = 0; i < placedWords.length; i++) {
            for (let j = i + 1; j < placedWords.length; j++) {
                const w1 = placedWords[i];
                const w2 = placedWords[j];

                // Words intersect if they share a cell
                // w1 spans (w1.startx, w1.starty) to end...
                const coords1 = new Set();
                for (let k = 0; k < w1.answer.length; k++) {
                    const x = w1.startx + (w1.orientation === 'across' ? k : 0);
                    const y = w1.starty + (w1.orientation === 'down' ? k : 0);
                    coords1.add(`${x},${y}`);
                }

                // Check overlap with w2
                let intersect = false;
                for (let k = 0; k < w2.answer.length; k++) {
                    const x = w2.startx + (w2.orientation === 'across' ? k : 0);
                    const y = w2.starty + (w2.orientation === 'down' ? k : 0);
                    if (coords1.has(`${x},${y}`)) {
                        intersect = true;
                        break;
                    }
                }

                if (intersect) {
                    graph.get(i).add(j);
                    graph.get(j).add(i);
                }
            }
        }

        // BFS for connectivity
        const visited = new Set();
        if (placedWords.length > 0) {
            const queue = [0];
            visited.add(0);
            while (queue.length > 0) {
                const curr = queue.shift();
                const neighbors = graph.get(curr);
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }
        }

        const isFullyConnected = visited.size === placedWords.length;
        const allWordsPlaced = placedWords.length === inputWords.length;

        // Perfect result
        if (isFullyConnected && allWordsPlaced) {
            bestResult = layoutResult;
            break; // Stop immediately
        }

        // Keep best incomplete result just in case (prefer connected, then most words)
        const score = (isFullyConnected ? 1000 : 0) + placedWords.length;
        if (score > bestScore) {
            bestScore = score;
            bestResult = layoutResult;
        }
    }

    const layoutResult = bestResult || layout.generateLayout(inputWords); // Fallback to fresh if all failed (unlikely)

    const gridRows = layoutResult.rows;
    const gridCols = layoutResult.cols;
    const table = layoutResult.table; // 2D array of chars or empty strings/nulls
    const placedWords = layoutResult.result;

    // Reconstruct numbered grid style
    const grid = Array(gridRows).fill(null).map(() => Array(gridCols).fill(null));
    const cellMetadata = {}; // key: "r-c", value: { number: int, startsAcross: bool, startsDown: bool }

    placedWords.forEach(w => {
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
            clue: w.clue,
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
        description,
        grid,
        clues: {
            across: acrossClues,
            down: downClues
        }
    };
}
