"use client";

import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";

export default function DashboardContainer() {
  const router = useRouter();
  const account = useCurrentAccount();

  const handleCreateRoom = () => {
    router.push("/create-room");
  };

  const handleJoinRoom = () => {
    router.push("/join-room");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, <span className="text-primary">{formatAddress(account?.address || "")}</span>!
          </h1>
          <p className="text-xl text-muted-foreground">What would you like to do today?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card
            className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={handleCreateRoom}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Create a Room</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Set up your own quiz room with custom questions and invite players to compete
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Create custom questions</li>
                <li>• Configure prize pools</li>
                <li>• Invite friends</li>
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Start Creating</Button>
            </CardContent>
          </Card>

          <Card
            className="glass border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={handleJoinRoom}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Join a Room</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Enter a room code to join an existing quiz battle and compete with other players
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Join live battles</li>
                <li>• Compete for rewards</li>
                <li>• Climb leaderboards</li>
              </ul>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Join Battle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
