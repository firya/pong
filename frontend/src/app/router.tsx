import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "./layout";

import Menu from "./pages/menu";
import Game from "./pages/game";
import Page404 from "./pages/404";

export default () => {
	return (
		<DefaultLayout>
			<Router>
				<Routes>
					<Route path="/" element={<Menu />} />
					<Route path="/game/:id" element={<Game />} />
					<Route path="/*" element={<Page404 />} />
				</Routes>
			</Router>
		</DefaultLayout>
	);
};
