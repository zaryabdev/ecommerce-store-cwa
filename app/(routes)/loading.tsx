import Container from "@/components/ui/container";
import Skeleton from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Container>
      <div className="flex flex-col gap-y-12 pb-10 lg:gap-y-16" role="status" aria-live="polite">
        <span className="sr-only">Loading…</span>
        <div className="p-4 sm:p-6 lg:p-8">
          <Skeleton className="w-full aspect-[4/5] rounded-xl sm:aspect-[16/9] md:aspect-[2.4/1]" />
        </div>

        <div className="flex flex-col gap-y-12 px-4 sm:px-6 lg:gap-y-16 lg:px-8">
          <div className="space-y-4">
            <Skeleton className="h-7 w-48" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Skeleton className="h-[88px] rounded-xl" />
              <Skeleton className="h-[88px] rounded-xl" />
              <Skeleton className="h-[88px] rounded-xl" />
              <Skeleton className="h-[88px] rounded-xl" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-7 w-56" />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="aspect-square rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Loading;
