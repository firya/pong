import * as THREE from "three";
import React, { useRef, useState, forwardRef } from "react";

import { useFrame } from "@react-three/fiber";

type FieldProps = React.ComponentPropsWithoutRef<"mesh">;

const Field = forwardRef<THREE.Mesh, FieldProps>((props, ref) => {
	return (
		<mesh {...props} ref={ref}>
			<boxGeometry />
			<meshStandardMaterial
				// color={"red"}
				transparent={true}
				opacity={0}
			/>
		</mesh>
	);
});

export default Field;
