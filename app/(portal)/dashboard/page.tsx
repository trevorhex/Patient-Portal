import { Card } from '@/app/components/Card'
import { DashboardLayout } from '../components/DashboardLayout'

export default function DashboardPage() {
  return (
    <DashboardLayout heading="Dashboard">
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="h-60"><></></Card>
          <Card className="h-60"><></></Card>
        </div>
        <Card className="h-100"><></></Card>
      </div>
    </DashboardLayout>
  )
}
