import { Inter } from "next/font/google";
import "./lib/ui/globals.css";
import { AuthProvider } from "@/app/auth/services/context";
import { WalletProvider } from "./wallet/services/context";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WalletProvider>{children}</WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
