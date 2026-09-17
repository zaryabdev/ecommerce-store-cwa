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
      <h3 className="text-lg font-semibold">
        Categories
      </h3>
      <hr className="my-4" />
      <nav className="flex flex-col gap-y-3">
        {routes.map((route) => (
          <Link
            key={route.id}
            href={`/category/${route.id}`}
            onClick={onNavigate}
            className={cn(
              'text-sm font-medium transition-colors hover:text-black',
              route.id === activeId ? 'text-black' : 'text-neutral-500'
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
