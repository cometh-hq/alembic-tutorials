import { Icons } from "@/app/lib/ui/components";
import { useEffect, useState } from "react";

interface ConnectWalletProps {
  connectionError: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
}

function ConnectWallet({
  connectionError,
  isConnecting,
  isConnected,
  connect,
}: ConnectWalletProps): JSX.Element {
  const getTextButton = () => {
    if (isConnected) {
      return (
        <>
          <Icons.logo className="mr-2 h-6 w-6" />
          {"Connected"}
        </>
      );
    } else if (isConnecting) {
      return (
        <>
          <Icons.spinner className="h-6 w-6 animate-spin" />
          {"Waiting connection..."}
        </>
      );
    } else {
      return "Connect your Wallet";
    }
  };

  return (
    <>
      {!connectionError ? (
        <button
          disabled={isConnecting || isConnected || !!connectionError}
          className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 disabled:bg-white"
          onClick={connect}
        >
          {getTextButton()}
        </button>
      ) : (
        <p className="flex items-center justify-center text-gray-900 bg-red-50">
          Connection denied
        </p>
      )}
    </>
  );
}

export default ConnectWallet;
