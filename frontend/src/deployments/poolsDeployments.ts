/**
 * Add or change your custom contract ids here
 * DOCS: https://github.com/scio-labs/inkathon#2-custom-contracts
 */

export const getPoolsDeployments = async (poolsList: []) => {
  const deployments = []

  for (const contractId in poolsList) {
    const abi = await import(`@inkathon/contracts/deployments/ink_cards/ink_cards.json`)
    const address = poolsList[contractId]

    deployments.push({ contractId, abi, address })
  }

  return deployments
}
