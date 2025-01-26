import type { FieldHook } from 'payload'

export const autofillTenant: FieldHook = ({ req, value }) => {
  // If there is no value,
  // and the user only has one tenant,
  // return that tenant ID as the value
  if (!value && typeof req.user?.tenant !== 'number' && req.user?.tenant?.id) {
    return req.user?.tenant?.id
  }

  return value
}
