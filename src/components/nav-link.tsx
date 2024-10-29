'use client'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Button } from './ui/button'

interface NavLinkProps extends LinkProps {
  children: ReactNode
  setIsOpen?: (open: boolean) => void
}

export function NavLink({ children, href, setIsOpen, ...props }: NavLinkProps) {
  const pathname = usePathname()
  if (setIsOpen) {
    return (
      <Button
        variant="ghost"
        data-current={pathname === href}
        className='flex py-2 justify-start data-[current=true]:bg-accent'
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        asChild
      >
        <Link
          href={href}
          {...props}
          prefetch
        >
          <span
            data-current={pathname === href}
            className="flex items-center gap-4 font-medium text-muted-foreground data-[current=true]:text-primary hover:text-primary">
            {children}
          </span>
        </Link>
      </Button>
    )
  } else {
    return (
      <Button
        variant="ghost"
        data-current={pathname === href}
        className='flex py-2 justify-start data-[current=true]:bg-accent'
        asChild
      >
        <Link
          href={href}
          {...props}
          prefetch
        >
          <span
            data-current={pathname === href}
            className="flex items-center gap-4 font-medium text-muted-foreground data-[current=true]:text-primary hover:text-primary">
            {children}
          </span>
        </Link>
      </Button>
    )
  }

}
