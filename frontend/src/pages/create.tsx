import React, { FC, useEffect, useState, ChangeEvent } from 'react'
import 'twin.macro'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { toast } from 'react-hot-toast'
import { HomeTopBar } from '@/components/home/HomeTopBar'

const CreateForm: NextPage = () => {
  const [amount, setAmount] = useState<string>('$')
  const [name, setName] = useState<string>('')

  const { error } = useInkathon()
  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Remove the default dollar sign before checking the numeric validation
    const numericValue = value.slice(1)
    if (/^\d*\.?\d*$/.test(numericValue)) {
      // Allow only numerical values, including decimals
      setAmount(value)
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^[a-zA-Z\s]*$/.test(value)) {
      // Allow only alphabets and spaces
      setName(value)
    }
  }

  return (
    <>
      <HomeTopBar />
      <div tw="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 tw="mb-8 font-semibold text-4xl text-emerald-700">Pool Creation</h1>
        <div tw="-m-4 flex flex-wrap items-center justify-center">
          <div tw="p-4 lg:w-1/3">
            <div tw="relative h-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-b bg-opacity-75 from-emerald-600 to-emerald-800 px-8 pt-16 pb-24 text-center transition-all duration-300 hover:scale-105">
              <div tw="relative mb-6">
                <input
                  tw={
                    'w-full appearance-none bg-transparent font-medium text-8xl focus:outline-none'
                  }
                  id="amount"
                  type="text"
                  placeholder="$00.00"
                  required
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>

              <div tw="relative mb-6">
                <input
                  tw={
                    'w-full appearance-none bg-transparent leading-10 tracking-widest focus:outline-none'
                  }
                  id="name"
                  type="text"
                  placeholder="Pool Name"
                  required
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div tw="mt-4 flex justify-center">
                <button
                  tw="rounded bg-emerald-600 py-2 px-4 font-bold text-white hover:bg-emerald-700 focus:(outline-none outline-emerald-50)"
                  type="submit"
                >
                  Create Pool
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateForm
