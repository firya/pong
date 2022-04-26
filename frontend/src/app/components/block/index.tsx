import * as THREE from "three";
import { forwardRef, ComponentPropsWithoutRef, useState } from "react";

type BlockProps = ComponentPropsWithoutRef<"mesh"> & {
	color?: string;
};

const Block = forwardRef<THREE.Mesh, BlockProps>((props, ref) => {
	const { color = "white" } = props;

	return (
		<mesh {...props} ref={ref}>
			<boxGeometry />
			<meshStandardMaterial color={color} />
		</mesh>
	);
});

export default Block;
