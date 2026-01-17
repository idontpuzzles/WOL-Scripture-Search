
const fs = require('fs');

const puzzleJson = fs.readFileSync('temp_puzzle.json', 'utf8');
const startIndex = puzzleJson.indexOf('{');
const endIndex = puzzleJson.lastIndexOf('}');
const cleanJson = puzzleJson.substring(startIndex, endIndex + 1);

let puzzleData = fs.readFileSync('src/data/puzzles.js', 'utf8');

const startMarker = 'const bibleCrossword3 = {';
const startPos = puzzleData.indexOf(startMarker);

if (startPos === -1) {
    console.error("Could not find bibleCrossword3 start!");
    process.exit(1);
}

// Find the export line
const endMarker = 'export const puzzles';
const endPos = puzzleData.indexOf(endMarker, startPos);

if (endPos === -1) {
    console.error("Could not find export definition after bibleCrossword3!");
    process.exit(1);
}

// Ensure strict replacement
const newContent = `const bibleCrossword3 = ${cleanJson};\n\n`;
const finalData = puzzleData.slice(0, startPos) + newContent + puzzleData.slice(endPos);

fs.writeFileSync('src/data/puzzles.js', finalData);
console.log("Successfully injected puzzle with updated description.");
