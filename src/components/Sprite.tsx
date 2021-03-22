import Image from 'next/image';

interface SpriteProps {
  spriteName?: string;
  neighborsCount?: number;
}

export function Sprite({ spriteName, neighborsCount }: SpriteProps) {
  const neighborsSpritesNames = [
    'empty',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
  ];

  return (
    <Image
      src={spriteName ? `/sprites/${spriteName}.png` : `/sprites/${neighborsSpritesNames[neighborsCount]}.png`}
      width={30}
      height={30}
    />
  )
}