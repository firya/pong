import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import React, { useEffect, useRef, useState, useMemo } from "react";

import Field from "../field";
import Camera from "../camera";
import Paddle from "../paddle";
import Ball from "../ball";
import Boundaries from "../boundaries";
import Blocks from "../blocks";
import { arrayBuffer } from "stream/consumers";

export enum Difficulties {
	Easy = 1,
	Normal = 2,
	Hard = 3,
	Impossible = 10,
}

export interface GameProps {
	data?: string[][] | null;
	size?: [number, number];
	paddle?: [number, number];
	ballRadius?: number;
	livesHandler: () => void;
	lives: number;
	updateBlocks: (blocks: string[][]) => void;
	type?: "arcanoid" | "vs1" | "vs3" | "multiplayer";
	player?: "first" | "second";
}

const Game = (props: GameProps) => {
	const {
		data = null,
		size = [100, 160],
		paddle = [20, 2],
		ballRadius = 0.5,
		livesHandler,
		lives,
		updateBlocks,
		player = "first",
		type = "arcanoid",
	} = props;

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

	const ballSpeed = useRef<number>(1);
	const ballAngle = useRef<number>(45);

	const [started, setStarted] = useState<boolean>(false);

	useEffect(() => {
		const start = (): void => {
			if (!started && lives > 0) {
				setStarted(true);
			}
		};
		window.addEventListener("click", start);

		return () => {
			window.removeEventListener("click", start);
		};
	}, [lives]);

	useFrame(() => {
		if (started) {
			let remainCalc = ballSpeed.current / calcPrecision;

			while (remainCalc-- > 0) {
				paddleRef.forEach((paddle) => {
					checkBallCollision({
						object: paddle.current,
						remove: false,
						randomBounce: true,
					});
				});

				if (boundariesRef.current) {
					checkBallCollision({ object: boundariesRef.current });
				}

				if (blocksRef.current) {
					checkBallCollision({
						object: blocksRef.current,
						remove: true,
						data: data,
					});
				}

				// update ball position
				ballRef.current.position.x +=
					calcPrecision * Math.cos((ballAngle.current * Math.PI) / 180);
				ballRef.current.position.y +=
					calcPrecision * Math.sin((ballAngle.current * Math.PI) / 180);
			}

			if (
				ballRef.current.position.y < -size[1] / 2 ||
				ballRef.current.position.y > size[1] / 2 ||
				ballRef.current.position.x < -size[0] / 2 ||
				ballRef.current.position.x > size[0] / 2
			) {
				setStarted(false);
				ballRef.current.position.x = paddleRef[0].current.position.x;
				ballRef.current.position.y = ballStartY;

				ballAngle.current = 45;
				livesHandler();
			}
		} else {
			ballRef.current.position.x = paddleRef[0].current.position.x;
		}
	});

	interface CheckBallCollision {
		object: THREE.Mesh | THREE.Group;
		remove?: boolean;
		randomBounce?: boolean;
		data?: string[][] | null;
	}
	const checkBallCollision = ({
		object,
		remove = false,
		randomBounce = false,
		data = null,
	}: CheckBallCollision) => {
		if (object.type === "Group") {
			object.children.forEach((block, i) => {
				const collision = checkCollision(ballRef.current, block, randomBounce);
				if (remove && collision && data) {
					let counter = 0;
					const newData = data.map((row, j) =>
						row.map((cell, k) => {
							const result = counter == i ? " " : cell;
							if (cell !== " ") {
								counter++;
							}
							return result;
						})
					);
					updateBlocks(newData);
				}
			});
		} else {
			checkCollision(ballRef.current, object, randomBounce);
		}
	};

	const checkCollision = (
		ball: THREE.Mesh,
		block: THREE.Object3D,
		randomBounce: boolean = false
	): boolean => {
		const blockHalf: { x: number; y: number } = {
			x: block.scale.x / 2,
			y: block.scale.y / 2,
		};

		const centerDist: { x: number; y: number } = {
			x: ball.position.x - block.position.x,
			y: ball.position.y - block.position.y,
		};

		const side: { x: number; y: number } = {
			x: Math.abs(centerDist.x) - blockHalf.x,
			y: Math.abs(centerDist.y) - blockHalf.y,
		};

		if (side.x > ballRadius || side.y > ballRadius) {
			return false;
		}

		if (side.x < -ballRadius && side.y < -ballRadius) {
			return false;
		}

		if (side.x < 0 || side.y < 0) {
			if (Math.abs(side.x) <= ballRadius && side.y < 0) {
				// console.log("collision x");

				// paddle fix ball can't stack in block
				ball.position.x =
					centerDist.x > 0
						? block.position.x + blockHalf.x + ballRadius
						: block.position.x - blockHalf.x - ballRadius;

				ballAngle.current = (180 - ballAngle.current) % 360;
				ballSpeed.current =
					ballSpeed.current * acceleration > speedLimit
						? speedLimit
						: ballSpeed.current * acceleration;
			} else if (Math.abs(side.y) <= ballRadius && side.x < 0) {
				// console.log("collision y");

				// paddle fix ball can't stack in block
				ball.position.y =
					centerDist.y > 0
						? block.position.y + blockHalf.y + ballRadius
						: block.position.y - blockHalf.y - ballRadius;

				let correctedAngle: number = ballAngle.current;

				if (randomBounce) {
					let randomBounceValue: number = Math.random() * ballRandomBounce;
					if (ball.position.x > block.position.x) {
						randomBounceValue *= -1;
					} else if (ball.position.x == block.position.x) {
						randomBounceValue = 0;
					}

					let correctedAngle = ballAngle.current + randomBounceValue;

					// fix almost flat angles
					if (Math.cos(correctedAngle) > Math.cos(avoidAnglesX)) {
						correctedAngle =
							Math.sin(correctedAngle) > 0 ? avoidAnglesX : -avoidAnglesX;
					} else if (Math.cos(correctedAngle) < Math.cos(180 - avoidAnglesX)) {
						correctedAngle =
							Math.sin(correctedAngle) > 0
								? 180 - avoidAnglesX
								: 180 + avoidAnglesX;
					}
				}

				ballAngle.current = (360 - correctedAngle) % 360;
				ballSpeed.current =
					ballSpeed.current * acceleration > speedLimit
						? speedLimit
						: ballSpeed.current * acceleration;
			}

			return true;
		}

		if (side.x * side.x + side.y * side.y < ballRadius * ballRadius) {
			return false;
		}

		// console.log("collision corner");

		ballAngle.current = (ballAngle.current + 180) % 360;
		ballSpeed.current =
			ballSpeed.current * acceleration > speedLimit
				? speedLimit
				: ballSpeed.current * acceleration;

		return true;
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
