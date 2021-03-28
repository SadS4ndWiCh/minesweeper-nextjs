import { shuffle } from "./suffle";

interface IBoardCell {
  isRevealed: boolean;
  neighborsCount: number;
  isFlagged: boolean;
  isBomb: boolean;
}

// Cria o quadro
export function createBoard(width: number, heigth: number, totalBombs: number): IBoardCell[] {
  // Cria todos os elementos não bomba
  const emptyCells = Array((width * heigth) - totalBombs)
  .fill({ isRevealed: false, isFlagged: false, isBomb: false, neighborsCount: 0 });
  
  // Cria todos os elementos bomba
  const bombCells = Array(totalBombs)
    .fill({ isRevealed: false, isFlagged: false, isBomb: true, neighborsCount: 0 });

  // Junta os dois para criar o campo em si
  let board: IBoardCell[] = [...emptyCells, ...bombCells];

  // Embaralha todos elementos
  board = shuffle(board);

  return board
}

// Faz uma cópia do quadro
export function deepCopyBoard(board: IBoardCell[]): IBoardCell[] {
  return JSON.parse(JSON.stringify(board))
}