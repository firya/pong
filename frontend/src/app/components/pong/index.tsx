import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Socket } from "socket.io-client";

import Game from "../game";
import { Difficulties, PlayerColors } from "../game";
import { debug } from "console";

interface ArcanoidProps {
	difficulty?: Difficulties;
	players?: 2 | 4;
	player?: "first" | "second";
	defaultLives?: number;
	size?: [number, number];
	socket?: Socket | null;
	type?: "arcanoid" | "vs1" | "vs3" | "multiplayer";
}

const Arcanoid = (props: ArcanoidProps) => {
	const {
		defaultLives = 3,
		player = "first",
		players = 2,
		size = [100, 160],
		difficulty = Difficulties.Normal,
		type = "vs1",
		socket = null,
	} = props;
	const defaultLeavesArray: number[] = Array(players).fill(defaultLives);
	const [lives, setLives] = useState<number[]>(defaultLeavesArray);
	const [win, setWin] = useState<boolean>(false);

	useEffect(() => {
		if (socket) {
			if (type === "multiplayer" && player === "second") {
				socket.on("updatelives", (value) => {
					setLives(value);
				});
				socket.on("winhandler", () => {
					setWin(true);
				});
			}
			socket.on("newgame", () => {
				setLives(defaultLeavesArray);
				setWin(false);
			});
		}

		return () => {
			if (socket) {
				socket.off("updatelives");
				socket.off("newgame");
			}
		};
	}, []);

	const liveDecrease = (p: number): void => {
		const newLives: number[] = [...lives];

		newLives[p]--;
		setLives(newLives);
		if (socket) {
			socket.emit("updatelives", newLives);
		}
	};

	const startOver = (): void => {
		setLives(defaultLeavesArray);
		if (socket) {
			socket.emit("updatelives", defaultLeavesArray);
			socket.emit("newgame");
		}
		setWin(false);
	};

	return (
		<>
			<div className="dashboard">
				{lives.map((live, i) => (
					<span key={`live_${i}`} style={{ color: PlayerColors[i] }}>
						{live}
					</span>
				))}
			</div>
			{(lives.some((live) => live <= 0) || win) && (
				<div className="gameover">
					<div className="h1">{win ? "You win!" : "Game Over"}</div>
					<button className="button" onClick={startOver}>
						New Game
					</button>
				</div>
			)}
			<Canvas id="canvas">
				<Game
					type={type}
					lives={lives}
					size={size}
					player={player}
					difficulty={difficulty}
					livesHandler={liveDecrease}
					winHandler={setWin}
					socket={socket}
				/>
			</Canvas>
			{}
		</>
	);
};

export default Arcanoid;
