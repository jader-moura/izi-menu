import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function PATCH(req: Request) {
  const payload = await getPayload({ config: configPromise })

  try {
    const { slug, tenant } = await req.json()

    // Check if the slug already exist
    const slugFound = await payload.find({
      collection: 'tenants',
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (slugFound.docs.length > 0) {
      return new NextResponse(JSON.stringify({ error: 'Slug already exist' }), {
        status: 400,
      })
    }

    // Update the slug
    await payload.update({
      collection: 'tenants',
      id: tenant.id,
      data: {
        slug,
      },
    })

    return NextResponse.json({ success: true })
  } catch (_error) {
    return new NextResponse(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
    })
  }
}
