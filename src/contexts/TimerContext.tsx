import { ACTIONS } from "@utils/game";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GameContext } from "./GameContext";

interface TimerContextData {
  timerCount: number;
  
  resetTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;

}

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerContext = createContext({} as TimerContextData);

let timerTimeout: NodeJS.Timeout;

export function TimerProvider({ children }: TimerProviderProps) {
  const { gameState, gameDispatch } = useContext(GameContext);

  const [timerCount, setTimerCount] = useState(0);

  function resetTimer() {
    clearTimeout(timerTimeout)
    setTimerCount(0);
    gameDispatch({ type: ACTIONS.CHANGE_TIMER_STATE, payload: { timerState: false } });
  }

  function stopTimer() {
    clearTimeout(timerTimeout);
    gameDispatch({ type: ACTIONS.CHANGE_TIMER_STATE, payload: { timerState: false } });
  }
  
  function startTimer() {
    gameDispatch({ type: ACTIONS.CHANGE_TIMER_STATE, payload: { timerState: true } });
  }

  useEffect(() => {
    if(gameState.isTimerActive) {
      timerTimeout = setTimeout(() => {
        if(gameState.isTimerActive) setTimerCount(timerCount + 1);
      }, 1000);
    }


  }, [gameState.isTimerActive, timerCount]);

  return (
    <TimerContext.Provider value={{
      timerCount,

      resetTimer,
      startTimer,
      stopTimer,

    }}>
      { children }
    </TimerContext.Provider>
  )
}