import { HomePageTitle } from '@/components/home/HomePageTitle'
import { HomeTopBar } from '@/components/home/HomeTopBar'
import { CenterBody } from '@/components/layout/CenterBody'
import { ChainInfo } from '@/components/web3/ChainInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { GreeterContractInteractions } from '@/components/web3/GreeterContractInteractions'
import { useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import 'twin.macro'

const TestPage: NextPage = () => {
  // Display `useInkathon` error messages (optional)
  const { error } = useInkathon()
  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  return (
    <>
      {/* Top Bar */}
      <HomeTopBar />
      <div tw="flex h-screen flex-col items-center justify-center border-gray-200 bg-gray-100">
        <div tw="w-full max-w-xl justify-center space-y-4 pb-32 text-center">
          <button
            tw="w-full rounded-lg py-6 font-semibold text-white text-xl hover:bg-emerald-700 focus:(outline-none ring-4 ring-emerald-300)"
            style={{
              background:
                'linear-gradient(180deg, rgb(16 185 129 / var(--tw-bg-opacity)), rgb(5 150 105 / var(--tw-bg-opacity)), rgb(4 120 87 / var(--tw-bg-opacity)))',
            }}
          >
            <Link href={'/pools'}>
              Manager
              <div tw="mt-8 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#ffffff"
                  tw="h-24 w-24 rounded-md"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path d="M400-504.615q-49.5 0-84.75-35.25T280-624.615q0-49.501 35.25-84.751 35.25-35.25 84.75-35.25t84.75 35.25Q520-674.116 520-624.615q0 49.5-35.25 84.75T400-504.615ZM120-215.384v-65.847q0-27.615 13.923-47.769t39.308-32.077q48.692-23.692 100.384-39Q325.308-415.385 400-415.385h9.385q3.692 0 8.923.462-4.154 10.308-6.577 20.192-2.423 9.885-4.654 19.346H400q-67.154 0-117.115 13.77-49.962 13.769-90.577 35.615-18.231 9.615-25.27 20.154Q160-295.308 160-281.231v25.846h252q2.923 9.462 7.154 20.347 4.231 10.884 9.308 19.654H120Zm528.461 19.231-5.846-46.154q-16.615-3.462-31.346-11.654-14.731-8.192-26.5-20.808l-43.384 17.231-16.924-28.769L561.231-314q-6.616-17.077-6.616-35.231 0-18.153 6.616-35.23l-36-29.231 16.923-28.77 42.615 18q11-12.615 26.116-20.423 15.115-7.807 31.73-11.269l5.846-46.154h33.847l5.077 46.154q16.615 3.462 31.731 11.385 15.115 7.923 26.115 20.769l42.615-18.462 16.924 29.231-36 29.231q6.615 16.859 6.615 35.122 0 18.263-6.615 34.878l36.769 27.693-16.923 28.769-43.385-17.231q-11.769 12.616-26.5 20.808t-31.346 11.654l-5.077 46.154h-33.847Zm16.223-80.77q29.855 0 51.047-21.26 21.192-21.261 21.192-51.116t-21.26-51.047q-21.261-21.192-51.116-21.192t-51.047 21.26q-21.192 21.26-21.192 51.115 0 29.856 21.26 51.048 21.261 21.192 51.116 21.192ZM400-544.615q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm12 369.23Z" />
                </svg>
              </div>
            </Link>
          </button>

          <button
            tw="w-full rounded-lg bg-blue-700 py-6 font-semibold text-white text-xl hover:bg-blue-600 focus:(outline-none ring-4 ring-blue-300)"
            style={{
              background:
                'linear-gradient(180deg, rgb(37 99 235 / var(--tw-bg-opacity)), rgb(29 78 216 / var(--tw-bg-opacity)), rgb(30 64 175 / var(--tw-bg-opacity)))',
            }}
          >
            Spender
            <div tw="mt-8 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                tw="h-24 w-24"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M840-695.385v430.77Q840-237 821.5-218.5 803-200 775.385-200h-590.77Q157-200 138.5-218.5 120-237 120-264.615v-430.77Q120-723 138.5-741.5 157-760 184.615-760h590.77Q803-760 821.5-741.5 840-723 840-695.385Zm-680 87.692h640v-87.692q0-9.23-7.692-16.923Q784.615-720 775.385-720h-590.77q-9.23 0-16.923 7.692Q160-704.615 160-695.385v87.692Zm0 95.386v247.692q0 9.23 7.692 16.923Q175.385-240 184.615-240h590.77q9.23 0 16.923-7.692Q800-255.385 800-264.615v-247.692H160ZM160-240v-480 480Z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

export default TestPage
