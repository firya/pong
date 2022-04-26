import { useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";

import defaultData from "../../data/default";

import styles from "./index.module.css";

import Game from "../game";

export interface ArcanoidProps {
	data?: string | null;
	size?: [number, number];
	paddle?: [number, number];
	ballRadius?: number;
}

const Arcanoid = (props: ArcanoidProps) => {
	let { data = defaultData } = props;

	const defaultLives = 3;
	const [lives, setLives] = useState<number>(defaultLives);

	//prepare array of blocks (trim empty rows)
	const parseData = useMemo((): string[][] | null => {
		return !data
			? null
			: data
					.split("\n")
					.filter((row) => row.length)
					.map((row) => row.split(""));
	}, [data]);

	const [blocksData, setBlocksData] = useState<string[][] | null>(parseData);

	const liveDecrease = (): void => {
		setLives((value) => value - 1);
	};

	useEffect(() => {
		document.body.addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault();
			},
			{ passive: false }
		);

		return () => {
			document.body.removeEventListener("touchmove", (e) => {
				e.preventDefault();
			});
		};
	}, []);

	const startOver = (): void => {
		setLives(defaultLives);
		setBlocksData(parseData);
	};

	return (
		<>
			<div className={styles.dashboard}>Lives: {lives}</div>
			{lives <= 0 && (
				<div className={styles.gameover}>
					<div className={styles.text}>Game Over</div>{" "}
					<button className={styles.button} onClick={startOver}>
						New Game
					</button>
				</div>
			)}
			<Canvas>
				<Game
					{...props}
					data={blocksData}
					lives={lives}
					type={"arcanoid"}
					livesHandler={liveDecrease}
					updateBlocks={setBlocksData}
				/>
			</Canvas>
			{}
		</>
	);
};

export default Arcanoid;
