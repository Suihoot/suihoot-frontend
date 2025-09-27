"use client";

import { ConnectButton as ConnectButtonDappkit, useCurrentAccount } from "@mysten/dapp-kit";
import CopyButton from "./copy-button";

export default function ConnectButton() {
  const account = useCurrentAccount();

  return (
    <div className="flex gap-2 items-center">
      <ConnectButtonDappkit />
      {account ? <CopyButton textToCopy={account.address} /> : null}
    </div>
  );
}
