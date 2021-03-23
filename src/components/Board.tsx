import { useContext, useEffect } from 'react';

import { BoardCell } from './BoardCell';

import { GameContext } from '@contexts/GameContext';

import { countNeighbors, createBoard, flagCellByIndex, revealCellByIndex } from '@utils/board';

import styles from '@styles/components/Board.module.css';

export function Board() {
  const {
    configurations,
    boardCells,
    init,
    setBoardCells
  } = useContext(GameContext);

  useEffect(() => {
    init();
  }, []);

  function revealCell(cellIndex: number) {
    const newBoard = revealCellByIndex(boardCells, cellIndex, configurations);
    setBoardCells(newBoard);
  }

  function flagCell(e: MouseEvent, cellIndex: number) {
    e.preventDefault();

    const newBoard = flagCellByIndex(boardCells, cellIndex);
    setBoardCells(newBoard);
  }

  return (
    <div className={styles.boardContainer}>
      <header>
        <div>
          <span>010</span>
        </div>
        <button>Reset</button>
        <div>
          <span>052</span>
        </div>
      </header>

      <main>
        { !boardCells  && <h1>Loading...</h1>}

        { boardCells && boardCells.map((cell, i) => (
          <BoardCell
            key={i}
            isRevealed={cell.isRevealed}
            isBomb={cell.isBomb}
            isFlagged={cell.isFlagged}
            neighborsCount={cell.neighborsCount}

            cellIndex={i}

            onClick={() => revealCell(i)}
            onRightClick={flagCell}
          />
        )) }
      </main>
      <style jsx>{
        `
          main {
            grid-template-columns: repeat(${configurations.width}, 50px);
            gap: 10px;
          }
        `
      }</style>
    </div>
  )
}