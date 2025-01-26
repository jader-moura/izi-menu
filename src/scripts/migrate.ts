import payload from 'payload'
import { addTenantField } from '../migrations/add-tenant-field'

// Run the migration
const migrate = async () => {
  try {
    // Initialize payload with config path
    await payload.init({
      // @ts-ignore
      configPath: 'dist/payload.config.js',
    })
    await addTenantField(payload)
    process.exit(0)
  } catch (err) {
    console.error('Error running migrations:', err)
    process.exit(1)
  }
}

migrate()
