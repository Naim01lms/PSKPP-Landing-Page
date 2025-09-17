import React, { memo } from 'react';
import type { Round, Match as MatchType, Participant } from '../types';
import CrownIcon from './icons/CrownIcon';

interface TournamentBracketProps {
  data: Round[];
}

const ParticipantRow: React.FC<{ participant: Participant; isWinner: boolean; hasBorder: boolean }> = memo(({ participant, isWinner, hasBorder }) => (
    <div className={`
      flex justify-between items-center text-sm py-1.5 px-2.5 rounded-sm transition-colors duration-200
      ${isWinner ? 'bg-secondary/20' : ''}
      ${hasBorder ? 'border-b border-gray-300' : ''}
    `}>
      <span className={`flex items-center gap-2 truncate ${isWinner ? 'font-bold text-primary' : 'text-gray-700'}`}>
        {isWinner && <CrownIcon />}
        <span className="truncate">{participant.name}</span>
      </span>
      <span className={`flex-shrink-0 ml-2 px-2 py-0.5 rounded text-xs font-bold ${isWinner ? 'bg-secondary text-primary' : 'bg-light text-gray-600'}`}>
        {participant.score ?? '-'}
      </span>
    </div>
));


const Match: React.FC<{ match: MatchType }> = memo(({ match }) => {
  const [p1, p2] = match.participants;
  const p1Wins = p1.score !== undefined && p2.score !== undefined && p1.score > p2.score;
  const p2Wins = p2.score !== undefined && p1.score !== undefined && p2.score > p1.score;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-1 w-52 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <ParticipantRow participant={p1} isWinner={p1Wins} hasBorder={true} />
      <ParticipantRow participant={p2} isWinner={p2Wins} hasBorder={false} />
    </div>
  );
});

const TournamentBracket: React.FC<TournamentBracketProps> = ({ data = [] }) => {
  if (!data.length) return null;

  // Constants for layout calculation (in pixels)
  const MATCH_HEIGHT = 70; // Approximate height of a Match card
  const BASE_VERTICAL_GAP = 32; // Vertical gap between matches in the first round
  const CONNECTOR_WIDTH = 40; // Horizontal length of connector lines
  const ROUND_GAP = CONNECTOR_WIDTH * 2; // Horizontal gap between rounds

  let previousRoundGap = 0;

  return (
    <div className="overflow-x-auto pb-4 -mb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-light scrollbar-thumb-rounded-full">
      <div className="flex items-start min-w-max px-4 py-4" style={{ gap: `${ROUND_GAP}px` }}>
        {data.map((round, roundIndex) => {
          const isFirstRound = roundIndex === 0;
          const isLastRound = roundIndex === data.length - 1;

          const currentRoundGap = isFirstRound
            ? BASE_VERTICAL_GAP
            : (previousRoundGap * 2) + MATCH_HEIGHT;

          const firstMatchMarginTop = isFirstRound
            ? 0
            : (previousRoundGap + MATCH_HEIGHT) / 2;

          previousRoundGap = currentRoundGap;

          return (
            <div key={roundIndex} className="flex flex-col">
              <h4 className="text-center font-bold text-primary mb-6 whitespace-nowrap">{round.title}</h4>
              <div>
                {round.matches.map((match, matchIndex) => (
                  <div
                    key={matchIndex}
                    className="relative"
                    style={{
                      marginTop: matchIndex === 0 ? `${firstMatchMarginTop}px` : `${currentRoundGap}px`,
                    }}
                  >
                    <Match match={match} />
                    
                    {/* Connectors */}
                    {!isLastRound && (
                      <>
                        {/* Horizontal line from match to vertical connector */}
                        <div
                          className="absolute top-1/2 left-full h-[2px] bg-gray-400"
                          style={{ width: `${CONNECTOR_WIDTH}px`, transform: 'translateY(-1px)' }}
                          aria-hidden="true"
                        />
                        
                        {/* Vertical and outgoing horizontal lines for top match of a pair */}
                        {matchIndex % 2 === 0 && (
                          <>
                            {/* Vertical line */}
                            <div
                              className="absolute top-1/2 w-[2px] bg-gray-400"
                              style={{
                                left: `calc(100% + ${CONNECTOR_WIDTH}px)`,
                                height: `${MATCH_HEIGHT + currentRoundGap}px`,
                                transform: 'translateX(-1px)'
                              }}
                              aria-hidden="true"
                            />
                            {/* Horizontal line to next round */}
                            <div
                              className="absolute h-[2px] bg-gray-400"
                              style={{
                                left: `calc(100% + ${CONNECTOR_WIDTH}px)`,
                                top: `calc(50% + ${(MATCH_HEIGHT + currentRoundGap) / 2}px)`,
                                width: `${CONNECTOR_WIDTH}px`,
                                transform: 'translateY(-1px)'
                              }}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(TournamentBracket);