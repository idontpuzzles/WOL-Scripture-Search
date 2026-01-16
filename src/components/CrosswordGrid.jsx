import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function CrosswordGrid({ puzzle, userGrid, onCellChange, selectedClue, onSelectClue, showErrors = false, revealed = false }) {
    const [selectedCell, setSelectedCell] = useState(null);
    const [direction, setDirection] = useState('across'); // 'across' or 'down'
    const inputRefs = useRef({});

    const rows = puzzle.grid.length;
    const cols = puzzle.grid[0].length;

    // When a clue is selected, focus on its first cell and set direction
    useEffect(() => {
        if (selectedClue) {
            const { row, col, direction: clueDirection } = selectedClue;

            // Only move cursor if we aren't already in this word (prevents jumping when clicking middle of word)
            const matchesCurrentSelection = selectedCell &&
                selectedCell.row >= row &&
                selectedCell.row < row + (clueDirection === 'down' ? selectedClue.length : 1) &&
                selectedCell.col >= col &&
                selectedCell.col < col + (clueDirection === 'across' ? selectedClue.length : 1) &&
                direction === clueDirection;

            if (!matchesCurrentSelection) {
                setSelectedCell({ row, col });
                setDirection(clueDirection);
                // Focus the first cell of the clue
                const key = `${row}-${col}`;
                setTimeout(() => {
                    inputRefs.current[key]?.focus();
                }, 0);
            } else {
                // Just ensure direction is synced if it mismatched
                if (direction !== clueDirection) {
                    setDirection(clueDirection);
                }
            }
        }
    }, [selectedClue]);

    // Helper to find clue for a cell
    const findClueForCell = (r, c, dir) => {
        if (!puzzle.clues || !puzzle.clues[dir]) return null;
        const clue = puzzle.clues[dir].find(clue => {
            if (dir === 'across') {
                return clue.row === r && c >= clue.col && c < clue.col + clue.length;
            } else {
                return clue.col === c && r >= clue.row && r < clue.row + clue.length;
            }
        });
        return clue ? { ...clue, direction: dir } : null;
    };

    // Handle cell click
    const handleCellClick = (row, col) => {
        const cell = puzzle.grid[row][col];
        if (!cell) return; // Can't select blocked cells

        let newDirection = direction;

        // Smart direction switching
        if (selectedCell?.row === row && selectedCell?.col === col) {
            // Toggle direction if clicking same cell
            newDirection = direction === 'across' ? 'down' : 'across';
        } else {
            // If moving to a new cell, check validity of current direction
            const hasAcross = (puzzle.grid[row][col - 1] || puzzle.grid[row][col + 1]);
            const hasDown = (puzzle.grid[row - 1]?.[col] || puzzle.grid[row + 1]?.[col]);

            if (direction === 'across' && !hasAcross && hasDown) {
                newDirection = 'down';
            } else if (direction === 'down' && !hasDown && hasAcross) {
                newDirection = 'across';
            }
        }

        setSelectedCell({ row, col });
        setDirection(newDirection);

        // Update selected clue to match
        const clue = findClueForCell(row, col, newDirection);
        if (clue && onSelectClue) {
            onSelectClue(clue);
        }

        // Focus the input
        const key = `${row}-${col}`;
        inputRefs.current[key]?.focus();
    };

    // Handle keyboard input
    const handleKeyDown = useCallback((e, row, col) => {
        const cell = puzzle.grid[row][col];
        if (!cell) return;

        if (e.key === 'Backspace') {
            e.preventDefault();
            onCellChange(row, col, '');
            // Move backward
            const prevRow = direction === 'across' ? row : row - 1;
            const prevCol = direction === 'across' ? col - 1 : col;

            if (prevRow >= 0 && prevCol >= 0 && puzzle.grid[prevRow][prevCol]) {
                setSelectedCell({ row: prevRow, col: prevCol });
                setTimeout(() => inputRefs.current[`${prevRow}-${prevCol}`]?.focus(), 0);
            }
        } else if (e.key === 'ArrowUp' && row > 0) {
            e.preventDefault();
            setDirection('down');
            if (puzzle.grid[row - 1][col]) {
                setSelectedCell({ row: row - 1, col });
                setTimeout(() => inputRefs.current[`${row - 1}-${col}`]?.focus(), 0);
            }
        } else if (e.key === 'ArrowDown' && row < rows - 1) {
            e.preventDefault();
            setDirection('down');
            if (puzzle.grid[row + 1][col]) {
                setSelectedCell({ row: row + 1, col });
                setTimeout(() => inputRefs.current[`${row + 1}-${col}`]?.focus(), 0);
            }
        } else if (e.key === 'ArrowLeft' && col > 0) {
            e.preventDefault();
            setDirection('across');
            if (puzzle.grid[row][col - 1]) {
                setSelectedCell({ row, col: col - 1 });
                setTimeout(() => inputRefs.current[`${row}-${col - 1}`]?.focus(), 0);
            }
        } else if (e.key === 'ArrowRight' && col < cols - 1) {
            e.preventDefault();
            setDirection('across');
            if (puzzle.grid[row][col + 1]) {
                setSelectedCell({ row, col: col + 1 });
                setTimeout(() => inputRefs.current[`${row}-${col + 1}`]?.focus(), 0);
            }
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            e.preventDefault();
            onCellChange(row, col, e.key.toUpperCase());
            // Move forward
            const nextRow = direction === 'across' ? row : row + 1;
            const nextCol = direction === 'across' ? col + 1 : col;

            if (nextRow < rows && nextCol < cols && puzzle.grid[nextRow][nextCol]) {
                setSelectedCell({ row: nextRow, col: nextCol });
                setTimeout(() => inputRefs.current[`${nextRow}-${nextCol}`]?.focus(), 0);
            }
        }
    }, [direction, cols, rows, puzzle.grid, onCellChange]);

    // Check if a cell is part of the selected word
    const isInSelectedWord = (row, col) => {
        if (!selectedClue) return false;
        const { row: startRow, col: startCol, length } = selectedClue;
        const isAcross = selectedClue.direction === 'across';

        if (isAcross) {
            return row === startRow && col >= startCol && col < startCol + length;
        } else {
            return col === startCol && row >= startRow && row < startRow + length;
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full overflow-x-auto flex justify-center">
                <div
                    className="grid gap-0.5 bg-black/50 p-1 rounded-lg flex-shrink-0 m-8"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, auto)`,
                    }}
                >
                    {puzzle.grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const key = `${rowIndex}-${colIndex}`;
                            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                            const isHighlighted = isInSelectedWord(rowIndex, colIndex);
                            const userValue = userGrid?.[rowIndex]?.[colIndex] || '';

                            // Check if letter is wrong (for showErrors mode)
                            const isWrong = showErrors && userValue && cell && userValue.toUpperCase() !== cell.letter;

                            if (!cell) {
                                // Blocked cell
                                return (
                                    <div
                                        key={key}
                                        className="w-6 h-6 sm:w-8 sm:h-8 bg-black/80"
                                    />
                                );
                            }

                            // Determine background color
                            let bgColor = 'bg-white/90';
                            if (isSelected) {
                                bgColor = 'bg-primary-500';
                            } else if (isWrong) {
                                bgColor = 'bg-red-400';
                            } else if (isHighlighted) {
                                bgColor = 'bg-primary-400/50';
                            }

                            return (
                                <div
                                    key={key}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    className={`
                                        relative w-6 h-6 sm:w-8 sm:h-8 
                                        flex items-center justify-center
                                        cursor-pointer transition-colors
                                        ${bgColor}
                                    `}
                                >
                                    {cell.number && (
                                        <span className="absolute top-0 left-0.5 text-[6px] sm:text-[8px] text-gray-600 font-medium leading-none">
                                            {cell.number}
                                        </span>
                                    )}
                                    <input
                                        ref={el => inputRefs.current[key] = el}
                                        type="text"
                                        maxLength={1}
                                        value={userValue}
                                        onChange={() => { }} // Handled by onKeyDown
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                        className={`
                                            w-full h-full text-center font-bold text-sm sm:text-lg uppercase
                                            bg-transparent outline-none cursor-pointer p-0
                                            ${isSelected ? 'text-white' : 'text-gray-900'}
                                        `}
                                        aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}`}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
