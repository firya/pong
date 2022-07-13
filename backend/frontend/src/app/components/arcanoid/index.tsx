import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";

import defaultData from "../../data/default";

import Game from "../game";

interface ArcanoidProps {
	data: string;
	defaultLives?: number;
}

const Arcanoid = (props: ArcanoidProps) => {
	const { data = defaultData, defaultLives = 3 } = props;
	const [lives, setLives] = useState<number[]>([defaultLives]);
	const [win, setWin] = useState<boolean>(false);

	//prepare array of blocks (trim empty rows)
	const parseData = useMemo((): string[][] | null => {
		return data
			? data
					.split("\n")
					.filter((row) => row.length)
					.map((row) => row.split(""))
			: null;
	}, [data]);

	const [blocksData, setBlocksData] = useState<string[][] | null>(parseData);

	const liveDecrease = (player: number): void => {
		const newLives: number[] = [...lives];
		newLives[player]--;
		setLives(newLives);
	};

	const startOver = (): void => {
		setLives([defaultLives]);
		setBlocksData(parseData);
		setWin(false);
	};

	return (
		<>
			<div className="dashboard">Lives: {lives[0]}</div>
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
					data={blocksData}
					type={"arcanoid"}
					lives={lives}
					livesHandler={liveDecrease}
					winHandler={setWin}
					updateBlocks={setBlocksData}
				/>
			</Canvas>
			{}
		</>
	);
};

export default Arcanoid;
