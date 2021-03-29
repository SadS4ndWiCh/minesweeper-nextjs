import { useContext, useEffect, useState } from 'react';

import { GameContext } from '@contexts/GameContext';

import styles from '@styles/components/RemainingFlags.module.css';

interface IBoardCell {
  isRevealed: boolean;
  neighborsCount: number;
  isFlagged: boolean;
  isBomb: boolean;
}

interface RemainingFlagsProps {
  board: IBoardCell[];
}

export function RemainingFlags({ board }: RemainingFlagsProps) {
  const { configurations } = useContext(GameContext);
  const [remainingFlags, setRemainingFlags] = useState(configurations.totalBombs);

  useEffect(() => {
    if(board) {
      const totalFlags = board.reduce((total, currentCell) => currentCell.isFlagged ? total + 1 : total, 0);
  
      setRemainingFlags(configurations.totalBombs - totalFlags);
    }

  }, [board]);

  return (
    <div className={`${styles.remainingFlagsContainer} neu-flat`}>
      🚩 { remainingFlags }
    </div>
  )
}