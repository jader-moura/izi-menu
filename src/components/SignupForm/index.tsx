'use client'

import React, { useCallback } from 'react'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-hot-toast'

type FormValues = {
  name: string
  email: string
  password: string
  rememberMe: boolean
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmitForm = useCallback<SubmitHandler<FormValues>>(
    async (data) => {
      if (!data.name || !data.email || !data.password) {
        toast.error('All fields are required')
        return
      }

      try {
        const { status } = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/new`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'user',
          }),
        })
        if (status !== 200) {
          toast.error('Failed to create account')
        } else {
          toast.success('Account created successfully')
          reset()
        }
      } catch (error) {
        console.error('Error creating account:', error)
        toast.error('Something went wrong.')
      }
    },
    [reset],
  )

  return (
    <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="mb-12">
        <h3 className="text-2xl font-bold">Create an account</h3>
      </div>

      {/* Full Name */}
      <div>
        <label className="text-white text-xs block mb-2">Full Name</label>
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-main pl-2 pr-8 py-3 outline-none"
            placeholder="Enter name"
            {...register('name', { required: true })}
          />
        </div>
        {errors.name && <span className="text-red-500 text-xs">Name is required</span>}
      </div>

      {/* Email */}
      <div className="mt-8">
        <label className="text-white text-xs block mb-2">Email</label>
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-main pl-2 pr-8 py-3 outline-none"
            placeholder="Enter email"
            {...register('email', { required: true })}
          />
        </div>
        {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
      </div>

      {/* Password */}
      <div className="mt-8">
        <label className="text-white text-xs block mb-2">Password</label>
        <div className="relative flex items-center">
          <input
            type="password"
            className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-main pl-2 pr-8 py-3 outline-none"
            placeholder="Enter password"
            {...register('password', { required: true })}
          />
        </div>
        {errors.password && <span className="text-red-500 text-xs">Password is required</span>}
      </div>

      {/* Remember Me / Terms */}
      <div className="flex items-center mt-8">
        <input
          id="remember-me"
          type="checkbox"
          className="h-4 w-4 shrink-0 rounded"
          {...register('rememberMe')}
        />
        <label htmlFor="remember-me" className="text-white ml-3 block text-sm">
          I accept the{' '}
          <a href="javascript:void(0);" className="text-main font-semibold hover:underline ml-1">
            Terms and Conditions
          </a>
        </label>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-max shadow-xl py-3 px-6 text-sm text-white font-semibold rounded bg-main hover:bg-transparent border border-main hover:border-primary focus:outline-none"
        >
          Register
        </button>
        <p className="text-sm text-white mt-8">
          Already have an account?
          <Link href="/admin/login" className="text-main font-semibold hover:underline ml-1">
            Login here
          </Link>
        </p>
      </div>
    </form>
  )
}
