import * as React from "react";
import { useParams } from "react-router";

export interface GameProps {}

const GamePage = (props: GameProps) => {
	const { id } = useParams();
	return <>{id}</>;
};

export default GamePage;
