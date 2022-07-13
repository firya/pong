import { useState, useEffect } from "react";
import { useParams } from "react-router";
import socketIOClient, { Socket } from "socket.io-client";

import Pong from "../components/pong";

const GamePage = () => {
	let { id } = useParams();
	const ENDPOINT = `${window.location.hostname}:8088`;
	const [socket, setSocket] = useState<Socket>(null!);
	const [start, setStart] = useState<boolean>(false);
	const [full, setFull] = useState<boolean>(false);
	const [player, setPlayer] = useState<"first" | "second" | undefined>(
		undefined
	);

	useEffect(() => {
		const newSocket = socketIOClient(ENDPOINT);

		newSocket.emit("join", id);

		newSocket.on("player", (val: "first" | "second"): void => {
			setPlayer(val);
		});

		newSocket.on("start", (val: boolean): void => {
			setStart(val);
		});

		newSocket.on("full", (val: boolean): void => {
			setStart(val);
		});

		newSocket.on("wait", (): void => {
			setStart(false);
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	return (
		<>
			{full ? (
				<div className="alert">Room is full</div>
			) : start ? (
				<Pong type={"multiplayer"} player={player} socket={socket} />
			) : (
				<div className="alert">Waiting for the second player...</div>
			)}
		</>
	);

	//
};

export default GamePage;
