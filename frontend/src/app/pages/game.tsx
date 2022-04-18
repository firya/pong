import * as React from "react";
import { useParams } from "react-router";

export interface GameProps {}

export default (props: GameProps) => {
	const { id } = useParams();
	return <div>{id}</div>;
};
