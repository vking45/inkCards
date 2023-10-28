import Link from 'next/link'
import { FC } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'
import 'twin.macro'
import { ConnectButton } from '../web3/ConnectButton'

export const HomeTopBar: FC = () => {
  return (
    <>
      <div>
        <nav className="bg-gray-100 border-gray-200 border-b-gray-400 border-2">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="" className="flex items-center">
              <img
                src="https://image.similarpng.com/very-thumbnail/2021/09/A-abstract-logo-design-on-transparent-background-PNG.png"
                className="h-8 mr-3"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">Flowbite</span>
            </a>
            <div className="flex md:order-2">
              <ConnectButton />
            </div>
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-cta"
            >
              <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-gray-100">
                <li>
                  <Link
                    href="#"
                    className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  >
                    Contact
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
