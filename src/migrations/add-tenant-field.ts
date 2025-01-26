import { Payload } from 'payload'

export async function addTenantField(payload: Payload) {
  // Create a default tenant
  const defaultTenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Default Tenant',
      slug: 'default',
      public: true,
    },
  })

  // Update all existing users to have tenant-admin role for default tenant
  const users = await payload.find({
    collection: 'users',
    limit: 1000,
  })

  for (const user of users.docs) {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        tenants: [
          {
            tenant: defaultTenant.id,
            roles: ['tenant-admin'],
          },
        ],
      },
    })
  }

  // Collections that need tenant field
  const collections = ['pages', 'products', 'media', 'categories']

  // Update all existing records in other collections to have default tenant
  for (const collection of collections) {
    const records = await (payload as any).find({
      collection,
      limit: 1000,
    })

    for (const record of records.docs) {
      await (payload as any).update({
        collection,
        id: record.id,
        data: {
          tenant: defaultTenant.id,
        },
      })
    }
  }

  console.log('Successfully added tenant field to all existing records')
}
