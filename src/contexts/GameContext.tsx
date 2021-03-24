import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

import { countNeighbors, createBoard } from "@utils/board";

interface IGameConfigurations {
  width: number;
  heigth: number;

  totalBombs: number;
}

interface IBoardCell {
  isRevealed: boolean;
  neighborsCount: number;
  
  isFlagged?: boolean;
  isBomb?: boolean;
}

interface GameContextData {
  configurations: IGameConfigurations,
  boardCells: IBoardCell[],
  isGameRunning: boolean;

  init: () => void;
  setBoardCells: Dispatch<SetStateAction<IBoardCell[]>>;
  remainingBombsCount: () => number;
  remainingFlagsCount: () => number;
  start: () => void;
  finish: () => void;
  reset: () => void;
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameContext = createContext({} as GameContextData);

export function GameProvider({ children }: GameProviderProps) {
  const [configurations, setConfigurations] = useState<IGameConfigurations>({
    width: 10,
    heigth: 10,
    totalBombs: 15,
  });
  const [boardCells, setBoardCells] = useState<IBoardCell[]>(undefined);
  const [isGameRunning, setIsGameRunning] = useState(false);

  function init() {
    let board = createBoard(configurations.width, configurations.heigth, configurations.totalBombs);
    board = countNeighbors(board, configurations); 
    setBoardCells(board);
  }

  function start() {
    setIsGameRunning(true);
  }

  function finish() {
    setIsGameRunning(false);
  }

  function reset() {
    finish();
    init();
  }

  function remainingBombsCount() {
    const board: IBoardCell[] = JSON.parse(JSON.stringify(boardCells));
    const remainingBombs = board.filter(cell => cell.isBomb && !cell.isFlagged);

    return remainingBombs.length
  }

  function remainingFlagsCount() {
    const board: IBoardCell[] = JSON.parse(JSON.stringify(boardCells));
    const remainingFlags = board.filter(cell => cell.isFlagged);

    return configurations.totalBombs - remainingFlags.length
  }

  return (
    <GameContext.Provider value={{
      configurations,
      boardCells,
      isGameRunning,
      init,
      setBoardCells,
      remainingBombsCount,
      remainingFlagsCount,
      start,
      finish,
      reset,
    }}>
      { children }
    </GameContext.Provider>
  )
}