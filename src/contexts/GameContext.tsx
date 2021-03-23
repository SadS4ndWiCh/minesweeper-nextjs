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

  init: () => void;
  setBoardCells: Dispatch<SetStateAction<IBoardCell[]>>;
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

  function init() {
    let board = createBoard(configurations.width, configurations.heigth, configurations.totalBombs);
    board = countNeighbors(board, configurations); 
    setBoardCells(board);
  }

  return (
    <GameContext.Provider value={{
      configurations,
      boardCells,
      init,
      setBoardCells
    }}>
      { children }
    </GameContext.Provider>
  )
}