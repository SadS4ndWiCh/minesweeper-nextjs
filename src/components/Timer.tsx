import { useContext } from 'react';

import { TimerContext } from '@contexts/TimerContext';

import styles from '@styles/components/Timer.module.css';

export function Timer() {
  const { timerCount } = useContext(TimerContext);

  return (
    <div className={`${styles.timerContainer} neu-flat`}>
      ⏱ { String(timerCount).padStart(3, '0') }
    </div>
  )
}