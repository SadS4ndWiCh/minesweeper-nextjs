import { Link } from './Link';

import styles from '@styles/components/Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <p>
        Feito por <Link to={'https://github.com/SadS4ndWiCh'}>SadS4ndWiCh</Link>
      </p>
    </footer>
  )
}