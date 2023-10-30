import { HomeTopBar } from '@/components/home/HomeTopBar'
import { contractTxWithToast } from '@/utils/contractTxWithToast'
import { ContractPromise } from '@polkadot/api-contract'
import { BN } from '@polkadot/util/bn'
import { contractQuery, decodeOutput, useInkathon } from '@scio-labs/use-inkathon'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import 'twin.macro'

interface ModalContent {
  title: string
}

const decimals = new BN('100000000000000')

const Interaction: NextPage = () => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [funds, setFunds] = useState(0)
  const [name, setName] = useState<string>('')
  const [cardName, setCardName] = useState<string>('')
  const [benef, setBenef] = useState<string>('')
  const [days, setDays] = useState(0)
  const [limit, setLimit] = useState(0)
  const [size, setSize] = useState<string>('$')
  const [supply, setSupply] = useState<string>('0')
  const [owner, setOwner] = useState<string>('')
  const [modalContent, setModalContent] = useState<ModalContent>({ title: '' })
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()
  const { api, activeAccount, activeSigner } = useInkathon()

  const addFundsTx = async () => {
    setFetchIsLoading(true)
    if (!api || !activeAccount) {
      toast.error('API error. Try again...')
      return
    }
    if (typeof router.query.addr !== 'string') {
      toast.error('Invalid address. Try again...')
      return
    }
    const abi = await import(`@inkathon/contracts/deployments/ink_cards/ink_cards.json`)
    const contract = new ContractPromise(api, abi, router.query.addr)
    if (!contract) {
      toast.error('Contract not connected. Try again…')
      return
    }

    try {
      const res = await contractTxWithToast(
        api,
        activeAccount.address,
        contract,
        'addFunds',
        { value: funds * 10 ** 12 },
        [funds * 10 ** 12],
      )
      console.log(res)
    } catch (e) {
      console.error(e)
      setFetchIsLoading(false)
    } finally {
      setFetchIsLoading(false)
    }
  }

  const issueCardTx = async () => {
    setFetchIsLoading(true)
    if (!api || !activeAccount) {
      toast.error('API error. Try again...')
      return
    }
    if (typeof router.query.addr !== 'string') {
      toast.error('Invalid address. Try again...')
      return
    }
    const abi = await import(`@inkathon/contracts/deployments/ink_cards/ink_cards.json`)
    const contract = new ContractPromise(api, abi, router.query.addr)
    if (!contract) {
      toast.error('Contract not connected. Try again…')
      return
    }

    try {
      const res = await contractTxWithToast(
        api,
        activeAccount.address,
        contract,
        'card::issueCard',
        {},
        [new BN(limit).mul(decimals), cardName, days, benef],
      )
      console.log(res)
    } catch (e) {
      console.error(e)
      setFetchIsLoading(false)
    } finally {
      setFetchIsLoading(false)
    }
  }

  const fetchPools = async () => {
    setFetchIsLoading(true)
    if (!api) {
      toast.error('API error. Try again...')
      return
    }
    if (typeof router.query.addr !== 'string') {
      toast.error('Invalid address. Try again...')
      return
    }
    const abi = await import(`@inkathon/contracts/deployments/ink_cards/ink_cards.json`)
    const contract = new ContractPromise(api, abi, router.query.addr)
    if (!contract) {
      toast.error('Contract not connected. Try again…')
      return
    }

    const _result = await contractQuery(api, '', contract, 'getPoolName')
    const { output } = decodeOutput(_result, contract, 'getPoolName')
    setName(output)
    const _result2 = await contractQuery(api, '', contract, 'getPoolSize')
    const output2 = decodeOutput(_result2, contract, 'getPoolSize')
    setSize(output2.output)
    const _result3 = await contractQuery(api, '', contract, 'psp34::totalSupply')
    const output3 = decodeOutput(_result3, contract, 'psp34::totalSupply')
    setSupply(output3.output)
    const _result4 = await contractQuery(api, '', contract, 'ownable::owner')
    const output4 = decodeOutput(_result4, contract, 'ownable::owner')
    setOwner(output4.output)

    setFetchIsLoading(false)
  }

  const handleButtonClick = (title: string) => {
    setShowModal(true)
    setModalContent({ title })
  }

  useEffect(() => {
    fetchPools()
  }, [])

  return (
    <>
      <HomeTopBar />
      <div tw="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 tw="mb-2 font-semibold text-4xl text-emerald-700">Pool Interaction</h1>

        <div tw="mb-6 p-4 lg:w-1/3">
          <div tw="relative h-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-b bg-opacity-75 from-emerald-600 to-emerald-800 px-8 pt-16 pb-24 text-center transition-all duration-300 hover:scale-105">
            <h1 tw="mb-3 font-medium text-8xl text-white">
              ${fetchIsLoading ? '..' : Number(size.replaceAll(',', '')) / 10 ** 12}
            </h1>
            <p tw="text-white leading-10 tracking-widest">{fetchIsLoading ? 'Loading..' : name}</p>
          </div>
        </div>

        <div tw="mb-6 w-1/3">
          <table tw="min-w-full overflow-hidden rounded-xl bg-white">
            <tbody tw="text-gray-700">
              <tr>
                <td tw="border-b px-4 py-3">Cards Issued</td>
                <td tw="border-b px-4 py-3">{fetchIsLoading ? 'Loading..' : supply}</td>
              </tr>
              <tr>
                <td tw="border-b px-4 py-3">Owner</td>
                <td tw="border-b px-4 py-3">{fetchIsLoading ? 'Loading..' : owner}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div tw="mb-6 flex w-1/3 justify-between">
          <button
            tw="rounded bg-emerald-600 py-2 px-4 font-bold text-white hover:bg-emerald-700 focus:(outline-none outline-emerald-50)"
            onClick={() => handleButtonClick('Add Funds')}
          >
            Add Funds
          </button>
          <button
            tw="rounded bg-emerald-600 py-2 px-4 font-bold text-white hover:bg-emerald-700 focus:(outline-none outline-emerald-50)"
            onClick={() => handleButtonClick('Issue Card')}
          >
            Issue Card
          </button>
        </div>

        {showModal && (
          <div tw="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            {modalContent.title == 'Add Funds' ? (
              <div tw="rounded-lg bg-white p-6">
                <h2 tw="mb-4 text-emerald-700">Add Funds</h2>
                <input
                  type="number"
                  value={funds}
                  onChange={(e) => setFunds(Number(e.target.value))}
                  tw="mb-4 w-full rounded border px-4 py-2 text-black"
                />
                <div tw="flex justify-between">
                  <button
                    tw="rounded bg-emerald-600 py-2 px-4 font-bold text-white hover:bg-emerald-700 focus:(outline-none outline-emerald-50)"
                    onClick={addFundsTx}
                  >
                    {fetchIsLoading ? 'Loading..' : 'Add'}
                  </button>
                  <button
                    tw="py-2 px-4 font-bold text-emerald-700 focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div tw="rounded-lg bg-white p-6">
                <h4 tw="mb-2 text-emerald-900">Address:</h4>
                <input
                  type="text"
                  value={benef}
                  onChange={(e) => setBenef(e.target.value)}
                  placeholder={'Beneficiary Address'}
                  tw="mb-4 w-full rounded border px-4 py-2 text-black"
                />
                <h4 tw="mb-2 text-emerald-900">Card Name:</h4>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder={'Name of the Card'}
                  tw="mb-4 w-full rounded border px-4 py-2 text-black"
                />
                <h4 tw="mb-2 text-emerald-900">Validity:</h4>
                <input
                  type="number"
                  min={1}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  placeholder={'Enter number of Days'}
                  tw="mb-4 w-full rounded border px-4 py-2 text-black"
                />
                <h4 tw="mb-2 text-emerald-900">Spend Limit:</h4>
                <input
                  type="number"
                  min={1}
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  placeholder={'Max Limit in $'}
                  tw="mb-4 w-full rounded border px-4 py-2 text-black"
                />
                <div tw="flex justify-between">
                  <button
                    tw="rounded bg-emerald-600 py-2 px-4 font-bold text-white hover:bg-emerald-700 focus:(outline-none outline-emerald-50)"
                    onClick={issueCardTx}
                  >
                    {fetchIsLoading ? 'Loading..' : 'Issue'}
                  </button>
                  <button
                    tw="py-2 px-4 font-bold text-emerald-700 focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Interaction
