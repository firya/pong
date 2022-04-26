import * as THREE from "three";
import { forwardRef, ComponentPropsWithoutRef } from "react";
// import { useThree, useFrame } from "@react-three/fiber";

type BallProps = ComponentPropsWithoutRef<"mesh">;

const Ball = forwardRef<THREE.Mesh, BallProps>((props, ref) => {
	// const ballRef = ref as React.MutableRefObject<THREE.Mesh>;
	// const { viewport } = useThree();

	// useFrame(({ mouse }) => {
	// 	const currentViewport = viewport.getCurrentViewport();
	// 	ballRef.current.position.x = (mouse.x * currentViewport.width) / 2;
	// 	ballRef.current.position.y = (mouse.y * currentViewport.height) / 2;
	// });

	return (
		<mesh {...props} ref={ref} name="ball" castShadow receiveShadow>
			<sphereGeometry />
			<meshStandardMaterial color={"white"} />
		</mesh>
	);
});
export default Ball;
