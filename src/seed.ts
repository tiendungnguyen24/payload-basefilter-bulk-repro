import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

await payload.delete({ collection: 'posts', where: {} })
await payload.delete({ collection: 'users', where: {} })
await payload.create({
  collection: 'users',
  data: { email: 'dev@example.com', password: 'test' },
})

// 6 visible posts (2 list pages with defaultLimit 5)
for (let i = 1; i <= 6; i++) {
  await payload.create({ collection: 'posts', data: { title: `visible ${i}` } })
}
// 4 archived posts, hidden from the list by admin.baseFilter
for (let i = 1; i <= 4; i++) {
  await payload.create({ collection: 'posts', data: { title: `archived ${i}`, archived: true } })
}

payload.logger.info('Seeded 1 user, 6 visible posts and 4 archived posts')
