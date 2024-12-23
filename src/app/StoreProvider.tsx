"use client";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
