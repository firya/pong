import * as THREE from "three";
import React, { forwardRef, ComponentPropsWithoutRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";

import { Difficulties, PlayerColors } from "../game";

import Block from "../block";

type PaddleProps = ComponentPropsWithoutRef<"mesh"> & {
	i: number;
	scale: number[];
	size: number[];
	ball: React.MutableRefObject<THREE.Mesh>;
	axis: "x" | "y";
	auto?: boolean;
	control?: boolean;
	difficulty: Difficulties;
	invertControl?: boolean;
};

const Paddle = forwardRef<THREE.Mesh, PaddleProps>((props, ref) => {
	const {
		i = 0,
		scale,
		size,
		ball,
		difficulty,
		axis = "x",
		auto = false,
		control = true,
		invertControl = false,
	} = props;

	const maxSpeed: number = control ? Difficulties.Impossible : difficulty;
	const { viewport } = useThree();
	const el = ref as React.MutableRefObject<THREE.Mesh>;
	const ballRef = ball as React.MutableRefObject<THREE.Mesh>;
	const color: string = useMemo((): string => {
		return PlayerColors[i];
	}, [i]);

	useFrame(({ mouse }) => {
		const currentViewport = viewport.getCurrentViewport();

		let target: number | undefined;

		const ballPosition: number = ballRef.current.position[axis] ?? 0;
		const limit: number = axis === "x" ? size[0] / 2 - 1 : size[1] / 2 - 1;

		if (auto) {
			target = ballPosition;
		}
		if (control) {
			const dimension = axis === "x" ? "width" : "height";
			target = invertControl
				? -(mouse[axis] * currentViewport[dimension]) / 2
				: (mouse[axis] * currentViewport[dimension]) / 2;
		}

		// fix in boundaries
		if (target !== undefined && scale !== undefined) {
			const axisScale = axis === "x" ? scale[0] : scale[1];

			target =
				target < -limit + axisScale / 2
					? -limit + axisScale / 2
					: target > limit - axisScale / 2
					? limit - axisScale / 2
					: target;
		}

		if (el && target !== undefined && el.current.position[axis] !== target) {
			let speed: number =
				el.current.position[axis] > target ? -maxSpeed : maxSpeed;

			if (Math.abs(el.current.position[axis] - target) < maxSpeed) {
				el.current.position[axis] = target;
			} else {
				el.current.position[axis] += speed;
			}
		}
	});

	return <Block {...props} ref={ref} name="paddle" color={color} />;
});

export default Paddle;
