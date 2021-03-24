import { useContext, useEffect, useState } from 'react';

import { GameContext } from '@contexts/GameContext';

import styles from '@styles/components/RemainingFlags.module.css';

export function RemainingFlags() {
  const { boardCells, configurations, remainingFlagsCount } = useContext(GameContext);
  
  const [remainingFlags, setRemainingFlags] = useState(configurations.totalBombs);

  useEffect(() => {
    if(boardCells) setRemainingFlags(remainingFlagsCount());
  }, [boardCells])

  return (
    <div className={`${styles.remainingFlagsContainer} neu-flat`}>
      🚩 { remainingFlags }
    </div>
  )
}