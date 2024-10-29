import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonTable() {
  return (
    <div className="border rounded-md p-4 flex flex-col items-center h-[30rem]">


      <Skeleton className="h-4 w-full my-2" />

      <Skeleton className="h-full w-full" />
    </div>
  )
}
