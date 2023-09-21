"use client";

import { Icons } from "../lib/ui/components";
import { TransactionReceipt } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { useWalletAuth } from "../modules/wallet/hooks/useWalletAuth";
import Alert from "../lib/ui/components/Alert";

export function Transaction() {
  const { wallet, counterContract } = useWalletAuth();
  const [isTransactionLoading, setIsTransactionLoading] =
    useState<boolean>(false);
  const [transactionResponse, setTransactionResponse] =
    useState<TransactionReceipt | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionFailure, setTransactionFailure] = useState(false);
  const [nftBalance, setNftBalance] = useState<number>(0);

  function TransactionButton({
    sendTestTransaction,
    isTransactionLoading,
  }: {
    sendTestTransaction: () => Promise<void>;
    isTransactionLoading: boolean;
  }) {
    return (
      <button
        className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
        onClick={sendTestTransaction}
      >
        {isTransactionLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          "+1"
        )}
      </button>
    );
  }

  useEffect(() => {
    if (wallet) {
      (async () => {
        const balance = await counterContract!.counters(wallet.getAddress());
        setNftBalance(Number(balance));
      })();
    }
  }, []);

  const sendTestTransaction = async () => {
    setIsTransactionLoading(true);
    try {
      if (!wallet) throw new Error("No wallet instance");

      const tx = await counterContract!.count();
      const txResponse = await tx.wait();

      const balance = await counterContract!.counters(wallet.getAddress());
      setNftBalance(Number(balance));

      setTransactionResponse(txResponse);
      setTransactionSuccess(true);
    } catch (e) {
      console.log("Error:", e);
      setTransactionFailure(true);
    }

    setIsTransactionLoading(false);
  };

  return (
    <main>
      <div className="p-4">
        <div className="relative flex gap-x-6 rounded-lg p-4">
          <TransactionButton
            sendTestTransaction={sendTestTransaction}
            isTransactionLoading={isTransactionLoading}
          />
          <div>
            <p className="font-semibold text-gray-900">Counter</p>
            <p className="mt-1 text-gray-600">Actual value: {nftBalance} </p>
          </div>
        </div>
      </div>
      {transactionResponse && !transactionSuccess && (
        <Alert
          state="information"
          content="Transaction in progress !"
          link={{
            content: "Go see your transaction",
            url: `https://polygonscan.com/tx/${transactionResponse?.transactionHash}`,
          }}
        />
      )}
      {transactionSuccess && (
        <Alert
          state="success"
          content="Transaction confirmed !"
          link={{
            content: "Go see your transaction",
            url: `https://polygonscan.com/tx/${transactionResponse?.transactionHash}`,
          }}
        />
      )}
      {transactionFailure && (
        <Alert state="error" content="Transaction Failed !" />
      )}
    </main>
  );
}
