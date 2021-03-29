import styles from '@styles/components/EmojiButton.module.css';

interface EmojiButtonProps {
  handleReset: () => void;
}

export function EmojiButton({ handleReset }: EmojiButtonProps) {
  return (
    <button
      onClick={handleReset}
      className={`${styles.emojiButtonContainer} neu-convex-hov-concave`}
    >
      😼
    </button>
  )
}