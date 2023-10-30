import { HomeTopBar } from '@/components/home/HomeTopBar'
import { ContractIds } from '@/deployments/deployments'
import { getPoolsDeployments } from '@/deployments/poolsDeployments'
import { contractTxWithToast } from '@/utils/contractTxWithToast'
import { ContractPromise } from '@polkadot/api-contract'
import {
  contractQuery,
  decodeOutput,
  useInkathon,
  useRegisteredContract,
} from '@scio-labs/use-inkathon'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import 'twin.macro'

interface Card {
  token_id: number
  addr: string
  available: number
  limit: number
  name: string
  expiration: number
}

const SpenderScreen: NextPage = () => {
  const [cards, setCards] = useState<Card[]>([])
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [selectedCard, setSelectedCard] = useState<number>(1)
  const { api, activeAccount, activeSigner } = useInkathon()
  const { contract, address: contractAddress } = useRegisteredContract(ContractIds.Factory)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [cardForTransfer, setCardForTransfer] = useState<number | null>(null)
  const [fetchIsLoading, setFetchIsLoading] = useState<boolean>()

  const handleTransferClick = (index: number) => {
    setCardForTransfer(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCardForTransfer(null)
  }

  const handleCardClick = (index: number) => {
    setSelectedCard(index)
    console.log(cards[index])
  }

  const onSpend = async () => {
    setFetchIsLoading(true)
    if (!api || !activeAccount) {
      toast.error('API error. Try again...')
      return
    }
    const abi = await import(`@inkathon/contracts/deployments/ink_cards/ink_cards.json`)
    const _contract = new ContractPromise(api, abi, cards[selectedCard].addr)
    if (!_contract) {
      toast.error('Contract not connected. Try again…')
      return
    }
    try {
      const res = await contractTxWithToast(
        api,
        activeAccount.address,
        _contract,
        'card::spendFromCard',
        {},
        [{ u128: cards[selectedCard].token_id }, amount * 10 ** 14, walletAddress],
      )
      console.log(res)
    } catch (e) {
      console.error(e)
      setFetchIsLoading(false)
    } finally {
      setFetchIsLoading(false)
    }
  }

  const fetchCards = async () => {
    if (!contract || !api || !activeAccount) {
      // toast.error('Wallet not connected. Try again…')
      return
    }
    setFetchIsLoading(true)
    try {
      const result = await contractQuery(api, '', contract, 'getDeployedContracts')
      const { output, isError, decodedOutput } = decodeOutput(
        result,
        contract,
        'getDeployedContracts',
      )
      if (isError) throw new Error(decodedOutput)
      const pools_res = await getPoolsDeployments(output)
      const temp = []
      for (const i of pools_res) {
        const _contract = new ContractPromise(api, i.abi, i.address)
        const _result = await contractQuery(api, '', _contract, 'psp34::totalSupply')
        const { output } = decodeOutput(_result, _contract, 'psp34::totalSupply')
        console.log(output)
        const supply = Number(output)
        let count = 1
        if (supply > 0) {
          while (count <= supply) {
            const _result2 = await contractQuery(api, '', _contract, 'psp34::ownerOf', {}, [
              { u128: count },
            ])
            const _output2 = decodeOutput(_result2, _contract, 'psp34::ownerOf')
            console.log(_output2.output)
            if (_output2.output == activeAccount.address) {
              const _result3 = await contractQuery(api, '', _contract, 'card::getCardInfo', {}, [
                { u128: count },
              ])
              const _output3 = decodeOutput(_result3, _contract, 'card::getCardInfo')
              console.log(_output3.output.Ok)
              temp.push({
                token_id: count,
                addr: i.address,
                available:
                  (Number(_output3.output.Ok.spendLimit.replaceAll(',', '')) -
                    Number(_output3.output.Ok.spentAmount.replaceAll(',', ''))) /
                  10 ** 14,
                limit: Number(_output3.output.Ok.spendLimit.replaceAll(',', '')) / 10 ** 14,
                name: _output3.output.Ok.cardName,
                expiration: Number(_output3.output.Ok.expiration.replaceAll(',', '')),
              })
            }
            count += 1
          }
        }
      }
      console.log(temp)
      setCards(temp)
    } catch (e) {
      console.error(e)
      toast.error('Error while fetching cards. Try again…')
    } finally {
      setFetchIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [activeAccount])

  return (
    <>
      <HomeTopBar />
      <section tw="flex min-h-screen flex-col items-center justify-center bg-gray-200 p-5 text-gray-600">
        <div tw="container mx-auto mb-4">
          <h1 tw="mb-6 text-center font-bold text-4xl text-black">Select your card</h1>
          <div tw="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
              <div key={index}>
                <div
                  onClick={() => handleCardClick(index)}
                  tw="relative transform cursor-pointer rounded-lg border-4 border-green-500 bg-gradient-to-tr from-blue-700 to-indigo-700 p-4 text-white shadow-lg transition-transform hover:scale-105"
                >
                  <h1 tw="mb-2 font-bold text-4xl">Av. ${card.available}</h1>
                  <p tw="mb-2">Limit. ${card.limit}</p>
                  <h2 tw="font-thin text-lg tracking-widest">{card.name}</h2>
                </div>
              </div>
            ))}
            {isModalOpen && (
              <div tw="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
                <div tw="rounded bg-white p-4">
                  <h2 tw="mb-4 text-xl">Transfer Card</h2>
                  <p>Transfer for: {cardForTransfer ? cards[cardForTransfer].name : ''}</p>
                  <input
                    type="text"
                    placeholder="Enter wallet address"
                    tw="mt-2 w-full rounded border px-2 py-1"
                  />
                  <div tw="mt-4 flex justify-end">
                    <button
                      tw="mr-2 rounded bg-green-500 px-4 py-2 text-white"
                      onClick={closeModal}
                    >
                      Transfer
                    </button>
                    <button tw="rounded bg-red-500 px-4 py-2 text-white" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div tw="container mx-auto rounded-lg bg-white p-10 shadow-xl">
          <h1 tw="mb-6 text-center font-bold text-4xl text-gray-900">Enter Wallet Address</h1>
          <div tw="flex flex-col items-center">
            <input
              type="text"
              placeholder="Your Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              tw="w-full rounded border py-2 px-3 text-gray-700 leading-tight focus:(border-indigo-500 outline-none)"
            />
            <input
              type="number"
              placeholder="Your Amount"
              value={amount}
              min={1}
              onChange={(e) => setAmount(Number(e.target.value))}
              tw="w-full rounded border py-2 px-3 text-gray-700 leading-tight focus:(border-indigo-500 outline-none)"
            />
            <button
              tw="mt-4 rounded bg-blue-700 py-2 px-4 font-bold text-white hover:bg-blue-800"
              onClick={onSpend}
            >
              {fetchIsLoading ? 'Loading..' : 'Spend'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default SpenderScreen
