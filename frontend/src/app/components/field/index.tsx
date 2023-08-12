import * as THREE from "three";
import React, { forwardRef } from "react";

type FieldProps = React.ComponentPropsWithoutRef<"mesh">;

const Field = forwardRef<THREE.Mesh, FieldProps>((props, ref) => {
	return (
		<mesh {...props} ref={ref}>
			<boxGeometry />
			<meshStandardMaterial transparent={true} opacity={0} />
		</mesh>
	);
});

export default Field;
