import { Icons } from "@/app/lib/ui/components";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface ConnectGoogleProps {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
}

function ConnectGoogle({ session, status }: ConnectGoogleProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  if (session) {
    return (
      <button
        className="flex items-center justify-center gap-x-2.5 p-3 font-semibol text-gray-900 hover:bg-gray-100"
        onClick={() => signOut()}
      >
        Disconnect to {session.user?.email}
      </button>
    );
  } else {
    return (
      <button
        disabled={isLoading}
        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 disabled:bg-white"
        onClick={() => signIn("google", { callbackUrl: "/login" })}
      >
        {isLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="h-4 w-4" />
        )}
        {"Connect with Google"}
      </button>
    );
  }
}

export default ConnectGoogle;
