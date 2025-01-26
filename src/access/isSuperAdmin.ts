import type { Access } from 'payload'

export const isSuperAdmin: Access = ({ req }) => {
  return req.user?.role === 'super-admin'
}
