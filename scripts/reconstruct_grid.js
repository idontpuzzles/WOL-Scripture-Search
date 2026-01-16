
// Grid Reconstruction Script with Solver

const fixedWords = [
    [1, 'across', 'BAG', "David put five smooth stones...", 0, 10],
    [2, 'down', 'AIR', "Birds of the...", 0, 11],
    [3, 'across', 'ARAD', "Canaanite king...", 2, 10],
    [4, 'down', 'AHBAN', "Son of Abishur...", 2, 12],
    [8, 'across', 'GOB', "Location of battles...", 4, 10],
    [11, 'across', 'BLINDGUIDES', "What Jesus called the Pharisees...", 6, 9],
    [10, 'down', 'BURYINGPLACE', "Site for the dead...", 5, 15],
    [13, 'across', 'STOICS', "Philosophers...", 9, 12],
    [14, 'across', 'LANCE', "Weapon similar to a spear...", 13, 15],
    [12, 'down', 'FLEECE', "Wool used by Gideon...", 11, 19],
    [15, 'down', 'DANNAH', "A city in the mountains...", 14, 14],
    [16, 'across', 'NEEDLESEYE', "Easier for a camel...", 16, 14],
    [17, 'down', 'SEA', "The Red or the Salt...", 16, 20],
].map(w => ({ number: w[0], direction: w[1], answer: w[2], clue: w[3], fixed: true, row: w[4], col: w[5] }));

const pendingWords = [
    [5, 'down', 'WAR', "Battle or fighting", { maxRow: 5, maxCol: 15 }],
    [6, 'across', 'ETA', "Seventh letter...", { maxRow: 5, maxCol: 15 }],
    [7, 'down', 'ASHES', "Often paired with sackcloth", { maxRow: 5, maxCol: 15 }],
    [9, 'down', 'EAGLE', "Wings as...", { maxRow: 5, maxCol: 15 }],

    // 17-20 range
    [18, 'down', 'CANAL', "River Chebar", { minRow: 10, minCol: 15 }],
    [19, 'down', 'UNABLE', "Lacking power...", { minRow: 10, minCol: 15 }],
    [20, 'down', 'PITY', "Compassion...", { minRow: 5, minCol: 5 }], // Could be anywhere

    // 21+ high numbers
    [21, 'across', 'SALMA', "Father of Boaz", { minRow: 15, maxCol: 20 }],
    [22, 'across', 'HENNA', "Plant used for dye", { minRow: 15, minCol: 10 }],
    [23, 'down', 'INNER', "The ___ court", { minRow: 15, minCol: 10 }],
    [24, 'across', 'GNAW', "To chew on", { minRow: 15, minCol: 10 }],
    [25, 'down', 'APPAREL', "Old shoes and...", { minRow: 15, minCol: 10 }],
    [26, 'across', 'AHIRA', "Chief of Naphtali", { minRow: 18, minCol: 5 }],
    [27, 'down', 'HODIJAH', "Levite who sealed...", { minRow: 18, minCol: 5 }],
    [28, 'across', 'ACCOUNTABLE', "Held responsible", { minRow: 18, minCol: 10 }],
    [29, 'down', 'TALENT', "Unit of weight", { minRow: 15, minCol: 15 }],
    [30, 'across', 'NABAL', "Foolish husband", { minRow: 20, minCol: 10 }],
    [31, 'across', 'ROD', "Thy ___ and thy staff", { minRow: 20, minCol: 10 }],
    [32, 'down', 'REZIN', "King of Syria", { minRow: 20, minCol: 10 }],
    [33, 'across', 'JEEZER', "Descendant of Gilead", { minRow: 20, minCol: 10 }],
    [34, 'down', 'EGLAH', "One of David's wives", { minRow: 20, minCol: 10 }],
    [35, 'down', 'HAGAB', "Descendants Nethinim", { minRow: 20, minCol: 10 }],
    [35, 'across', 'HEEDED', "Listened to", { minRow: 20, minCol: 10 }],
    [36, 'across', 'GOMER', "Son of Japheth", { minRow: 20, minCol: 10 }],
    [37, 'down', 'BOAR', "Wild beast", { minRow: 20, minCol: 10 }],
    [38, 'across', 'HOE', "Tool for digging", { minRow: 22, minCol: 10 }],
    [39, 'across', 'ANAB', "City in mountains", { minRow: 22, minCol: 5 }],
    [40, 'across', 'WAR', "Rumors of...", { minRow: 22, minCol: 10 }]
].map(w => ({ number: w[0], direction: w[1], answer: w[2], clue: w[3], fixed: false, constraints: w[4] || {} }));

pendingWords.sort((a, b) => a.number - b.number);

const gridWidth = 30;
const gridHeight = 35;
let grid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));

fixedWords.forEach(w => placeWord(grid, w));

function placeWord(g, w) {
    for (let i = 0; i < w.answer.length; i++) {
        let r = w.row + (w.direction === 'down' ? i : 0);
        let c = w.col + (w.direction === 'across' ? i : 0);
        g[r][c] = { letter: w.answer[i], word: w.number };
    }
}

function canPlace(g, w, r, c) {
    // Constraints check
    if (w.constraints.minRow && r < w.constraints.minRow) return false;
    if (w.constraints.maxRow && r > w.constraints.maxRow) return false;
    if (w.constraints.minCol && c < w.constraints.minCol) return false;
    if (w.constraints.maxCol && c > w.constraints.maxCol) return false;

    if (r < 0 || c < 0) return false;
    let endR = r + (w.direction === 'down' ? w.answer.length - 1 : 0);
    let endC = c + (w.direction === 'across' ? w.answer.length - 1 : 0);
    if (endR >= gridHeight || endC >= gridWidth) return false;

    let intersections = 0;

    for (let i = 0; i < w.answer.length; i++) {
        let cr = r + (w.direction === 'down' ? i : 0);
        let cc = c + (w.direction === 'across' ? i : 0);
        let cell = g[cr][cc];

        if (cell) {
            if (cell.letter !== w.answer[i]) return false;
            intersections++;
        } else {
            // Basic adjacency check: letters shouldn't touch parallel words
            // Check neighbor perpendicular to direction
        }
    }

    // Must intersect something unless it's the first
    if (intersections === 0 && w.number > 1) return false;

    return true;
}

function solve(idx) {
    if (idx >= pendingWords.length) return true;

    const w = pendingWords[idx];
    const possibleMoves = [];

    // Optimization: Only scan relevant area if constraints exist, otherwise full grid
    let minR = w.constraints.minRow || 0;
    let maxR = w.constraints.maxRow || gridHeight - 1;
    let minC = w.constraints.minCol || 0;
    let maxC = w.constraints.maxCol || gridWidth - 1;

    for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
            if (grid[r][c]) {
                const letter = grid[r][c].letter;
                for (let i = 0; i < w.answer.length; i++) {
                    if (w.answer[i] === letter) {
                        let startR = r - (w.direction === 'down' ? i : 0);
                        let startC = c - (w.direction === 'across' ? i : 0);
                        if (!possibleMoves.some(m => m.r === startR && m.c === startC)) {
                            possibleMoves.push({ r: startR, c: startC });
                        }
                    }
                }
            }
        }
    }

    // Try moves
    // Shuffle moves to get different solutions? Or sort by distance to something?
    // Sort top-down, left-right
    possibleMoves.sort((a, b) => (a.r - b.r) || (a.c - b.c));

    for (let move of possibleMoves) {
        if (canPlace(grid, w, move.r, move.c)) {
            w.row = move.r;
            w.col = move.c;

            const backup = grid.map(row => row.slice());
            placeWord(grid, w);

            if (solve(idx + 1)) return true;

            grid = backup;
            w.row = undefined;
            w.col = undefined;
        }
    }
    return false;
}

console.log("Solving with constraints...");
if (solve(0)) {
    console.log("Solved!");
    const allWords = [...fixedWords, ...pendingWords];
    // console.log(JSON.stringify(allWords...)); // We will output this to a file or copy from log
    console.log(JSON.stringify(allWords.map(w => ({
        number: w.number,
        direction: w.direction,
        answer: w.answer,
        clue: w.clue,
        row: w.row,
        col: w.col
    })), null, 2));
} else {
    console.log("No solution found.");
}
