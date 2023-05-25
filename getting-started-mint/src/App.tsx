import React, { useState, useEffect } from "react"
import {
  AlembicWallet,
  Web3AuthAdapter,
  SendTransactionResponse
} from "@alembic/account-abstraction-sdk"

// Instantiate wallet outside of the component so it can maintain its state across re-renders
const web3AuthAdapter = new Web3AuthAdapter({
  clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID!,
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "137"
  }
})

const wallet = new AlembicWallet({
  authAdapter: web3AuthAdapter,
  apiKey: process.env.REACT_APP_ALEMBIC_API_KEY!
})

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [transactionResponse, setTransactionResponse] =
    useState<SendTransactionResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // check if the user is already logged in
  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        await wallet.getUserInfos()
        setIsLoggedIn(true)
      } catch {
        setIsLoggedIn(false)
      }
    }

    fetchUserInfos()
  }, [])

  const login = async () => {
    await wallet.connect()
    setIsLoggedIn(true)
  }

  const sendTestTransaction = async () => {
    setIsLoading(true)

    // replace these values with your test transaction values
    const tx = { to: "DESTINATION", value: "VALUE", data: "DATA" }
    const transactionResponse = await wallet.sendTransaction(tx)
    setTransactionResponse(transactionResponse)
  }

  return (
    <div>
      {!isLoggedIn ? (
        <button onClick={login}>Log in</button>
      ) : (
        <>
          <button onClick={sendTestTransaction}>Send Test Transaction</button>
          {isLoading && <p>Transaction is in progress...</p>}
          {transactionResponse && (
            <p>Transaction confirmed: {transactionResponse.safeTxHash}</p>
          )}
        </>
      )}
    </div>
  )
}

export default App
