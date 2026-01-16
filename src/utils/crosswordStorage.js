// localStorage helpers for crossword puzzle progress

const STORAGE_KEY = 'wol_crossword_progress';

/**
 * Get all saved puzzle progress
 */
export function getAllProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

/**
 * Get progress for a specific puzzle
 * @param {string} puzzleId 
 * @returns {object} { userGrid: string[][], completed: boolean }
 */
export function getPuzzleProgress(puzzleId) {
    const allProgress = getAllProgress();
    return allProgress[puzzleId] || null;
}

/**
 * Save progress for a specific puzzle
 * @param {string} puzzleId 
 * @param {string[][]} userGrid - User's entered letters
 * @param {boolean} completed - Whether puzzle is complete
 */
export function savePuzzleProgress(puzzleId, userGrid, completed = false) {
    const allProgress = getAllProgress();
    allProgress[puzzleId] = {
        userGrid,
        completed,
        lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

/**
 * Clear progress for a specific puzzle
 * @param {string} puzzleId 
 */
export function clearPuzzleProgress(puzzleId) {
    const allProgress = getAllProgress();
    delete allProgress[puzzleId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}
