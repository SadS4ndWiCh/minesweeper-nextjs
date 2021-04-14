import { useContext } from 'react';

import { GameContext } from '@contexts/GameContext';

import styles from '@styles/components/RemainingFlags.module.css';

export function RemainingFlags() {
  const { gameState } = useContext(GameContext);

  const remainingFlags = gameState.configurations.totalBombs - gameState.totalFlagged;

  return (
    <div className={`${styles.remainingFlagsContainer} neu-flat`}>
      🚩 { remainingFlags }
    </div>
  )
}