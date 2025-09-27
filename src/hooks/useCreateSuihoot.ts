import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import axios from "axios";
import { useCallback } from "react";
import useSealClient from "./useSealClient";
import { fromHex } from "@mysten/sui/utils";
import { Question } from "@/types";
import { ROOM_MODULE } from "@/config/constants";
import { WalrusFile } from "@mysten/walrus";
import useWalrusClient from "./useWalrusClient";

interface useCreateSuihootProps {
  questions: Question[];
}

export default function useCreateSuihoot({ questions }: useCreateSuihootProps) {
  const suiClient = useSuiClient();
  const { sealClient } = useSealClient();
  const account = useCurrentAccount();
  const { walrusClient } = useWalrusClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const handleCreate = useCallback(async () => {
    if (!account || !sealClient || !walrusClient) return;

    try {
      // turn questions into Uint8Array<ArrayBufferLike>
      const questionsData = new TextEncoder().encode(JSON.stringify(questions));
      console.log("Questions data:", questionsData);
      const [file1] = await walrusClient.getFiles({ ids: ["lwkRL4pzTx3t6k490hhf14qt70H4eTDwl_Uo_sSP2eo"] });
      console.log("okudum: ", await file1.json());

      const files = await Promise.all(
        questions.map(async (q, i) => {
          try {
            const encodedQuestion = new TextEncoder().encode(JSON.stringify(q));
            const { encryptedObject: encryptedBytes, key: backupKey } = await sealClient.encrypt({
              threshold: 2,
              packageId: ROOM_MODULE,
              id: "0x7",
              data: encodedQuestion,
            });
            console.log(1);

            const file1 = WalrusFile.from({
              contents: encryptedBytes,
              identifier: `question-${i}.json`,
            });
            console.log(2);

            const flow = walrusClient.writeFilesFlow({
              files: [file1],
            });
            console.log(3);

            await flow.encode();

            const registerTx = flow.register({
              epochs: 3,
              owner: account.address,
              deletable: true,
            });
            console.log(4);

            const { digest } = await signAndExecute({ transaction: registerTx });

            await flow.upload({ digest });

            const certifyTx = flow.certify();
            await signAndExecute({ transaction: certifyTx });

            const files = await flow.listFiles();
            console.log("Uploaded files", files);
            return files;
          } catch (error) {
            console.error("Error uploading question:", error);
            throw error;
          }
        })
      );

      console.log("All uploaded files:", files);

      // save encryptedbytes on walrus

      // save walrus hash on sui blockchain
      // {
      //   const createResponse = await axios.post("/api/create-suihoot", {
      //     recipient: account.address,
      //   });
      // }

      return {
        digest: "",
        roomId: 0,
      };
    } catch (error) {
      console.error("Error creating todo item:", error);
    }
  }, [account]);

  return { handleCreate };
}
