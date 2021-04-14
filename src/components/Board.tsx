import { MouseEvent, useContext, useEffect } from 'react';

import { BoardCell } from './BoardCell';
import { RemainingFlags } from './RemainingFlags';
import { Timer } from './Timer';
import { EmojiButton } from './EmojiButton';

import { GameContext } from '@contexts/GameContext';
import { TimerContext } from '@contexts/TimerContext';

import { ACTIONS } from '@utils/game';

import styles from '@styles/components/Board.module.css';
import { DifficultyChoice } from './DifficultyChoice';

export function Board() {
  const { gameState, gameDispatch } = useContext(GameContext);
  const { startTimer, stopTimer, resetTimer } = useContext(TimerContext);

  // Cria o quadro quando o componente é montado
  // com as configurações que possúi
  useEffect(() => {
    if(gameState.board.length === 0) {
      gameDispatch({ type: ACTIONS.GENERATE_BOARD });
    }
  }, []);

  // Reseta o jogo
  function handleReset() {
    stopTimer();
    resetTimer();

    gameDispatch({ type: ACTIONS.RESET });
  }

  // Revela o elemento
  function revealCell(cellIndex: number) {
    // Se o contador não estiver ativo, iniciará
    if(!gameState.isTimerActive) startTimer();

    gameDispatch({ type: ACTIONS.REVEAL, payload: { cellIndex } });
  }

  // Alterna entre 
  function toggleFlag(e: MouseEvent, cellIndex: number) {
    // Previnir que apareça o menu quando clica com o Direito
    e.preventDefault();

    gameDispatch({ type: ACTIONS.TOGGLE_FLAG, payload: { cellIndex } });
  }

  return (
    <div className={styles.boardContainer}>
      <header>
        <div>
          <RemainingFlags /> 
          <EmojiButton handleReset={() => handleReset()} />
          <Timer />
        </div>

        <DifficultyChoice />

        <h2>
          { gameState.isGameOver !== undefined && gameState.isGameOver && 'Você perdeu!' }
          { gameState.isGameOver !== undefined && !gameState.isGameOver && 'Você venceu!' }
        </h2>
      </header>

      <main style={{
        gridTemplateColumns: `repeat(${gameState.configurations.width}, 2em)`,
        gap: '10px'
      }}>
        { !gameState.board  && <h1>Loading...</h1>}

        { gameState.board && gameState.board.map((cell, i) => (
          <BoardCell
            key={i}
            isRevealed={(gameState.isGameOver !== undefined && gameState.isGameOver === true && cell.isBomb && !cell.isFlagged) || cell.isRevealed}
            isBomb={cell.isBomb}
            isFlagged={cell.isFlagged}
            neighborsCount={cell.neighborsCount}

            cellIndex={i}

            onClick={() => revealCell(i)}
            onRightClick={(e) => toggleFlag(e, i)}
            disabled={gameState.isGameOver !== undefined}
          />
        )) }
      </main>
    </div>
  )
}