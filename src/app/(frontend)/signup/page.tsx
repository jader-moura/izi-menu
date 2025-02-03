import Image from 'next/image'
import SignupForm from '@/components/SignupForm'

export default async function Signup() {
  return (
    <div className="bg-white md:h-screen border-t border-border">
      <div className="grid lg:grid-cols-12 items-center h-full">
        <div className="max-md:order-1 relative h-full w-full lg:col-span-7">
          <Image src="/izi/signup-bg.webp" style={{ objectFit: 'cover' }} fill alt="login-image" />
        </div>

        <div className="flex items-center md:p-8 p-6 bg-background h-full col-span-5">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
