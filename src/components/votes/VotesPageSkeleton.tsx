import { Skeleton } from "@/components/ui/skeleton";

export const VotesPageSkeleton = () => (
  <div className="flex h-full flex-col pb-8 lg:flex-row lg:gap-16 lg:pb-0">
    <div className="flex w-full flex-col gap-4 lg:w-1/2">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-8 lg:h-12 lg:w-12" />
        <Skeleton className="h-8 w-16 lg:h-12 lg:w-24" />
        <Skeleton className="h-8 w-8 lg:h-12 lg:w-12" />
      </div>

      <Skeleton className="h-24 w-full lg:h-40" />

      <div className="flex w-full gap-4">
        <Skeleton className="h-44 w-2/5 lg:block lg:w-1/5" />
        <Skeleton className="h-44 w-2/5 lg:block lg:w-1/5" />
        <Skeleton className="h-44 w-1/5 lg:block" />
        <Skeleton className="hidden h-44 lg:block lg:w-1/5" />
        <Skeleton className="hidden h-44 lg:block lg:w-1/5" />
      </div>
    </div>

    <div className="w-full lg:w-1/2"></div>
  </div>
);

export default VotesPageSkeleton;