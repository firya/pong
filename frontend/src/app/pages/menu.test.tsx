import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import AppRouter from "../router";

it("render menu and second level works", () => {
	render(<AppRouter />);
	const button = screen.getByText(/singleplayer/i);

	expect(button).toBeInTheDocument();

	act(() => {
		button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});

	const secondLevelButton = screen.getByText(/arcanoid/i);

	expect(secondLevelButton).toBeInTheDocument();
});
