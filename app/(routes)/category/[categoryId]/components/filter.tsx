"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Color, Size } from "@/types";

interface FilterProps {
  data: (Size | Color)[];
  name: string;
  valueKey: string;
};

/**
 * Toggle-chip filter group. Preserves the exact existing URL/query-param
 * logic (deselect on re-click, `router.push` on change) — only the markup
 * and styling changed. Rendered as plain `<button>`s (not the shared
 * `Button` primitive) since a two-state toggle-chip needs `aria-pressed`
 * semantics and an "outline vs filled" visual pair that would otherwise
 * require overriding most of `Button`'s own base classes — everything here
 * still resolves purely to Task 2 tokens (border/bg/text/focus), no new
 * raw colors introduced.
 */
const Filter: React.FC<FilterProps> = ({
  data,
  name,
  valueKey,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.push(url);
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-subheading text-foreground">
        {name}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.map((filter) => {
          const active = selectedValue === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active}
              onClick={() => onClick(filter.id)}
              className={cn(
                'inline-flex min-h-[44px] items-center rounded-control border px-4 text-body transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-foreground hover:bg-surface-muted',
              )}
            >
              {filter.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Filter;
