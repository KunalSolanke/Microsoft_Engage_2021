import React from "react";
import Router from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";

/**React query client api provider */
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
