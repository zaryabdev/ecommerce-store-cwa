"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import { Category } from "@/types";

interface MobileNavProps {
  categories: Category[];
}

/**
 * Mobile drill-down category menu.
 *
 * The Storefront's category data is a flat list where each Category only
 * knows its own `parentId` (types.ts) — there is no nested/children array
 * from the API. Levels are therefore derived generically at render time by
 * matching `parentId` against whatever is currently being viewed, rather
 * than assuming a fixed depth. In practice, nothing else in this app
 * currently produces more than one level of children below a top-level
 * category (see `category-nav.tsx`'s single parent+children "family"), so
 * this will behave as a 2-level menu (top-level -> immediate children)
 * against today's real data — but it will correctly drill further if a
 * deeper `parentId` chain ever exists, since each level is computed the
 * same way instead of hardcoded to a fixed depth.
 */
const MobileNav: React.FC<MobileNavProps> = ({ categories }) => {
  const [open, setOpen] = useState(false);
  const [viewStack, setViewStack] = useState<Category[]>([]);

  const rootCategories = useMemo(
    () => categories.filter((category) => !category.parentId),
    [categories],
  );

  const currentParent = viewStack[viewStack.length - 1] ?? null;

  const currentItems = useMemo(() => {
    if (!currentParent) return rootCategories;
    return categories.filter((category) => category.parentId === currentParent.id);
  }, [categories, currentParent, rootCategories]);

  const hasChildren = (category: Category) =>
    categories.some((candidate) => candidate.parentId === category.id);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onNavigate = () => setOpen(false);
  const onDrillIn = (category: Category) => setViewStack((stack) => [...stack, category]);
  const onBack = () => setViewStack((stack) => stack.slice(0, -1));

  const headingText = currentParent ? currentParent.name : "Categories";

  return (
    <>
      <IconButton onClick={onOpen} aria-label="Open menu" icon={<Menu size={22} />} />

      <Transition show={open} as={Fragment} afterLeave={() => setViewStack([])}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-foreground/50" />
          </Transition.Child>

          {/* Panel */}
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-150"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="mr-auto flex h-full w-full max-w-xs flex-col bg-surface shadow-surface">
                {/* Level header: Back / heading / Close */}
                <div className="flex items-center gap-2 border-b border-border px-2 py-2">
                  {currentParent ? (
                    <button
                      type="button"
                      onClick={onBack}
                      className="inline-flex h-11 items-center gap-1 rounded-control px-2 text-body font-medium text-foreground hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      <ChevronLeft size={20} aria-hidden="true" />
                      Back
                    </button>
                  ) : (
                    <span className="h-11 w-11 shrink-0" aria-hidden="true" />
                  )}

                  <Dialog.Title
                    as="h2"
                    className="flex-1 truncate text-center text-subheading text-foreground"
                  >
                    {headingText}
                  </Dialog.Title>

                  <IconButton onClick={onClose} aria-label="Close menu" icon={<X size={18} />} />
                </div>

                {/* Level content */}
                <nav
                  aria-label={currentParent ? `${currentParent.name} categories` : "Categories"}
                  className="flex-1 overflow-y-auto px-2 py-2"
                >
                  {currentParent && (
                    <Link
                      href={`/category/${currentParent.id}`}
                      onClick={onNavigate}
                      className="flex min-h-[44px] items-center rounded-control px-3 text-body font-semibold text-foreground hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      View All {currentParent.name}
                    </Link>
                  )}

                  {currentItems.length === 0 ? (
                    <p className="px-3 py-4 text-body text-muted-foreground">
                      No categories available.
                    </p>
                  ) : (
                    currentItems.map((category) => {
                      if (hasChildren(category)) {
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => onDrillIn(category)}
                            className="flex min-h-[44px] w-full items-center justify-between rounded-control px-3 text-left text-body text-foreground hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            {category.name}
                            <ChevronRight
                              size={18}
                              className="text-muted-foreground"
                              aria-hidden="true"
                            />
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={category.id}
                          href={`/category/${category.id}`}
                          onClick={onNavigate}
                          className="flex min-h-[44px] items-center rounded-control px-3 text-body text-foreground hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                          {category.name}
                        </Link>
                      );
                    })
                  )}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MobileNav;
