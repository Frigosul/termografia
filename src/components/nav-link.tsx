"use client"
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps extends LinkProps {
  children: ReactNode;

}

export function NavLink({ children, href, ...props }: NavLinkProps) {
  const pathname = usePathname()


  return (
    <Link
      data-current={pathname === href}
      className="data-[current=true]:text-foreground last:border-t last:pt-4 last:!mt-auto"
      href={href}
      {...props}

    >
      <span className="flex items-center gap-4  font-medium text-muted-foreground hover:text-foreground">
        {children}
      </span>

    </Link>
  )
}
