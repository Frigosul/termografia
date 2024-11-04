import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonTable() {
  return (
    <div className="rounded-md flex">
      <Skeleton className="h-[30rem] w-full" />
    </div>
  )
}
