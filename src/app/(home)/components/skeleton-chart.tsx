import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonChart() {
  return (
    <div className="border rounded-md p-4 flex flex-col items-center">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32 w-full mt-2" />
      <Skeleton className="h-4 w-8 my-2" />

      <Skeleton className="h-6 w-full" />
    </div>
  )
}
