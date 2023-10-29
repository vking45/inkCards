import React, { FC, useEffect } from 'react'
import 'twin.macro'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { toast } from 'react-hot-toast'
import { HomeTopBar } from '@/components/home/HomeTopBar'
import Link from 'next/link'

interface Pool {
  amount: string
  description: string
}

const ManageScreen: NextPage = () => {
  const pools: Pool[] = [
    { amount: '$1000', description: 'lorem Ipsum' },
    { amount: '$1500', description: 'lorem Ipsum' },
    { amount: '$2000', description: 'lorem Ipsum' },
  ]

  const { error } = useInkathon()
  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  return (
    <>
      <HomeTopBar />
      <div tw="min-h-screen bg-gray-100">
        <h1 tw="mt-8 text-center font-semibold text-4xl leading-none tracking-tight text-[#292524] md:text-5xl">
          List of Pools
        </h1>
        <section tw="text-gray-600">
          <div tw="container mx-auto px-5 py-24">
            <div tw="-m-4 flex flex-wrap">
              {pools.map((pool, index) => (
                <div key={index} tw="p-4 lg:w-1/3">
                  <div tw="relative h-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-b bg-opacity-75 from-emerald-600 to-emerald-800 px-8 pt-16 pb-24 text-center transition-all duration-300 hover:scale-105">
                    <h1 tw="mb-3 font-medium text-8xl text-gray-100">{pool.amount}</h1>
                    <p tw="mb-3 text-gray-200 leading-10 tracking-widest">{pool.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div tw="mt-8 flex justify-center">
              <Link
                href={'/create'}
                tw="flex items-center rounded-full bg-emerald-600 py-2 px-4 font-bold text-white hover:bg-emerald-700"
              >
                <svg
                  tw="mr-2 h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ManageScreen
