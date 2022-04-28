import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useEffect, useRef, useState, useMemo } from "react";

import Field from "../field";
import Camera from "../camera";
import Paddle from "../paddle";
import Ball from "../ball";
import Boundaries from "../boundaries";
import Blocks from "../blocks";

import { checkBallBlockCollision } from "../../utils";

import sound from "../../data/pong.wav";
import { isCommaListExpression } from "typescript";

export enum Difficulties {
	Easy = 1,
	Normal = 2,
	Hard = 3,
	Impossible = 10,
}

export enum PlayerColors {
	"white",
	"red",
	"blue",
	"yellow",
}

export interface GameProps {
	data?: string[][] | null;
	size?: [number, number];
	paddle?: [number, number];
	ballRadius?: number;
	lives: number[];
	livesHandler: (player: number) => void;
	winHandler: (value: boolean) => void;
	updateBlocks?: (blocks: string[][]) => void;
	difficulty?: Difficulties;
	type?: "arcanoid" | "vs1" | "vs3" | "multiplayer";
	player?: "first" | "second";
}

const Game = (props: GameProps) => {
	const {
		lives,
		livesHandler,
		winHandler,
		updateBlocks = (blocks: string[][]): void => {},
		data = null,
		size = [100, 160],
		paddle = [20, 2],
		ballRadius = 0.5,
		difficulty = Difficulties.Normal,
		player = "first",
		type = "arcanoid",
	} = props;

	const [mute, setMute] = useState<boolean>(true);

	const ping = new Audio(sound);
	const playSound = () => {
		if (!mute) {
			ping.currentTime = 0.008;
			ping.volume = 1;
			ping.play();
		}
	};

	const boundaryType: number[] = useMemo(() => {
		const boundaries = {
			arcanoid: [1, 1, 0, 1],
			vs1: [0, 1, 0, 1],
			vs3: [0, 0, 0, 0],
			multiplayer: [0, 1, 0, 1],
		};
		return boundaries[type];
	}, [type]);

	const paddleCount: number = useMemo(() => {
		const count = {
			arcanoid: 1,
			vs1: 2,
			vs3: 4,
			multiplayer: 2,
		};
		return count[type];
	}, [type]);

	const fieldRef = useRef<THREE.Mesh>(null!);
	const paddleRef: any[] = [];
	const ballRef = useRef<THREE.Mesh>(null!);
	const boundariesRef = useRef<THREE.Group>(null!);
	const blocksRef = useRef<THREE.Group>(null!);

	const calcPrecision: number = 0.1;
	const acceleration: number = 1.01;
	const speedLimit: number = 5;
	const ballStartY: number = -size[1] / 2 + paddle[1] + ballRadius + 1;
	const defaultHeight: number = 4; // z size of scene
	const ballRandomBounce: number = 15;
	const avoidAnglesX: number = 30;

	const defaultBallSpeed: number = 1;
	const defaultBallAngle: number = 45;

	const ballSpeed = useRef<number>(defaultBallSpeed);
	const ballAngle = useRef<number>(defaultBallAngle);

	const [started, setStarted] = useState<boolean>(false);

	useEffect(() => {
		const start = (): void => {
			if (!started && lives.every((live) => live > 0)) {
				setStarted(true);
			}
		};

		const canvas = document.getElementById("canvas")!;

		canvas.addEventListener("click", start);
		window.addEventListener("keypress", toggleMute);

		return () => {
			canvas.removeEventListener("click", start);
			window.addEventListener("keypress", toggleMute);
		};
	}, [lives]);

	const toggleMute = (e: KeyboardEvent): void => {
		if (e.key == "m" || e.key == "ь") {
			setMute((value) => !value);
		}
	};

	useFrame(() => {
		if (started) {
			let remainCalc = ballSpeed.current / calcPrecision;

			while (remainCalc-- > 0) {
				paddleRef.forEach((paddle) => {
					checkCollision({
						object: paddle.current,
						remove: false,
						randomBounce: true,
					});
				});

				if (boundariesRef.current) {
					boundariesRef.current.children.forEach((boundary, i) => {
						checkCollision({ object: boundary });
					});
				}

				if (blocksRef.current) {
					blocksRef.current.children.some((block, i) => {
						return checkCollision({
							i: i,
							object: block,
							remove: true,
							data: data,
						});
					});
				}

				// update ball position
				ballRef.current.position.x +=
					calcPrecision * Math.cos((ballAngle.current * Math.PI) / 180);
				ballRef.current.position.y +=
					calcPrecision * Math.sin((ballAngle.current * Math.PI) / 180);
			}

			const losePlayers = [
				ballRef.current.position.y < -size[1] / 2,
				ballRef.current.position.y > size[1] / 2,
				ballRef.current.position.x < -size[0] / 2,
				ballRef.current.position.x > size[0] / 2,
			];
			if (losePlayers.some((p) => p)) {
				const losePlayer = losePlayers.indexOf(true);
				const win =
					(lives[losePlayer] === 1 && losePlayer !== 0 && player === "first") ||
					(lives[losePlayer] === 1 && losePlayer !== 1 && player === "second");

				endGame(win, losePlayer);
			}
		} else {
			ballRef.current.position.x = paddleRef[0].current.position.x;
		}
	});

	const endGame = (
		win: boolean = false,
		lose: number | undefined = undefined
	): void => {
		setStarted(false);
		ballRef.current.position.x = paddleRef[0].current.position.x;
		ballRef.current.position.y = ballStartY;

		ballSpeed.current = defaultBallSpeed;
		ballAngle.current = defaultBallAngle;

		ballAngle.current = 45;

		livesHandler(lose as number);

		if (win) {
			winHandler(true);
		}
	};

	interface CheckBallCollision {
		object: THREE.Object3D;
		i?: number;
		remove?: boolean;
		randomBounce?: boolean;
		data?: string[][] | null;
	}
	const checkCollision = ({
		i = 0,
		object,
		randomBounce = false,
		remove = false,
		data = null,
	}: CheckBallCollision): boolean => {
		const collision = checkBallBlockCollision(ballRef.current, object);

		if (collision.collision) {
			playSound();
			let newAngle = (ballAngle.current + 180) % 360;

			if (data && remove) {
				removeBlock(data, i);
			}

			if (collision.side == "left" || collision.side == "right") {
				newAngle = (180 - ballAngle.current) % 360;

				// fix ball can't stack in block
				if (collision.offset) {
					ballRef.current.position.x = collision.offset;
				}
			} else if (collision.side == "top" || collision.side == "bottom") {
				let correctedAngle = ballAngle.current;

				if (randomBounce && collision.position) {
					let randomBounceValue: number =
						-Math.random() * ballRandomBounce * collision.position;
					correctedAngle += randomBounceValue;

					const correctedAngleRad = (correctedAngle * Math.PI) / 180;

					// fix almost flat angles
					if (
						Math.cos(correctedAngleRad) >
						Math.cos((avoidAnglesX * Math.PI) / 180)
					) {
						correctedAngle =
							Math.sin(correctedAngleRad) > 0 ? avoidAnglesX : -avoidAnglesX;
					} else if (
						Math.cos(correctedAngleRad) <
						Math.cos(((180 - avoidAnglesX) * Math.PI) / 180)
					) {
						correctedAngle =
							Math.sin(correctedAngleRad) > 0
								? 180 - avoidAnglesX
								: 180 + avoidAnglesX;
					}
				}

				newAngle = (360 - correctedAngle) % 360;

				// fix ball can't stack in block
				if (collision.offset) {
					ballRef.current.position.y = collision.offset;
				}
			} else if (collision.corner) {
				// corner collision
				newAngle =
					collision.corner === "bottom-left"
						? 225
						: collision.corner === "bottom-right"
						? 315
						: collision.corner === "top-left"
						? 135
						: 45;
			}

			ballAngle.current = newAngle;
			ballSpeed.current =
				ballSpeed.current * acceleration > speedLimit
					? speedLimit
					: ballSpeed.current * acceleration;

			return true;
		}

		return false;
	};

	const removeBlock = (data: string[][], i: number): void => {
		let counter = 0;
		const newData = data.map((row, j) =>
			row.map((cell, k) => {
				let result = cell;
				if (counter == i) {
					result =
						parseInt(cell, 10) > 1 ? (parseInt(cell, 10) - 1).toString() : " ";
				}

				if (cell !== " ") {
					counter++;
				}
				return result;
			})
		);
		if (counter == 1) {
			endGame(true);
		}
		updateBlocks(newData);
	};

	const getOrCreatePaddleRef = (id: number) => {
		if (!paddleRef[id]) {
			paddleRef[id] = React.createRef();
		}
		return paddleRef[id];
	};

	const generatePaddles = (count: number) => {
		return Array(count)
			.fill(0)
			.map((_, i) => {
				const axis = i < 2 ? "x" : "y";
				const control = i === 0;
				const auto =
					(type !== "multiplayer" && i > 0) ||
					(type === "multiplayer" && player === "first" && i === 0) ||
					(type === "multiplayer" && player === "second" && i === 1);

				const positionX: number =
					axis === "x"
						? 0
						: i % 2 === 0
						? -size[0] / 2 + paddle[1] / 2
						: size[0] / 2 - paddle[1] / 2;
				const positionY: number =
					axis === "y"
						? 0
						: i % 2 === 0
						? -size[1] / 2 + paddle[1] / 2
						: size[1] / 2 - paddle[1] / 2;
				const positionZ: number = 0;

				const scaleX: number = axis === "x" ? paddle[0] : paddle[1];
				const scaleY: number = axis === "y" ? paddle[0] : paddle[1];

				return (
					<Paddle
						key={`paddle_${i}`}
						position={[positionX, positionY, positionZ]}
						scale={[scaleX, scaleY, defaultHeight]}
						difficulty={auto ? difficulty : Difficulties.Impossible}
						i={i}
						ref={getOrCreatePaddleRef(i)}
						size={size}
						axis={axis}
						control={control}
						ball={ballRef}
						auto={auto}
					/>
				);
			});
	};

	return (
		<>
			<Camera position={[0, 0, 10]} size={size} />

			<group
				rotation={
					player == "second" ? [0, 0, (180 * Math.PI) / 180] : [0, 0, 0]
				}
			>
				<Field
					ref={fieldRef}
					position={[0, 0, -1]}
					scale={[size[0], size[1], 0.1]}
				/>
				<Boundaries
					ref={boundariesRef}
					fieldSize={size}
					height={defaultHeight}
					sides={boundaryType}
				/>
				{generatePaddles(paddleCount)}
				{type === "arcanoid" && data && (
					<Blocks
						ref={blocksRef}
						fieldSize={size}
						data={data}
						height={defaultHeight}
					/>
				)}

				<Ball
					ref={ballRef}
					scale={[ballRadius * 2, ballRadius * 2, ballRadius * 2]}
					position={[0, ballStartY, 0]}
				/>
			</group>
		</>
	);
};
export default Game;
