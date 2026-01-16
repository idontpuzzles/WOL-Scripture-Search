
import layout from 'crossword-layout-generator';

const inputWords = [
    { answer: 'HOPE', clue: 'Test clue 1' },
    { answer: 'FAITH', clue: 'Test clue 2' }
];

try {
    const result = layout.generateLayout(inputWords);
    console.log(JSON.stringify(result, null, 2));
} catch (e) {
    console.error("Error running layout generator:", e);
}
