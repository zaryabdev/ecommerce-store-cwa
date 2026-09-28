"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils"
import { Category } from "@/types";

interface MainNavProps {
  data: Category[];
}

const MainNav: React.FC<MainNavProps> = ({
  data
}) => {
  const pathname = usePathname();

  // Child categories are reached by drilling into their parent (mobile nav)
  // or from their parent's own category page (desktop "View All" / category-nav).
  const routes = data.filter((route) => !route.parentId).map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  return (
    <nav
      // overflow-x-auto + shrink-0 links: as top-level category count grows,
      // the row scrolls horizontally instead of wrapping or overlapping the
      // logo/cart controls.
      className="mx-6 flex max-w-full items-center gap-x-4 overflow-x-auto whitespace-nowrap lg:gap-x-6"
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'shrink-0 rounded-control px-1 py-2 text-body font-medium transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            route.active ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};

export default MainNav;
