import { Brain } from "lucide-react";
import Link from "next/link";
import ConnectButton from "./connect-button";

export default function Header() {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Suihoot</span>
        </Link>
        <ConnectButton />
      </div>
    </header>
  );
}
