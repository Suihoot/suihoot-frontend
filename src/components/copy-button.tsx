"use client";

import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface CopyButtonProps {
  textToCopy: string;
}

export default function CopyButton({ textToCopy }: CopyButtonProps) {
  const [clicked, setClicked] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setClicked(true);
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <CopyIcon className="size-4 cursor-pointer" onClick={onCopy} />
      </TooltipTrigger>
      <TooltipContent>{clicked ? "Copied!" : "Copy address"}</TooltipContent>
    </Tooltip>
  );
}
