import * as THREE from "three";
import { forwardRef, ComponentPropsWithoutRef } from "react";

import Block from "../block";

type BoundariesProps = ComponentPropsWithoutRef<"group"> & {
	fieldSize: number[];
	sides: number[];
	height?: number;
};

const Boundaries = forwardRef<THREE.Group, BoundariesProps>((props, ref) => {
	const { fieldSize, sides, height = 1 } = props;

	const position = [
		new THREE.Vector3(0, fieldSize[1] / 2 - 0.5 + 0, 0),
		new THREE.Vector3(fieldSize[0] / 2 - 0.5, 0, 0),
		new THREE.Vector3(0, -fieldSize[1] / 2 + 0.5, 0),
		new THREE.Vector3(-fieldSize[0] / 2 + 0.5, 0, 0),
	];

	return (
		<group ref={ref}>
			{sides.map((side, i) => {
				if (!side) return;

				const scale =
					i % 2 === 0
						? new THREE.Vector3(fieldSize[0], 1, height)
						: new THREE.Vector3(1, fieldSize[1], height);

				return (
					<Block
						key={i}
						name={`boundary_${i}`}
						position={position[i]}
						scale={scale}
					/>
				);
			})}
		</group>
	);
});

export default Boundaries;
