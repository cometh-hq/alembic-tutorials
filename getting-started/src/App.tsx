import {
  AlembicProvider,
  AlembicWallet,
  BurnerWalletAdaptor,
  WebAuthnAdaptor
} from '@alembic/account-abstraction-sdk'
import { TransactionReceipt } from '@ethersproject/providers'
import { Box, Button, CircularProgress, Link, TextField } from '@mui/material'
import { ethers } from 'ethers'
import React, { useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

import TestNFTAbi from './SimpleTestNFT.json'

if (import.meta.env.VITE_APP_ALEMBIC_API_KEY === undefined) {
  throw new Error(
    'Please set the VITE_APP_ALEMBIC_API_KEY environment variables'
  )
}

const TEST_NFT_CONTRACT_ADDRESS = '0x533d23Cd30BAEdF1F2ea599b7e1D087575a236FF'

// Instantiate wallet outside of the component so it can maintain its state across re-renders

const wallet = new AlembicWallet({
  authAdapter: new WebAuthnAdaptor(
    '0x13881',
    import.meta.env.VITE_APP_ALEMBIC_API_KEY
  ),
  apiKey: import.meta.env.VITE_APP_ALEMBIC_API_KEY
})

const provider = new AlembicProvider(wallet)

const style = {
  button: {
    backgroundColor: 'rgb(34, 139, 230)',
    color: 'white',
    padding: '12px 26px',
    fontWeight: 600,
    marginBottom: '30px'
  },
  nftBalance: { fontWeight: 600, marginBottom: '20px' },
  link: {
    lineHeight: '25px',
    color: 'rgb(34, 139, 230)'
  }
}

function LoginButton({
  login,
  isLoggingIn
}: {
  login: () => Promise<void>
  isLoggingIn: boolean
}) {
  return (
    <Button
      style={style.button}
      sx={{
        '&:hover': {
          filter: `brightness(90%)`,
          cursor: 'pointer'
        }
      }}
      onClick={login}
    >
      {isLoggingIn && (
        <CircularProgress
          size="24px"
          sx={{
            marginRight: '20px'
          }}
          color="inherit"
        />
      )}
      Connect your Wallet
    </Button>
  )
}

function TransactionButton({
  sendTestTransaction,
  isTransactionLoading
}: {
  sendTestTransaction: () => Promise<void>
  isTransactionLoading: boolean
}) {
  return (
    <Button
      style={style.button}
      sx={{
        '&:hover': {
          filter: `brightness(90%)`,
          cursor: 'pointer'
        }
      }}
      onClick={sendTestTransaction}
    >
      {isTransactionLoading && (
        <CircularProgress
          size="24px"
          sx={{
            marginRight: '20px'
          }}
          color="inherit"
        />
      )}
      Send Transaction
    </Button>
  )
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false)
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionReceipt | null>(null)
  const [transactionSuccess, setTransactionSuccess] = useState(false)
  const [transactionFailure, setTransactionFailure] = useState(false)
  const [nftContract, setNftContract] = useState<ethers.Contract | null>(null)
  const [nftBalance, setNftBalance] = useState<number>(0)
  const [username, setUsername] = useState('')
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  const login = async () => {
    setIsLoggingIn(true)
    await wallet.connect(username)
    setIsLoggingIn(false)
    setIsLoggedIn(true)
    const contract = new ethers.Contract(
      TEST_NFT_CONTRACT_ADDRESS,
      TestNFTAbi.abi,
      provider.getSigner()
    )
    setNftContract(contract)

    const balance = await contract.balanceOf(wallet.getAddress())
    setNftBalance(balance.toString())
  }

  const sendTestTransaction = async () => {
    setIsTransactionLoading(true)
    try {
      const tx = await nftContract!.mint()
      const txResponse = await tx.wait()

      const balance = await nftContract!.balanceOf(wallet.getAddress())
      setNftBalance(balance.toString())

      setTransactionResponse(txResponse)
      setTransactionSuccess(true)
    } catch (e) {
      console.log('Error:', e)
      setTransactionFailure(true)
    }

    setIsTransactionLoading(false)
  }

  const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  return (
    <Box
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {transactionSuccess && (
        <Confetti width={windowWidth} height={windowHeight} />
      )}

      {!isLoggedIn ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            label="Enter your name"
            variant="outlined"
            value={username}
            onChange={changeUsername}
          />
          <LoginButton login={login} isLoggingIn={isLoggingIn}></LoginButton>
        </div>
      ) : (
        <>
          <Box style={style.nftBalance}>NFT Balance: {nftBalance}</Box>
          <TransactionButton
            sendTestTransaction={sendTestTransaction}
            isTransactionLoading={isTransactionLoading}
          ></TransactionButton>
          {transactionResponse && <p>Transaction confirmed !</p>}
        </>
      )}
      {transactionSuccess && (
        <Link
          style={style.link}
          sx={{
            '&:hover': {
              filter: `brightness(60%)`,
              cursor: 'pointer'
            }
          }}
          rel="noopener noreferrer"
          href={`https://mumbai.polygonscan.com/tx/${transactionResponse?.transactionHash}`}
          target="_blank"
        >
          Go see your transaction
        </Link>
      )}
      {transactionFailure && <p>Transaction Failed !</p>}
    </Box>
  )
}

export default App
