import { createContext, ReactNode, useEffect, useState } from "react";

interface TimerContextData {
  timerCount: number;
  isActive: boolean;
  
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
  const [timerCount, setTimerCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function resetTimer() {
    clearTimeout(timerTimeout)
    setTimerCount(0);
    setIsActive(false);
  }

  function stopTimer() {
    clearTimeout(timerTimeout);
    setIsActive(false);
  }

  function startTimer() {
    setIsActive(true);
  }

  useEffect(() => {
    if(isActive) {
      timerTimeout = setTimeout(() => {
        if(isActive) setTimerCount(timerCount + 1);
      }, 1000);
    }


  }, [isActive, timerCount]);

  return (
    <TimerContext.Provider value={{
      timerCount,
      isActive,

      resetTimer,
      startTimer,
      stopTimer,

    }}>
      { children }
    </TimerContext.Provider>
  )
}