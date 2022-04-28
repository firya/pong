import * as THREE from "three";
import { forwardRef, ComponentPropsWithoutRef } from "react";

import Block from "../block";

type BoundariesProps = ComponentPropsWithoutRef<"group"> & {
	fieldSize: number[];
	data: string[][];
	height?: number;
};

const Blocks = forwardRef<THREE.Group, BoundariesProps>((props, ref) => {
	const { fieldSize, data, height = 1 } = props;

	const gap: number = 0.5;
	const offset: number = 10;
	const offsetX: number = -fieldSize[0] / 2 + offset;
	const offsetY: number = fieldSize[1] / 2 - offset;
	const blockWidth: number =
		(fieldSize[0] - offset * 2 - gap * data[0].length) / data[0].length;
	const blockHeight: number = 5;
	const colors = ["white", "yellow", "orange", "red"];

	return (
		<group ref={ref}>
			{data.map((row, i) =>
				row.map((block, j) => {
					if (block === " ") return;

					const position = new THREE.Vector3(
						(blockWidth + gap) * j + offsetX + blockWidth / 2,
						-(blockHeight + gap) * i + offsetY - blockHeight / 2,
						0
					);
					const scale = new THREE.Vector3(blockWidth, blockHeight, height);

					return (
						<Block
							key={`${i}_${j}`}
							position={position}
							name={`block_${i}_${j}`}
							color={colors[parseInt(block, 10) - 1]}
							scale={scale}
							castShadow
							receiveShadow
						/>
					);
				})
			)}
		</group>
	);
});

export default Blocks;
