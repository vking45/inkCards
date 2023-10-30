/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { getSupportedChains } from './getSupportedChains'
import { getURL } from './getUrl'

/**
 * Environment Variables defined in `.env.local`.
 * See `env.local.example` for documentation.
 */
export const env = {
  url: getURL(),
  isProduction: 'true',

  defaultChain: 'alephzero-testnet',
  supportedChains: getSupportedChains(),
}
