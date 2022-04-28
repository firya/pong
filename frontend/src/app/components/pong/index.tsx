import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";

import defaultData from "../../data/default";

import Game from "../game";
import { Difficulties, PlayerColors } from "../game";

interface ArcanoidProps {
	difficulty: Difficulties;
	players?: 2 | 4;
	defaultLives?: number;
	size?: [number, number];
}

const Arcanoid = (props: ArcanoidProps) => {
	const {
		defaultLives = 1,
		players = 2,
		size = [100, 160],
		difficulty,
	} = props;
	const [lives, setLives] = useState<number[]>(
		Array(players).fill(defaultLives)
	);
	const [win, setWin] = useState<boolean>(false);

	const liveDecrease = (player: number): void => {
		const newLives = [...lives];
		newLives[player]--;
		setLives(newLives);
	};

	const startOver = (): void => {
		setLives(Array(players).fill(defaultLives));
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
					type={players === 2 ? "vs1" : "vs3"}
					lives={lives}
					size={size}
					difficulty={difficulty}
					livesHandler={liveDecrease}
					winHandler={setWin}
				/>
			</Canvas>
			{}
		</>
	);
};

export default Arcanoid;
