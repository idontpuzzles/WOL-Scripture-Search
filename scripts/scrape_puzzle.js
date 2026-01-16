
import { generatePuzzle } from '../src/utils/puzzleGenerator.js';
import https from 'https';

const url = process.argv[2];

if (!url) {
    console.error("Please provide a URL as an argument.");
    process.exit(1);
}

// Helper to fetch URL
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (err) => reject(err));
    });
}

// Helper to clean text
function cleanText(text) {
    return text.replace(/<[^>]*>/g, '').trim();
}

async function run() {
    try {
        console.error(`Fetching ${url}...`);
        const html = await fetchUrl(url);

        // Simple regex-based parsing since we don't have DOM in Node without heavy libs
        // Logic: Find "Clues Across" -> take p.sm items until next p.ss

        // Extract sections
        const extractSection = (headerRegex) => {
            const headerMatch = html.match(headerRegex);
            if (!headerMatch) return [];

            const remainingHtml = html.substring(headerMatch.index + headerMatch[0].length);
            // Match all <p class="sm"> until next <p class="ss"> or end
            const items = [];

            const pSmRegex = /<p[^>]*class="sm"[^>]*>(.*?)<\/p>/gs;
            const pSsRegex = /<p[^>]*class="ss"[^>]*>/; // Stop marker

            // We split by standard paragraphs tags
            // Let's iterate line by line or tag by tag? simple split by <p 
            const paragraphs = remainingHtml.split('<p');

            for (let i = 0; i < paragraphs.length; i++) {
                let p = '<p' + paragraphs[i]; // restore tag
                if (p.includes('class="ss"')) {
                    if (i === 0) continue; // Skip the header itself if split included it oddly? 
                    // Actually, we split remainingHtml. The first chunk is immediate.
                    // If we encounter another ss, stop.
                    if (i > 0) break;
                }

                if (p.includes('class="sm"')) {
                    // Extract content
                    const contentValues = p.match(/>(.*?)<\/p>/s);
                    if (contentValues && contentValues[1]) {
                        items.push(contentValues[1]);
                    }
                }
            }
            return items;
        };




        // Better Regex Approach for sections
        // Normalize quotes in HTML to make regex easier
        const normalizedHtml = html.replace(/class=['"]([a-zA-Z0-9\s]+)['"]/g, 'class="$1"');


        // Helper to find header index by regex
        const findHeaderIndex = (pattern) => {
            // Match p class="ss" containing the pattern, allowing other tags inside
            const regex = new RegExp(`<p[^>]*class="ss"[^>]*>.*?${pattern}.*?<\\/p>`, 'i');
            const match = normalizedHtml.match(regex);
            return match ? match.index + match[0].length : -1;
        };

        // Locate end indices of headers (start of content)
        const indices = {
            ca: findHeaderIndex('Clues Across'),
            cd: findHeaderIndex('Clues Down'),
            sa: findHeaderIndex('Solutions Across'),
            sd: findHeaderIndex('Solutions Down')
        };

        console.error("Indices found (Content Start):", indices);


        // Sort indices to define ranges
        const sortedIndices = Object.entries(indices)
            .filter(([k, v]) => v !== -1)
            .sort((a, b) => a[1] - b[1]);

        const getRangeContent = (key) => {
            const entry = sortedIndices.find(e => e[0] === key);
            if (!entry) return "";
            const idx = sortedIndices.indexOf(entry);
            const start = entry[1];
            // Stop at next header OR next huge div change?
            const end = (idx + 1 < sortedIndices.length) ? sortedIndices[idx + 1][1] : normalizedHtml.length;

            // Safety: If the end is strangely far or content includes another header signature (unlikely with sorted)
            return normalizedHtml.substring(start, end);
        };


        const parseItems = (sectionHtml) => {
            // Match p.sm paragraphs
            const regex = /<p[^>]*class="sm"[^>]*>(.*?)<\/p>/gs;
            const items = [];
            let match;
            while ((match = regex.exec(sectionHtml)) !== null) {
                // Format: "1. Text..."
                let content = match[1];
                let text = cleanText(content);
                // Extract number
                const numMatch = text.match(/^(\d+)\.\s+(.*)/);
                if (numMatch) {
                    items.push({ num: parseInt(numMatch[1]), text: numMatch[2] });
                }
            }
            return items;
        };

        const cluesAcross = parseItems(getRangeContent('ca'));
        const cluesDown = parseItems(getRangeContent('cd'));
        const solutionsAcross = parseItems(getRangeContent('sa'));
        const solutionsDown = parseItems(getRangeContent('sd'));

        console.error(`Found:
        ${cluesAcross.length} Across Clues
        ${cluesDown.length} Down Clues
        ${solutionsAcross.length} Across Solutions
        ${solutionsDown.length} Down Solutions`);


        // Combine
        const words = [];

        const combine = (clues, solutions, dir) => {
            clues.forEach(c => {
                const sol = solutions.find(s => s.num === c.num);
                if (sol) {
                    words.push({
                        answer: sol.text.toUpperCase().replace(/[^A-Z]/g, ''),
                        clue: c.text
                    });
                } else {
                    console.warn(`Missing solution for ${dir} ${c.num}`);
                }
            });
        };

        combine(cluesAcross, solutionsAcross, 'Across');
        combine(cluesDown, solutionsDown, 'Down');

        if (words.length === 0) {
            console.error("No words found. Check URL or parser logic.");
            process.exit(1);
        }

        // Generate Puzzle
        const titleRegex = /<h1[^>]*>(.*?)<\/h1>/;
        const webTitleMatch = html.match(titleRegex);
        const webTitle = webTitleMatch ? cleanText(webTitleMatch[1]) : "Scraped Puzzle";



        console.error(` Generating puzzle: "${webTitle}" with ${words.length} words...`);

        // Silence console.log during library execution because it leaks specific debug info
        const originalLog = console.log;
        console.log = () => { };

        let puzzle;
        try {
            puzzle = generatePuzzle(webTitle, words);
        } finally {
            console.log = originalLog; // Restore
        }

        // Output code

        const code = `// Bible Crossword Puzzles Data - Full Puzzle

const bibleCrossword1 = ${JSON.stringify(puzzle, null, 4)};

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
        console.log(code);


    } catch (e) {
        console.error("Error:", e);
    }
}

run();
