import { IssueLayout } from '../components/IssueLayout'
import { Card } from '@/app/components/Card'

export default function Loading() {
  return (
    <IssueLayout
      heading={<span className="w-60 h-8.5 animate-pulse rounded-sm bg-zinc-800"></span>}
      buttons={<>
        <span className="w-22.5 h-8.5 animate-pulse rounded bg-zinc-800"></span>
        <span className="w-22.5 h-8.5 animate-pulse rounded bg-zinc-800"></span>
      </>}
    ><div className="space-y-8">
      <Card className="space-y-6">
        <div className="flex space-x-3 animate-pulse">
          {[12, 12, 32, 32].map((w, i) =>
            <div key={i} className={`w-${w} h-6 rounded bg-zinc-800`}></div>)}
        </div>
        <div className="w-full h-5 animate-pulse rounded-sm bg-zinc-800"></div>
      </Card>
      <Card>
        <div className="w-32 h-6 animate-pulse rounded-sm bg-zinc-800 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="w-full h-5 bg-zinc-800"></div>
              <div className="w-full h-5 bg-zinc-800"></div>
            </div>
          ))}
        </div>
      </Card>
    </div></IssueLayout>
  )
}
