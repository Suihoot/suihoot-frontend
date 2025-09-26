import { TODO_MODULE } from "@/config/constants";
import { enokiClient } from "@/lib/enoki";
import { suiClient } from "@/lib/suiClient";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64, toBase64 } from "@mysten/sui/utils";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const listId = "0x00e7fba1dd5004d4718788cd1f17d8a6aa6df14bfa71c8e410c57545c8a4922e";
const todoItem = "My first todo item";
const keypair = Ed25519Keypair.fromSecretKey(process.env.SPONSOR_WALLET_PRIVATE_KEY!);

export async function POST(req: Request) {
  const { recipient } = await req.json();
  if (!recipient) {
    return new Response("Missing parameters", { status: 400 });
  }

  const tx = new Transaction();
  tx.moveCall({
    target: `${TODO_MODULE}::todo_list::add`,
    arguments: [tx.object(listId), tx.pure.string(todoItem)],
  });

  const txBytes = await tx.build({
    client: suiClient,
    onlyTransactionKind: true,
  });

  const sponsored = await enokiClient.createSponsoredTransaction({
    network: "testnet",
    transactionKindBytes: toBase64(txBytes),
    sender: keypair.getPublicKey().toSuiAddress(),
    allowedMoveCallTargets: [`${TODO_MODULE}::todo_list::add`],
    allowedAddresses: [recipient],
  });

  const { signature } = await keypair.signTransaction(fromBase64(sponsored.bytes));

  const res = await enokiClient.executeSponsoredTransaction({
    digest: sponsored.digest,
    signature,
  });

  return new Response(JSON.stringify(res), { status: 200 });
}
