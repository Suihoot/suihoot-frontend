import { SPONSOR_WALLET_ADDRESS } from "@/config/constants";
import { enokiClient } from "@/lib/enoki";
import { toBase64 } from "@mysten/sui/utils";

export async function POST(req: Request) {
  const { recipient, txBytes } = await req.json();
  if (!recipient || !txBytes) {
    return new Response("Missing parameters", { status: 400 });
  }

  const resp = await enokiClient.createSponsoredTransaction({
    network: "testnet",
    transactionKindBytes: toBase64(Uint8Array.from(atob(txBytes), (c) => c.charCodeAt(0))),
    sender: SPONSOR_WALLET_ADDRESS,
    allowedMoveCallTargets: ["0x2::kiosk::set_owner_custom"],
    allowedAddresses: [recipient],
  });

  return new Response(JSON.stringify(resp), { status: 200 });
}
