import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
      <div
        className="flex flex-col gap-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading…</span>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="mt-8 flex flex-col gap-y-4 lg:mt-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-11 w-40 rounded-xl" />
            <Skeleton className="h-11 w-full rounded-full sm:w-40" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Loading;
