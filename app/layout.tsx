"use client";

import { Metadata } from "next";
import { Toaster } from "sonner";
import { Suspense } from "react";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';

import {
  createConfig,
  WagmiProvider,
  useAccount,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

const config = createConfig({
  chains: [polygon, polygonAmoy],
  multiInjectedProviderDiscovery: false,
  transports: {
    [polygon.id]: http(),
    [polygonAmoy.id]: http()
  },
});


import "./globals.css";

const queryClient = new QueryClient();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
        
        <body className="antialiased">
          <DynamicContextProvider
              settings={{
              environmentId: "5651dbc5-c967-4735-af7e-615c32936167",
              walletConnectors: [EthereumWalletConnectors]
              }}
          >
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                <DynamicWagmiConnector>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <Suspense>

                    
                    <Toaster position="top-center" />
                    <Navbar />
                    {children}
                    </Suspense>
                  </ThemeProvider>
                </DynamicWagmiConnector>
              </QueryClientProvider>
            </WagmiProvider>
          </DynamicContextProvider>
        </body>
    </html>
  );
}
