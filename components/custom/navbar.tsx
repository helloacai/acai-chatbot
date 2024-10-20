'use client';

import Link from "next/link";

// import { auth, signOut } from "@/app/(auth)/auth";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  useAccount
} from 'wagmi';

import { DynamicWidget } from "@dynamic-labs/sdk-react-core";





export const Navbar = async () => {

  const { address, isConnected, chain } = useAccount();

  return (
    <>
      <div className="bg-background absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-3 items-center">
          <div className="flex flex-row gap-2 items-center">
            <div className="ml-4 font-bold text-md dark:text-zinc-300">👋 ACAI</div>
          </div>
        </div>
          <DynamicWidget></DynamicWidget>
          <Button disabled={!isConnected} onClick={()=> window.open(`https://pay.coinbase.com/buy/select-asset?appId=95708cb6-069f-44cb-b3f7-fd3028c842f0&addresses={"${address}":["polygon"]}`)}>
            Add Funds
          </Button>
      </div>
    </>
  );
};
