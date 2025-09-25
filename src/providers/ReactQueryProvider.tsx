"use client";

import { queryClient } from "@/lib/queyClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default ReactQueryProvider;
