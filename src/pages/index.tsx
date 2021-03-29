import Head from 'next/head';

import { Game } from '@components/Game'

import styles from '@styles/pages/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Minesweeper</title>
      </Head>

      <main>
        <Game />
      </main>
    </div>
  )
}
