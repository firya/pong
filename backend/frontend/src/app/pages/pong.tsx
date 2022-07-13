import { useParams } from "react-router";

import Pong from "../components/pong";

import { Difficulties } from "../components/game";

const PongPage = () => {
	let { level = "Normal" } = useParams();

	level = level.charAt(0).toUpperCase() + level.slice(1);

	return (
		<Pong
			difficulty={Difficulties[level as keyof typeof Difficulties]}
			type={"vs1"}
		/>
	);
};

export default PongPage;
