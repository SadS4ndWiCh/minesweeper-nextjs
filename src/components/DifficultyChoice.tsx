import { ChangeEvent, useContext, useRef } from 'react';

import { GameContext } from '@contexts/GameContext';

import styles from '@styles/components/DifficultyChoice.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';

export function DifficultyChoice() {
  const { changeDifficulty, configurations } = useContext(GameContext);
  const selectInputRef = useRef<HTMLSelectElement>();

  function handleChangeDifficulty() {
    changeDifficulty(selectInputRef.current.value as Difficulty);
  }

  return (
    <div className={`${styles.difficultyChoiceContainer} neu-pressed`}>
      <select
        ref={selectInputRef}

        name="difficulties"
        id="difficulties"
        defaultValue={configurations.difficulty}
        
        onChange={handleChangeDifficulty}
      >
        <option value="easy">Fácil</option>
        <option value="medium">Médio</option>
        <option value="hard">Difícil</option>
      </select>
    </div>
  )
}