import Link from "next/link";

import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface CategoryNavProps {
  parent: Category;
  items: Category[];
  activeId: string;
  onNavigate?: () => void;
};

const CategoryNav: React.FC<CategoryNavProps> = ({
  parent,
  items,
  activeId,
  onNavigate,
}) => {
  const routes = [
    { id: parent.id, label: `All ${parent.name}` },
    ...items.map((item) => ({ id: item.id, label: item.name })),
  ];

  return (
    <div className="mb-8">
      <h3 className="text-subheading text-foreground">
        Categories
      </h3>
      <nav className="mt-3 flex flex-col gap-y-1">
        {routes.map((route) => (
          <Link
            key={route.id}
            href={`/category/${route.id}`}
            onClick={onNavigate}
            aria-current={route.id === activeId ? "page" : undefined}
            className={cn(
              'flex min-h-[44px] items-center rounded-control px-2 text-body transition-colors hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
              route.id === activeId ? 'font-semibold text-foreground' : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default CategoryNav;
