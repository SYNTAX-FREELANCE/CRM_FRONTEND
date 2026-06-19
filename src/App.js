import { ToastContainer } from "react-toastify";
import AppRoutes from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastContainer />
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
