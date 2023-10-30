import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import { ConnectButton } from '../web3/ConnectButton'

export const HomeTopBar: FC = () => {
  return (
    <>
      <div>
        <nav tw="border-gray-200 border-2 border-b-gray-400 bg-gray-100">
          <div tw="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
            <a href="" tw="flex items-center">
              <img
                src="https://image.similarpng.com/very-thumbnail/2021/09/A-abstract-logo-design-on-transparent-background-PNG.png"
                tw="mr-3 h-8"
                alt="Flowbite Logo"
              />
              <span tw="self-center whitespace-nowrap font-semibold text-2xl text-gray-900">
                inkCards
              </span>
            </a>
            <div tw="flex md:order-2">
              <ConnectButton />
            </div>
            <div
              tw="hidden w-full items-center justify-between md:(order-1 flex w-auto)"
              id="navbar-cta"
            >
              <ul tw="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-100 p-4 font-medium md:(mt-0 flex-row space-x-8 border-0 p-0)">
                <li>
                  <Link
                    href="/"
                    tw="block rounded bg-gray-100 py-2 pl-3 pr-4 text-gray-900 md:(p-0 hover:text-blue-700)"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pools"
                    tw="block rounded bg-gray-100 py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:(p-0 hover:(bg-transparent text-blue-700))"
                  >
                    Manage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/spend"
                    tw="block rounded bg-gray-100 py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:(p-0 hover:(bg-transparent text-blue-700))"
                  >
                    Spend
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create"
                    tw="block rounded bg-gray-100 py-2 pl-3 pr-4 text-gray-900 hover:bg-gray-100 md:(p-0 hover:(bg-transparent text-blue-700))"
                  >
                    Create
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
