import { ToastContainer } from "react-toastify";
import AppRoutes from "./AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./Context/AuthContext";
import SessionTimeoutHandler from "./CommonComponents/SessionTimeoutHandler";
import { ThemeModeProvider } from "./Context/ThemeContext";
import ThemeConfig from "./Context/ThemeConfig";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <ThemeConfig>
          <AuthProvider>
            <ToastContainer />
            <AppRoutes />
            <SessionTimeoutHandler />
          </AuthProvider>
        </ThemeConfig>
      </ThemeModeProvider>
    </QueryClientProvider>
  );
}

export default App;
