import { enokiClient } from "@/lib/enoki";

export async function POST(req: Request) {
  const { digest, signature } = await req.json();
  if (!digest || !signature) {
    return new Response("Missing parameters", { status: 400 });
  }

  const resp = await enokiClient.executeSponsoredTransaction({
    digest,
    signature,
  });

  return new Response(JSON.stringify(resp), { status: 200 });
}
