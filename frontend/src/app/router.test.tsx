import { createRoot } from "react-dom/client";

import AppRouter from "./router";

it("renders without crashing", () => {
	const container = document.createElement("root");
	const root = createRoot(container);
	root.render(<AppRouter />);
});
