import type { PayloadRequest } from 'payload'

export const isPayloadAdminPanel = (req: PayloadRequest): boolean => {
  const referer = req.headers.get('referer')
  return Boolean(referer?.includes('/admin'))
}
