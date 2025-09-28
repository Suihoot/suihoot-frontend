"use client";

import { Brain, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConnectButton from "@/components/connect-button";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function LandingPage() {
  const router = useRouter();
  const account = useCurrentAccount();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 justify-center">
          <h1 className="text-7xl font-bold text-balance">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Decentralized Knowledge Arena
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Compete in cryptographically secured quiz battles. Test your knowledge, earn rewards, and climb the
            leaderboards in the ultimate decentralized gaming experience.
          </p>

          {account ? (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground self-center"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          ) : (
            <ConnectButton />
          )}
        </div>
      </section>
    </div>
  );
}
