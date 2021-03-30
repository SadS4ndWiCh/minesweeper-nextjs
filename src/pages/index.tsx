import Head from 'next/head';

import { Game } from '@components/Game'
import { Footer } from '@components/Footer';
import { GithubCorner } from '@components/GithubCorner';

import styles from '@styles/pages/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Minesweeper</title>
      </Head>

      <GithubCorner />
      
      <main>
        <Game />
      </main>

      <Footer />
    </div>
  )
}
