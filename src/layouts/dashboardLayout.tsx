import type { ReactNode } from "react"
import { NavLink } from "react-router"

type LinkItem = {
  to: string,
  title: string
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const navLinks: LinkItem[] = []
  return (
    <div className="w-full min-h-screen">
      <header className="sticky top-0 w-full p-4 md:p-6 flex items-center gap-6 backdrop-blur-lg ">
        <p className="text-2xl tracking-wider lowercase font-semibold">
          Aworan <span aria-hidden={"true"} className="text-primary">.</span>
        </p>
        <nav>
          {navLinks.map(link => (<NavLink to={link.to} key={link.to}>{link.title}</NavLink>))}
        </nav>
      </header>
      {children}
    </div>
  )
}
