import { MouseEvent, useContext, useEffect, useState } from 'react';

import { BoardCell } from './BoardCell';
import { RemainingFlags } from './RemainingFlags';
import { Timer } from './Timer';
import { EmojiButton } from './EmojiButton';

import { GameContext } from '@contexts/GameContext';
import { TimerContext } from '@contexts/TimerContext';

import { createBoard, deepCopyBoard } from '@utils/board';

import styles from '@styles/components/Board.module.css';
import { DifficultyChoice } from './DifficultyChoice';

interface IBoardCell {
  isRevealed: boolean;
  neighborsCount: number;
  isFlagged: boolean;
  isBomb: boolean;
}

export function Board() {
  const { configurations, isGameOver, isClear, finish } = useContext(GameContext);
  const { startTimer, stopTimer, resetTimer, isActive } = useContext(TimerContext);
  const { resetGame } = useContext(GameContext);

  const [board, setBoard] = useState<IBoardCell[]>(undefined);

  // Por ter usado uma array de uma dimensão, tenho que fazer
  // essa lista para ser mais fácil pegar os elementos vizinhos
  const neighborsPositions = [
    -configurations.width - 1, // 0 - Top Left
    -configurations.width,     // 1 - Top
    -configurations.width + 1, // 2 - Top Right
    -1,                        // 3 - Left
    1,                         // 4 - Right
    configurations.width - 1,  // 5 - Bottom Left
    configurations.width,      // 6 - Bottom
    configurations.width + 1,  // 7 - Bottom Right
  ]

  // Cria o quadro quando o componente é montado
  // com as configurações que possúi
  useEffect(() => {
    if(!board) _setBoardWithConfigurations();
  }, []);

  // Cria outro quadro quando as configurações mudam
  useEffect(() => {
    if(board) {
      _handleReset();
    }
  }, [configurations])

  // Cria um novo quadro com as configurações definidas e já
  // atualiza o estado do quadro
  function _setBoardWithConfigurations() {
    let newBoard = createBoard(configurations.width, configurations.height, configurations.totalBombs);
    newBoard = _countNeighbors(newBoard);

    setBoard(newBoard);
  }

  // Reseta o jogo
  function _handleReset() {
    stopTimer();
    resetTimer();
    resetGame();
    _setBoardWithConfigurations();
  }

  // Checa se o Index no quadro é válido
  function _isIndexValid(index: number) {
    return (index >= 0 && index < configurations.width * configurations.height)
  }

  // Conta a quantidade de vizinhos bomba que cada elemente tem
  function _countNeighbors(newBoard: IBoardCell[]) {
    // Faz uma cópia do quadro
    const copyBoard = deepCopyBoard(newBoard);

    // Passa por cada elemento no quadro
    copyBoard.forEach((cell: IBoardCell, cellIndex: number) => {
      // Se o elemento atual for uma bomba, pode retornar
      if(cell.isBomb) return
      
      // Pega todos os vizinhos do elemento atual
      const neighbors = _getNeighbors(cellIndex);
      let totalNeighbors = 0;
      neighbors.forEach(neighborIndex => {
        if(copyBoard[neighborIndex].isBomb) totalNeighbors++;
      });

      // Por fim define o total de vizinhos bombas que o elemento atual possúi
      copyBoard[cellIndex].neighborsCount = totalNeighbors;
    });

    return copyBoard
  }

  // Retorna os vizinhos de um elemento
  function _getNeighbors(cellIndex: number) {
    const isCellLeft = (cellIndex % configurations.width) === 0;
    const isCellRight = (cellIndex % configurations.width) === (configurations.width - 1);

    let neighbors: number[] = [];

    neighborsPositions.forEach((position, i) => {
      if(
        isCellLeft && (i === 0 || i === 3 || i === 5) ||
        isCellRight && (i === 2 || i === 4 || i === 7)
      ) return

      const targetIndex = cellIndex + position;
      if(!_isIndexValid(targetIndex)) return

      neighbors.push(targetIndex);
    });

    return neighbors
  }

  // Faz a cópia do quadro
  function _boardCopy() {
    return deepCopyBoard(board);
  }

  // Revela o elemento
  function revealCell(cellIndex: number) {
    // Se o contador não estiver ativo, iniciará
    if(!isActive) startTimer();

    let newBoard = _boardCopy();

    // Caso o index for inválido, já retornará
    if(!_isIndexValid(cellIndex) || newBoard[cellIndex].isFlagged) return;

    const toReveal: number[] = [cellIndex];

    // Em vez de usar um método recursivo para revelar cada elemento,
    // cada elemento que for ser revelado será guardado o Index na lista.
    // Para cada iteração do While, vai revelar o elemento e caso for 
    // um elemento sem vizinhos, será adicionado os vizinhos na lista para
    // serem revelados e fazer esse mesmo fluxo
    while(toReveal.length > 0) {
      // Pega o primeiro elemento
      const currentCellIndex = toReveal.shift();
      
      // Revela o elemento atual
      newBoard[currentCellIndex].isRevealed = true;

      // Se o elemento atual for uma bomba, o contador irá parar
      if(newBoard[currentCellIndex].isBomb) {
        finish(false);
        stopTimer();
        
      } else if(newBoard[currentCellIndex].neighborsCount === 0) {
        // Caso o elemento atual não tiver vizinhos, então poderá revelar em volta
        
        const neighbors = _getNeighbors(currentCellIndex);
        // Irá revelar cada elemento que não estiver revelado ainda
        neighbors.forEach(neighborIndex => !newBoard[neighborIndex].isRevealed && toReveal.push(neighborIndex));
      }
    }
    
    if(isClear(newBoard)) {
      stopTimer();
      finish(true);
      
    }
    
    // Assim que todos estiverem revelados todos os que devem ser revelados,
    // o quadro será atualizado com esse novo estado
    setBoard(newBoard);

  }

  // Alterna entre 
  function toggleFlag(e: MouseEvent, cellIndex: number) {
    // Previnir que apareça o menu quando clica com o Direito
    e.preventDefault();

    const newBoard = _boardCopy();

    if(!_isIndexValid(cellIndex) || newBoard[cellIndex].isRevealed) return

    // Alterna entre Sinalizado ( Com Bandeira ) e Não Sinalizado ( Sem Bandeira ) 
    newBoard[cellIndex].isFlagged = !newBoard[cellIndex].isFlagged;

    setBoard(newBoard);
  }

  return (
    <div className={styles.boardContainer}>
      <header>
        <div>
          <RemainingFlags board={board} /> 
          <EmojiButton handleReset={_handleReset} />
          <Timer />
        </div>

        <DifficultyChoice />

        <h2>
          { isGameOver !== undefined && isGameOver && 'Você perdeu!' }
          { isGameOver !== undefined && !isGameOver && 'Você venceu!' }
        </h2>
      </header>

      <main style={{
        gridTemplateColumns: `repeat(${configurations.width}, 2em)`,
        gap: '10px'
      }}>
        { !board  && <h1>Loading...</h1>}

        { board && board.map((cell, i) => (
          <BoardCell
            key={i}
            isRevealed={(isGameOver !== undefined && isGameOver === true && cell.isBomb && !cell.isFlagged) || cell.isRevealed}
            isBomb={cell.isBomb}
            isFlagged={cell.isFlagged}
            neighborsCount={cell.neighborsCount}

            cellIndex={i}

            onClick={() => revealCell(i)}
            onRightClick={(e) => toggleFlag(e, i)}
            disabled={isGameOver !== undefined}
          />
        )) }
      </main>
    </div>
  )
}