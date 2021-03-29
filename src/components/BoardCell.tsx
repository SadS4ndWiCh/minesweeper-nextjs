import styles from '@styles/components/BoardCell.module.css';

interface BoardCellProps {
  isRevealed: boolean;
  neighborsCount: number;
  isFlagged: boolean;
  isBomb: boolean;
  cellIndex: number;
  
  disabled: boolean;

  onClick?: (e) => unknown;
  onRightClick?: (e, i) => any;
}

export function BoardCell({ isRevealed, isFlagged, isBomb, neighborsCount, cellIndex, disabled, onClick, onRightClick }: BoardCellProps) {
  const dataCellType = !isRevealed && !isFlagged ? 'block' :
                       !isRevealed && isFlagged ? 'flagged' :
                       isRevealed && isBomb ? 'mine' : 'neighbor';

  const neuClass = dataCellType === 'block' || dataCellType === 'flagged' ? 'neu-flat' : 'neu-pressed';

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => onRightClick(e, cellIndex)}

      data-cell-type={dataCellType}
      data-cell-index={cellIndex}

      data-disabled={disabled}

      className={`${styles.boardCellContainer} ${neuClass}`}
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