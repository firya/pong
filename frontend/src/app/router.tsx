import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "./layout";

import MenuPage from "./pages/menu";
import GamePage from "./pages/game";
import Page404 from "./pages/404";
import ArcanoidPage from "./pages/arcanoid";
import PongPage from "./pages/pong";
import PongVs3Page from "./pages/pongvs3";

const RouterComponent = () => {
	return (
		<DefaultLayout>
			<Router>
				<Routes>
					<Route path="/" element={<MenuPage />} />
					<Route path="/arcanoid" element={<ArcanoidPage />} />
					<Route path="/pong/:level" element={<PongPage />} />
					<Route path="/vs3/:level" element={<PongVs3Page />} />
					<Route path="/game/:id" element={<GamePage />} />
					<Route path="/*" element={<Page404 />} />
				</Routes>
			</Router>
		</DefaultLayout>
	);
};

export default RouterComponent;
