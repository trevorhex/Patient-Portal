import { hash } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'
import { issues, users } from '@/db/schema'
import { Status, Priority } from '@/types/issue'

async function main() {
  console.log('Starting database seeding...')

  await db.delete(issues)
  await db.delete(users)

  const demoPassword = await hash('password123', 10)

  const adminUserId = uuidv4()
  const memberUserId = uuidv4()

  const adminUser = await db
    .insert(users)
    .values({
      id: adminUserId,
      email: 'doctor@healthcenter.com',
      password: demoPassword
    })
    .returning()
    .then((rows) => rows[0])

  const memberUser = await db
    .insert(users)
    .values({
      id: memberUserId,
      email: 'john.doe@patient.com',
      password: demoPassword
    })
    .returning()
    .then((rows) => rows[0])

  console.log('Created demo users:')
  console.log(`- Doctor: ${adminUser.email} (password: password123)`)
  console.log(`- Patient: ${memberUser.email} (password: password123)`)

  const demoIssues = [
    {
      title: 'Schedule annual physical exam',
      description:
        'Need to schedule yearly physical examination with primary care physician. Include blood work and vitals check.',
      priority: 'high',
      status: 'done',
      userId: memberUserId
    },
    {
      title: 'Prescription refill request',
      description:
        'Request refill for blood pressure medication (Lisinopril 10mg). Current supply expires next week.',
      priority: 'medium',
      status: 'in_progress',
      userId: memberUserId
    },
    {
      title: 'Follow-up on lab results',
      description:
        'Discuss recent blood work results and cholesterol levels from last visit.',
      priority: 'high',
      status: 'todo',
      userId: adminUserId
    },
    {
      title: 'Insurance verification needed',
      description:
        'Verify insurance coverage for upcoming MRI scan and get pre-authorization if required.',
      priority: 'medium',
      status: 'todo',
      userId: adminUserId
    },
    {
      title: 'Update emergency contact information',
      description:
        'Need to update emergency contact details and preferred pharmacy in patient records.',
      priority: 'low',
      status: 'done',
      userId: memberUserId
    },
  ]

  for (const issue of demoIssues) {
    await db.insert(issues).values({
      title: issue.title,
      description: issue.description,
      priority: issue.priority as Priority,
      status: issue.status as Status,
      userId: issue.userId
    })
  }

  console.log(`Created ${demoIssues.length} demo issues`)
  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Seed script finished')
  })
