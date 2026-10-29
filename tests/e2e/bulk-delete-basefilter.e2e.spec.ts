import { test, expect } from '@playwright/test'
import config from '../../src/payload.config.js'
import { getPayload } from 'payload'
import { login } from '../helpers/login'
import { seedTestUser, testUser } from '../helpers/seedUser'

test('select all + bulk delete respects admin.baseFilter', async ({ page }) => {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'posts', where: {} })
  for (let i = 1; i <= 6; i++) {
    await payload.create({ collection: 'posts', data: { title: `visible ${i}` } })
  }
  for (let i = 1; i <= 4; i++) {
    await payload.create({ collection: 'posts', data: { title: `archived ${i}`, archived: true } })
  }
  await seedTestUser()
  await login({ page, user: testUser })

  await page.goto('http://localhost:3000/admin/collections/posts')
  // The list shows only the 6 visible posts
  await expect(page.getByText('1-5 of 6')).toBeVisible()

  await page.locator('#select-all').check()
  await page.locator('#select-all-across-pages').click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()
  page.on('request', (r) => r.method() === 'DELETE' && console.log('DELETE', decodeURIComponent(r.url())))
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText(/Deleted/)).toBeVisible()

  const archived = await payload.count({ collection: 'posts', where: { archived: { equals: true } } })
  // Expected: the 4 archived posts are still there. Actual (3.92.1): 0
  expect(archived.totalDocs).toBe(4)
})
