import { ReactNode } from 'react';

import NextLink from 'next/link';

interface LinkProps {
  children: ReactNode;
  to: string;

  className?: string;
}

export function Link({ children, to, className }: LinkProps) {
  return (
    <NextLink href={to}>
      <a target='_blank' className={className}>
        { children }
      </a>
    </NextLink>
  )
}
