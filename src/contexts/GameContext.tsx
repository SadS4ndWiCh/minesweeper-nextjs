import { createContext, Dispatch, ReactNode, useReducer } from "react";

import { gameReducer, initialGameState } from '../utils/game';
import { IGameState } from '../utils/interfaces';

interface GameProviderProps {
  children: ReactNode;
}

interface GameContextData {
  gameState: IGameState;

  gameDispatch: Dispatch<any>;
}

export const GameContext = createContext({} as GameContextData);

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState);
  
  return (
    <GameContext.Provider value={{
      gameState,
  
      gameDispatch
    }}>
      { children }
    </GameContext.Provider>
  )
}