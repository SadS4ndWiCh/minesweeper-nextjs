import { useContext, useRef } from 'react';

import { GameContext } from '@contexts/GameContext';

import { ACTIONS } from '@utils/game';

import styles from '@styles/components/DifficultyChoice.module.css';

export function DifficultyChoice() {
  const { gameState, gameDispatch } = useContext(GameContext);
  const selectInputRef = useRef<HTMLSelectElement>();

  function handleChangeDifficulty() {
    gameDispatch({
      type: ACTIONS.CHANGE_DIFFICULTY,
      payload: { difficulty: selectInputRef.current.value }
    });
  }

  return (
    <div className={`${styles.difficultyChoiceContainer} neu-pressed`}>
      <select
        ref={selectInputRef}

        name="difficulties"
        id="difficulties"
        defaultValue={gameState.configurations.difficulty}
        
        onChange={handleChangeDifficulty}
      >
        <option value="easy">Fácil</option>
        <option value="medium">Médio</option>
        <option value="hard">Difícil</option>
      </select>
    </div>
  )
}