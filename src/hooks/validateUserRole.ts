import { FieldHook } from 'payload'
import { User } from '../payload-types'

export const validateUserRole: FieldHook = async ({ req, value, operation, originalDoc }) => {
  // Get total users count
  const users = await req.payload.find({
    collection: 'users',
    limit: 0, // We only need the total count
  })

  const isFirstUser = users.totalDocs === 0
  const isSuperAdmin = value === 'super-admin'
  const wasSuperAdmin = (originalDoc as User)?.roles === 'super-admin'

  // If this is the first user being created, force super-admin role
  if (operation === 'create' && isFirstUser) {
    return 'super-admin'
  }

  // If this is not the first user, prevent super-admin role
  if (operation === 'create' && isSuperAdmin) {
    throw new Error('Only the first user can be a super-admin')
  }

  // On update, prevent removing super-admin from first user
  if (operation === 'update' && wasSuperAdmin && !isSuperAdmin) {
    throw new Error('Cannot remove super-admin role from the first user')
  }

  // On update, prevent adding super-admin to other users
  if (operation === 'update' && !wasSuperAdmin && isSuperAdmin) {
    throw new Error('Cannot add super-admin role to existing users')
  }

  // Default to user role if no role provided
  if (!value) {
    return 'user'
  }

  return value
}
