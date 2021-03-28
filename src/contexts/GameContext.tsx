import { createContext, ReactNode, useState } from "react";

import { difficulties } from '../config';

type Difficulty = 'easy' | 'medium' | 'hard'; 

interface IGameConfigurations {
  width: number;
  height: number;
  totalBombs: number;
  difficulty: Difficulty;
}

interface IBoardCell {
  isRevealed: boolean;
  neighborsCount: number;
  isFlagged: boolean;
  isBomb: boolean;
}

interface GameProviderProps {
  children: ReactNode;
}

interface GameContextData {
  configurations: IGameConfigurations,
  isGameOver: boolean;
  hasClear: boolean;

  changeDifficulty: (difficulty: Difficulty) => void;
  isClear: (board: IBoardCell[]) => boolean;
  finish: (hasWon: boolean) => void;
  resetGame: () => void;
}

export const GameContext = createContext({} as GameContextData);

export function GameProvider({ children }: GameProviderProps) {
  const [configurations, setConfigurations] = useState<IGameConfigurations>({
    width: difficulties.easy.width,
    height: difficulties.easy.height,
    totalBombs: difficulties.easy.totalBombs,
    difficulty: 'easy'
  });
  const [isGameOver, setIsGameOver] = useState(undefined);
  const [hasClear, setHasClear] = useState(undefined);

  // Mudar a dificuldade do jogo
  function changeDifficulty(difficulty: Difficulty) {
    const newConfigurations: IGameConfigurations = {
      width: difficulties[difficulty].width,
      height: difficulties[difficulty].height,
      totalBombs: difficulties[difficulty].totalBombs,
      difficulty,
    };

    setConfigurations(newConfigurations);
  }

  // Checar se ganhou o jogo
  function isClear(board: IBoardCell[]) {
    // Ganhar o jogo seria revelar todos os elementos exeto os que contém bomba,
    // ou seja, para checar se já ganhou ou não, é ver se a quantidade de 
    // elementos revelados é igual a quantidade de bombas, pois assim, apenas
    // as bombas que terão sobrado
    let totalClear = board.reduce((total, curr) => curr.isRevealed ? total + 1 : total, 0);

    return totalClear === ( configurations.width * configurations.height - configurations.totalBombs )
  }

  // Define se venceu ou não
  function finish(hasWon: boolean) {
    if(hasWon) {
      setHasClear(true);
      setIsGameOver(false);
    } else {
      setHasClear(false);
      setIsGameOver(true);
    }
  }

  // Reseta o jogo
  function resetGame() {
    setHasClear(undefined);
    setIsGameOver(undefined);
  }

  return (
    <GameContext.Provider value={{
      configurations,
      isGameOver,
      hasClear,
      
      changeDifficulty,
      isClear,
      finish,
      resetGame,
    }}>
      { children }
    </GameContext.Provider>
  )
}