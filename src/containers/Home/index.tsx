"use client";

import ConnectButton from "@/components/connect-button";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";

export default function HomeContainer() {
  const account = useCurrentAccount();
  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <ConnectButton />
      {account && (
        <>
          <Link href="/create">Create a Suihoot</Link>
          <Link href="/join">Join a Suihoot</Link>
        </>
      )}
    </div>
  );
}
