import { shuffle } from "./suffle";

import { IBoardCell, IGameState, IGameConfigurations } from '@utils/interfaces';

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

// Conta a quantidade de vizinhos bomba que cada elemente tem
export function countNeighbors({ board, configurations }: IGameState) {
  // Faz uma cópia do quadro
  const copyBoard = deepCopyBoard(board);

  // Passa por cada elemento no quadro
  copyBoard.forEach((cell: IBoardCell, cellIndex: number) => {
    // Se o elemento atual for uma bomba, pode retornar
    if(cell.isBomb) return
    
    // Pega todos os vizinhos do elemento atual
    const neighbors = getNeighbors(configurations, cellIndex);
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
export function getNeighbors(configurations: IGameConfigurations, cellIndex: number) {
  const isCellLeft = (cellIndex % configurations.width) === 0;
  const isCellRight = (cellIndex % configurations.width) === (configurations.width - 1);

  let neighbors: number[] = [];
  // Por ter usado uma array de uma dimensão, tenho que fazer
  // essa lista para ser mais fácil pegar os elementos vizinhos
  const neighborsPositions = [
    -configurations.width - 1, // 0 - Top Left
    -configurations.width,     // 1 - Top
    -configurations.width + 1, // 2 - Top Right
    -1,                                  // 3 - Left
    1,                                   // 4 - Right
    configurations.width - 1,  // 5 - Bottom Left
    configurations.width,      // 6 - Bottom
    configurations.width + 1,  // 7 - Bottom Right
  ]

  neighborsPositions.forEach((position, i) => {
    if(
      isCellLeft && (i === 0 || i === 3 || i === 5) ||
      isCellRight && (i === 2 || i === 4 || i === 7)
    ) return

    const targetIndex = cellIndex + position;
    if(!isIndexValid(configurations, targetIndex)) return

    neighbors.push(targetIndex);
  });

  return neighbors
}

// Checa se o Index no quadro é válido
export function isIndexValid(configurations: IGameConfigurations, index: number) {
  return (index >= 0 && index < configurations.width * configurations.height)
}


// Faz uma cópia do quadro
export function deepCopyBoard(board: IBoardCell[]): IBoardCell[] {
  return JSON.parse(JSON.stringify(board))
}

// Checar se ganhou o jogo
export function isClear({ board, configurations }: IGameState) {
  // Ganhar o jogo seria revelar todos os elementos exeto os que contém bomba,
  // ou seja, para checar se já ganhou ou não, é ver se a quantidade de 
  // elementos revelados é igual a quantidade de bombas, pois assim, apenas
  // as bombas que terão sobrado
  let totalClear = board.reduce((total, curr) => curr.isRevealed ? total + 1 : total, 1);

  console.log(totalClear);
  
  return totalClear === ( configurations.width * configurations.height - configurations.totalBombs )
}