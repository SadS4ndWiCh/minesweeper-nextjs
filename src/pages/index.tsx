import { Game } from '@components/Game'

import styles from '@styles/pages/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <main>
        <Game />
      </main>
    </div>
  )
}
