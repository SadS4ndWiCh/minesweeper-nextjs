export type Difficulty = 'easy' | 'medium' | 'hard'; 

export interface IBoardCell {
  isRevealed: boolean;
  neighborsCount: number;
  isFlagged: boolean;
  isBomb: boolean;
}

export interface IGameConfigurations {
  width: number;
  height: number;
  totalBombs: number;
  difficulty: Difficulty;
}

/* Game actions */

export interface IGameState {
  board: IBoardCell[];
  configurations: IGameConfigurations;

  isGameOver: boolean;
  hasClear: boolean;
  isTimerActive: boolean;

  totalFlagged: number;
}

export interface IAction {
  payload: {
    cellIndex?: number;
    difficulty?: string;
  }
  type: string;
}

export interface IRevealPayload {
  cellIndex: number;
}

export interface IToggleFlagPayload {
  cellIndex: number;
}

export interface IChangeDifficultyPayload {
  difficulty: string;
}

export interface IFinishPayload {
  hasWon: boolean;
}

export interface IChangeTimerStatePayload {
  timerState: boolean;
}