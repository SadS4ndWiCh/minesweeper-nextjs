import {
  IGameState,
  IRevealPayload,
  IToggleFlagPayload,
  IChangeDifficultyPayload,
  IFinishPayload,
  IChangeTimerStatePayload,
} from './interfaces';

import { difficulties } from '../config';

import {
  createBoard,
  countNeighbors,
  deepCopyBoard,
  isIndexValid,
  getNeighbors,
  isClear,
} from './board';

export const ACTIONS = {
  REVEAL: 'reveal',
  TOGGLE_FLAG: 'toggleFlag',
  FINISH: 'finish',
  RESET: 'reset',
  CHANGE_DIFFICULTY: 'changeDifficulty',
  GENERATE_BOARD: 'generateBoard',
  CHANGE_TIMER_STATE: 'changeTimerState',
}

export const Events = {
  reveal(gameState: IGameState, { cellIndex }: IRevealPayload) {
    let newBoard = deepCopyBoard(gameState.board);

    // Caso o index for inválido, já retornará
    if(!isIndexValid(gameState.configurations, cellIndex) || newBoard[cellIndex].isFlagged) return gameState;

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
        return Events.finish({
          ...gameState,
          isTimerActive: false,
          board: newBoard
        }, { hasWon: false })
        
      } else if(newBoard[currentCellIndex].neighborsCount === 0) {
        // Caso o elemento atual não tiver vizinhos, então poderá revelar em volta
        
        const neighbors = getNeighbors(gameState.configurations, currentCellIndex);
        // Irá revelar cada elemento que não estiver revelado ainda
        neighbors.forEach(neighborIndex => !newBoard[neighborIndex].isRevealed && toReveal.push(neighborIndex));
      }
    }
    
    const newGameState = { ...gameState, board: newBoard };

    if(isClear(gameState)) {
      return Events.finish({
        ...newGameState,
        isTimerActive: false,
      }, { hasWon: true });
    }
    
    // Assim que todos estiverem revelados todos os que devem ser revelados,
    // o quadro será atualizado com esse novo estado
    return newGameState
  },

  toggleFlag(gameState: IGameState, { cellIndex }: IToggleFlagPayload) {
    const newBoard = deepCopyBoard(gameState.board);

    if(!isIndexValid(gameState.configurations, cellIndex) || newBoard[cellIndex].isRevealed)
      return gameState

    newBoard[cellIndex].isFlagged = !newBoard[cellIndex].isFlagged;

    const totalFlagged = gameState.totalFlagged + (newBoard[cellIndex].isFlagged ? 1 : -1);

    return {
      ...gameState,
      board: newBoard,
      totalFlagged
    }

  },

  finish(gameState: IGameState, { hasWon }: IFinishPayload) {
    if(hasWon) {
      return {
        ...gameState,
        hasClear: true,
        isGameOver: false,
      }
    }

    return {
      ...gameState,
      hasClear: false,
      isGameOver: true,
    }
  },

  reset(gameState: IGameState) {
    return Events.generateBoard({
      ...gameState,
      hasClear: undefined,
      isGameOver: undefined,
      totalFlagged: 0,
    })
  },

  changeDifficulty(gameState: IGameState, { difficulty }: IChangeDifficultyPayload) {
    const newConfigurations = {
      width: difficulties[difficulty].width,
      height: difficulties[difficulty].height,
      totalBombs: difficulties[difficulty].totalBombs,
      difficulty
    }

    const newGameState = { ...gameState, configurations: newConfigurations };

    return Events.generateBoard(newGameState as IGameState);
  },

  generateBoard(gameState: IGameState) {
    const newBoard = createBoard(
      gameState.configurations.width,
      gameState.configurations.height,
      gameState.configurations.totalBombs
    );
    
    const board = countNeighbors({ ...gameState, board: newBoard, configurations: gameState.configurations });

    return {
      ...gameState,
      board
    }
  },

  changeTimerState(gameState: IGameState, { timerState }: IChangeTimerStatePayload) {
    return {
      ...gameState,
      isTimerActive: timerState,
    }
  },
}

export const initialGameState = {
  board: [],

  configurations: {
    width: difficulties.easy.width,
    height: difficulties.easy.height,
    totalBombs: difficulties.easy.totalBombs,
    difficulty: 'easy'
  },

  isGameOver: undefined,
  hasClear: undefined,

  isTimerActive: false,

  totalFlagged: 0,
}

export function gameReducer(gameState, action) {
  switch(action.type) {
    case ACTIONS.REVEAL: return Events.reveal(gameState, action.payload);
    case ACTIONS.TOGGLE_FLAG: return Events.toggleFlag(gameState, action.payload);
    case ACTIONS.GENERATE_BOARD: return Events.generateBoard(gameState);
    case ACTIONS.CHANGE_DIFFICULTY: return Events.changeDifficulty(gameState, action.payload);
    case ACTIONS.RESET: return Events.reset(gameState);
    case ACTIONS.CHANGE_TIMER_STATE: return Events.changeTimerState(gameState, action.payload);

    default: return gameState
  }
}