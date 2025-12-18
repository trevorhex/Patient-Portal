const Field = ({ h = '10' }: { h?: string }) => <div className="space-y-2 grow">
  <div className="h-4.5 w-24 bg-zinc-800 rounded"></div>
  <div className={`h-${h} bg-zinc-800 rounded`}></div>
</div>

export const IssueFormSkeleton = () => (
  <div className="animate-pulse space-y-4.5 pb-1">
    <Field />
    <Field h="20" />
    <div className="flex gap-4">
      <Field />
      <Field />
    </div>
    <div className="flex justify-end gap-2 pt-1">
      <div className="h-11 w-21.5 bg-zinc-800 rounded"></div>
      <div className="h-11 w-32 bg-zinc-800 rounded"></div>
    </div>
  </div>
)
