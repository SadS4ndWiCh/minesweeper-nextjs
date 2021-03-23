import { shuffle } from "./suffle";

interface IBoardCell {
  isRevealed: boolean;
  neighborsCount: number;
  
  isFlagged?: boolean;
  isBomb?: boolean;
}

interface IGameConfigurations {
  width: number;
  heigth: number;

  totalBombs: number;
}

export function createBoard(width: number, heigth: number, totalBombs: number) {
  // Cria todos os elementos não bomba
  const emptyCells = Array((width * heigth) - totalBombs)
  .fill({ isRevealed: false, isFlagged: false, isBomb: false, neighborsCount: 0 });
  
  // Cria todos os elementos bomba
  const bombCells = Array(totalBombs)
    .fill({ isRevealed: false, isFlagged: false, isBomb: true, neighborsCount: 0 });

  // Junta os dois para criar o campo em si
  let board = emptyCells
    .concat(bombCells)

  // Embaralha todos elementos
  board = shuffle(board);

  return board
}

export function revealCellByIndex(board: IBoardCell[], cellIndex: number, configurations: IGameConfigurations) {
  let newBoard: IBoardCell[] = JSON.parse(JSON.stringify(board));
  if(newBoard[cellIndex].isRevealed) return board;

  let toReveal = [cellIndex];

  while(toReveal.length > 0) {
    const currentCellIndex = toReveal.pop();

    newBoard[currentCellIndex].isRevealed = true;
    
    if(newBoard[currentCellIndex].neighborsCount !== 0 || newBoard[currentCellIndex].isBomb) continue

    const neighborsIndexes = getNeighborsIndexFromCell(board, currentCellIndex, configurations);
    neighborsIndexes.forEach((neighborIndex) => {
      const currentCell = newBoard[neighborIndex];

      if(currentCell.isBomb || currentCell.isRevealed) return;

      toReveal.push(neighborIndex);
    });
  }

  return newBoard
}

export function countNeighbors(board: IBoardCell[], configurations: IGameConfigurations): IBoardCell[] {
  let newBoard: IBoardCell[] = JSON.parse(JSON.stringify(board));

  newBoard.forEach((cell, index) => {
    const neighbors = getNeighborsFromCellIndex(newBoard, index, configurations);

    let totalNeighbors = neighbors.reduce((total, curr) => {
      if(curr.isBomb) {
        return ++total;
      }
      return total
    }, 0);

    newBoard[index].neighborsCount = totalNeighbors;
  });

  return newBoard
}

export function floodFill(board: IBoardCell[], cellIndex: number, configurations: IGameConfigurations) {
  if(board[cellIndex].isBomb) return board

  const neighbors = getNeighborsFromCellIndex(board, cellIndex, configurations);

  let newBoard: IBoardCell[] = [];

  neighbors.forEach((cell, i) => {
    if(cell.isBomb || cell.isRevealed) return

    const targetIndex = board.indexOf(cell);

    newBoard = revealCellByIndex(board, targetIndex, configurations);
  });

  return newBoard
}

export function getNeighborsIndexFromCell(board: IBoardCell[], cellIndex: number, configurations: IGameConfigurations) {
  const positions = [
    -configurations.width + -1, // 0 Top Left
    -configurations.width, //      1 Top
    -configurations.width + 1, //  2 Top Right
    -1, //                         3 Left
    1, //                          4 Right
    configurations.width - 1, //   5 Bottom Left
    configurations.width, //       6 Bottom
    configurations.width + 1, //   7 Bottom Right
  ]

  let neighborsIndexes: number[] = [];

  positions.forEach((position, i) => {
    const neighborIndex = cellIndex + position;

    if(neighborIndex < 0 || neighborIndex >= (configurations.width * configurations.heigth)) return;

    // Vê se está em canto esquerdo
    const isLeftSide = (cellIndex % configurations.width) === 0;
    // Vê se está em canto direito
    const isRightSide = (cellIndex % configurations.width) === configurations.width - 1;

    if(
      // Checa se o elemento fica no canto esquerdo
      // e verifica se 'Position' não é 0, 5 e 3 
      isLeftSide && (i === 0 || i === 5 || i === 3) ||
      // Checa se o elemento fica no canto direito
      // e verifica se o 'Position' não é 2, 7 e 4
      isRightSide && (i === 2 || i === 7 || i === 4)) {
        return
    };
    
    neighborsIndexes.push(neighborIndex);
  });

  return neighborsIndexes
}

export function getNeighborsFromCellIndex(board: IBoardCell[], cellIndex: number, configurations: IGameConfigurations) {
  const positions = [
    -configurations.width + -1, // 0 Top Left
    -configurations.width, //      1 Top
    -configurations.width + 1, //  2 Top Right
    -1, //                         3 Left
    1, //                          4 Right
    configurations.width - 1, //   5 Bottom Left
    configurations.width, //       6 Bottom
    configurations.width + 1, //   7 Bottom Right
  ]

  // Calcular os vizinhos
  let neighbors: IBoardCell[] = [];
  
  positions.forEach((position, i) => {
    const neighborIndex = cellIndex + position;

    if(neighborIndex < 0 || neighborIndex >= (configurations.width * configurations.heigth)) return;

    // Atual elemento vizinho
    const neighborCell = board[neighborIndex];

    // Vê se está em canto esquerdo
    const isLeftSide = (cellIndex % configurations.width) === 0;
    // Vê se está em canto direito
    const isRightSide = (cellIndex % configurations.width) === configurations.width - 1;

    if(
      // Checa se o elemento fica no canto esquerdo
      // e verifica se 'Position' não é 0, 5 e 3 
      isLeftSide && (i === 0 || i === 5 || i === 3) ||
      // Checa se o elemento fica no canto direito
      // e verifica se o 'Position' não é 2, 7 e 4
      isRightSide && (i === 2 || i === 7 || i === 4)) {
        return
    };
    
    neighbors.push(neighborCell);
  });

  return neighbors
}

export function flagCellByIndex(board: IBoardCell[], cellIndex: number) {
  const newBoard: IBoardCell[] = JSON.parse(JSON.stringify(board));

  if(newBoard[cellIndex].isRevealed) return newBoard

  newBoard[cellIndex].isFlagged = !newBoard[cellIndex].isFlagged;

  return newBoard
}