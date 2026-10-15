import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AppRoutes } from "./routes";

function App() {
	return (
		<BrowserRouter>
			<QueryClientProvider client={new QueryClient()}>
				<Toaster position="bottom-right" richColors={true} />
				<AppRoutes />
			</QueryClientProvider>
		</BrowserRouter>
	);
}

export default App;
