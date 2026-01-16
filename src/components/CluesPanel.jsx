import React from 'react';

export default function CluesPanel({ clues, selectedClue, onSelectClue, showAnswers = false }) {
    const renderClueList = (clueList, direction) => (
        <div className="space-y-2">
            <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide border-b border-white/10 pb-1">
                {direction}
            </h3>
            <ul className="space-y-0.5">
                {clueList.map((clue) => {
                    const isSelected = selectedClue?.number === clue.number && selectedClue?.direction === direction;
                    return (
                        <li
                            key={`${direction}-${clue.number}`}
                            onClick={() => onSelectClue({ ...clue, direction })}
                            className={`
                                cursor-pointer px-2 py-1 rounded transition-all text-sm
                                ${isSelected
                                    ? 'bg-primary-500/50 text-white'
                                    : 'text-primary-100/70 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            <div className="leading-snug">
                                <span className="font-bold mr-1.5 text-white/90">{clue.number}.</span>
                                {clue.clue}
                            </div>
                            {showAnswers && clue.answer && (
                                <div className="mt-0.5 text-amber-300 text-xs font-mono tracking-wider pl-4">
                                    → {clue.answer}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {renderClueList(clues.across, 'across')}
            {renderClueList(clues.down, 'down')}
        </div>
    );
}
