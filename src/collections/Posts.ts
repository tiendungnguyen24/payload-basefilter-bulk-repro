import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    pagination: { defaultLimit: 5 },
    // Hide archived posts from the list view
    baseFilter: () => ({ archived: { not_equals: true } }),
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'archived', type: 'checkbox' },
  ],
}
