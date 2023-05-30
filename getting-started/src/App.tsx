import {
  AlembicProvider,
  AlembicWallet,
  BurnerWalletAdaptor
} from '@alembic/account-abstraction-sdk'
import { TransactionReceipt } from '@ethersproject/providers'
import { ethers } from 'ethers'
import React, { useState } from 'react'

import TestNFTAbi from './SimpleTestNFT.json'

if (
  import.meta.env.VITE_APP_WEB3AUTH_CLIENT_ID === undefined ||
  import.meta.env.VITE_APP_ALEMBIC_API_KEY === undefined
) {
  throw new Error(
    'Please set the VITE_APP_WEB3AUTH_CLIENT_ID and VITE_APP_ALEMBIC_API_KEY environment variables'
  )
}

const TEST_NFT_CONTRACT_ADDRESS = '0x19853EDBc0eeC74994B70d78c959D0426Ff53116'

// Instantiate wallet outside of the component so it can maintain its state across re-renders
const walletAdaptor = new BurnerWalletAdaptor('0x89')

const wallet = new AlembicWallet({
  authAdapter: walletAdaptor,
  apiKey: import.meta.env.VITE_APP_ALEMBIC_API_KEY
})

const provider = new AlembicProvider(wallet)

function LoginButton({
  login,
  isLoggingIn
}: {
  login: () => Promise<void>
  isLoggingIn: boolean
}) {
  return isLoggingIn ? (
    <span>Logging in...</span>
  ) : (
    <button onClick={login}>Log in</button>
  )
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionReceipt | null>(null)
  const [sendingTransactionText, setSendingTransactionText] = useState<
    string | null
  >(null)

  const login = async () => {
    setIsLoggingIn(true)
    await wallet.connect()
    console.log(wallet.getAddress())
    setIsLoggingIn(false)
    setIsLoggedIn(true)
  }

  const sendTestTransaction = async () => {
    setSendingTransactionText('Sending transaction...')

    const nftContract = new ethers.Contract(
      TEST_NFT_CONTRACT_ADDRESS,
      TestNFTAbi.abi,
      provider.getSigner()
    )

    const tx = await nftContract.mint()
    const txResponse = await tx.wait()

    setSendingTransactionText(null)
    setTransactionResponse(txResponse)
  }

  return (
    <div>
      {!isLoggedIn ? (
        <LoginButton login={login} isLoggingIn={isLoggingIn}></LoginButton>
      ) : (
        <>
          <button onClick={sendTestTransaction}>Send Test Transaction</button>
          {sendingTransactionText && <p>{sendingTransactionText}</p>}
          {transactionResponse && (
            <p>Transaction confirmed: {JSON.stringify(transactionResponse)}</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
