import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading…</span>
      </div>
      <div className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-64" />
        <Skeleton className="h-11 w-full max-w-xl rounded-xl" />
        <Skeleton className="mt-6 h-4 w-20" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="aspect-square rounded-xl" />
        </div>
      </div>
    </Container>
  );
};

export default Loading;
