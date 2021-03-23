import { Sprite } from './Sprite';

import styles from '@styles/components/BoardCell.module.css';

interface BoardCellProps {
  isRevealed: boolean;
  neighborsCount: number;
  isFlagged: boolean;
  isBomb: boolean;

  cellIndex: number;

  onClick?: () => any;
  onRightClick?: (e, i) => any;
}

export function BoardCell({ isRevealed, isFlagged, isBomb, neighborsCount, cellIndex, onClick, onRightClick }: BoardCellProps) {
  const dataCellType = !isRevealed && !isFlagged ? 'block' :
                       !isRevealed && isFlagged ? 'flagged' :
                       isRevealed && isBomb ? 'mine' : 'neighbor'

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => onRightClick(e, cellIndex)}

      data-cell-type={dataCellType}

      className={styles.boardCellContainer}
    >
      { !isRevealed && !isFlagged && (
        <span />
      )}

      { !isRevealed && isFlagged && (
        <span>🚩</span>
      ) }

      { isRevealed && isBomb && (
        <span>💣</span>
      ) }

      { isRevealed && !isBomb && (
        <span data-cell-type='neighbor' data-neighbors-count={String(neighborsCount)}>
          { neighborsCount > 0 ? neighborsCount : '' }
        </span>
      ) }
    </div>
  )
}