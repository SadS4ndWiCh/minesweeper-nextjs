import { Board } from "./Board";

import { GameProvider } from "@contexts/GameContext";
import { TimerProvider } from "@contexts/TimerContext";

export function Game() {
  return (
    <GameProvider>
      <TimerProvider>
        <Board />
      </TimerProvider>
    </GameProvider>
  )
}