import { ToastContainer } from 'react-toastify';
import AppRoutes from './AppRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
