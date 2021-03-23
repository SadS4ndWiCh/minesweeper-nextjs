import { Board } from '@components/Board'

import { GameProvider } from '@contexts/GameContext'

import styles from '@styles/pages/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <GameProvider>
        <Board />
      </GameProvider>
    </div>
  )
}
