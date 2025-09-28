import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useCallback, useState } from "react";
import useSealClient from "./useSealClient";
import { fromHex } from "@mysten/sui/utils";
import { Question } from "@/types";
import { ROOM_MODULE } from "@/config/constants";
import { WalrusFile } from "@mysten/walrus";
import useWalrusClient from "./useWalrusClient";
import { Transaction } from "@mysten/sui/transactions";
import { parseTransactionBcs, parseTransactionEffectsBcs } from "@mysten/sui/experimental";

interface useCreateSuihootProps {
  questions: Question[];
}

export default function useCreateSuihoot({ questions }: useCreateSuihootProps) {
  const [loading, setLoading] = useState(false);
  const { sealClient } = useSealClient();
  const account = useCurrentAccount();
  const { walrusClient } = useWalrusClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const handleCreate = useCallback(async () => {
    if (!account || !sealClient || !walrusClient) return;

    try {
      setLoading(true);
      // 1) Encrypt + upload each question to Walrus, collect blob ids
      const walrusIds: string[] = [];

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        // Encrypt the JSON-encoded question with Seal
        const encoded = new TextEncoder().encode(JSON.stringify(q));
        const { encryptedObject: encryptedBytes /*, key: backupKey */ } = await sealClient.encrypt({
          threshold: 2,
          packageId: ROOM_MODULE, // your published package id (as string)
          id: account.address, // policy id (per Seal docs)
          data: encoded,
        });

        // Prepare a Walrus file with encrypted bytes
        const file = WalrusFile.from({
          contents: encryptedBytes,
          identifier: `question-${i}.json`,
        });

        // Write flow: encode -> register -> upload -> certify
        const flow = walrusClient.writeFilesFlow({ files: [file] });
        await flow.encode();

        const registerTx = flow.register({
          epochs: 3,
          owner: account.address,
          deletable: true,
        });
        const { digest } = await signAndExecute({ transaction: registerTx });

        await flow.upload({ digest });

        const certifyTx = flow.certify();
        await signAndExecute({ transaction: certifyTx });

        // IMPORTANT: listFiles() returns an array; grab the first item's id
        const uploaded = await flow.listFiles();
        if (!uploaded.length || !uploaded[0]?.id) {
          throw new Error("Walrus returned no id for uploaded file");
        }
        walrusIds.push(uploaded[0].blobId); // this is the blob id string
      }

      // 2) Build the PTB
      const tx = new Transaction();

      // 2a) Create EncryptedQuestion values ON-CHAIN using your helper
      const encryptedQuestionArgs = walrusIds.map((idStr) =>
        tx.moveCall({
          target: `${ROOM_MODULE}::room::new_encrypted_question`,
          arguments: [tx.pure.string(idStr)], // EncryptedQuestion { walrus_hash: String }
        })
      );

      // 2b) Make vector<EncryptedQuestion> from the returned args
      const encryptedQuestionsVec = tx.makeMoveVec({
        type: `${ROOM_MODULE}::room::EncryptedQuestion`,
        elements: encryptedQuestionArgs, // <-- NOT strings; these are TransactionArguments
      });

      // --- OPTION A: use your convenience function (recommended) ---
      tx.moveCall({
        target: `${ROOM_MODULE}::room::create_room_and_cap`,
        arguments: [
          tx.pure.string("Suihoot Room"),
          tx.pure.string("Room created via Suihoot"),
          encryptedQuestionsVec,
          tx.pure.u64(50),
          tx.object("0x6"), // &Clock (system object). If your SDK has tx.object.clock(), you can use that too.
        ],
      });

      // 3) Execute
      const txOutput = await signAndExecute({ transaction: tx });
      console.log("Transaction output:", txOutput);

      return { digest: txOutput.digest, roomId: 0, walrusBlobIds: walrusIds }; // TODO: extract and return actual roomId from effects
    } catch (err) {
      console.error("Error creating room:", err);
    } finally {
      setLoading(false);
    }
  }, [account, questions, sealClient, signAndExecute, walrusClient]);

  return { handleCreate, loading };
}
