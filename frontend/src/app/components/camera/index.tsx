import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import {
	OrthographicCamera,
	PerspectiveCamera,
	OrbitControls,
} from "@react-three/drei";

interface CameraProps {
	position: [number, number, number];
	size: [number, number];
}

const Camera = (props: CameraProps) => {
	const { size } = props;
	const orthoCamera = useRef<THREE.OrthographicCamera>(null!);
	const perspectiveCamera = useRef<THREE.PerspectiveCamera>(null!);
	const state = useThree();
	const [perspective, setPerspective] = useState<boolean>(false);
	const ambientLight = useRef(null!);
	const orbitControls = useRef(null!);
	const directionalLight = useRef(null!);

	useEffect(() => {
		window.addEventListener("resize", setZoom);
		window.addEventListener("keypress", togglePerspective);
		setZoom();

		return () => {
			window.removeEventListener("resize", setZoom);
			window.addEventListener("keypress", togglePerspective);
		};
	}, []);

	const togglePerspective = (e: KeyboardEvent): void => {
		if (e.key == "p" || e.key == "з") {
			setPerspective((value) => !value);
			// setPerspectiveCameraDefault();
		}
	};

	const setZoom = () => {
		setOrthoCameraDefault();
		setPerspectiveCameraDefault();
	};

	const setOrthoCameraDefault = () => {
		const canvasSize: { width: number; height: number } = state.get().size;

		// orthoCamera.current.rotation.z = (45 * 180) / Math.PI;
		orthoCamera.current.zoom =
			Math.min(canvasSize.width / size[0], canvasSize.height / size[1]) * 1;
	};

	const setPerspectiveCameraDefault = () => {
		const maxDim = Math.max(size[0], size[1]);
		const fov = perspectiveCamera.current.fov * (Math.PI / 180);
		let cameraZ = maxDim / 2 / Math.tan(fov / 2);
		perspectiveCamera.current.position.z = cameraZ;
		perspectiveCamera.current.position.x = 0;
		perspectiveCamera.current.position.y = 0;
	};

	return (
		<>
			<OrthographicCamera
				name="orthographicCamera"
				{...props}
				ref={orthoCamera}
				makeDefault={!perspective}
			/>
			<ambientLight ref={ambientLight} intensity={perspective ? 0.3 : 1} />

			<PerspectiveCamera
				name="perspectiveCamera"
				{...props}
				ref={perspectiveCamera}
				makeDefault={perspective}
			/>
			{perspective && (
				<>
					<OrbitControls
						makeDefault
						maxAzimuthAngle={Math.PI / 4}
						minAzimuthAngle={-Math.PI / 4}
						maxPolarAngle={(Math.PI * 3) / 4}
						minPolarAngle={Math.PI / 4}
						enableZoom={false}
						ref={orbitControls}
					/>
					<directionalLight
						intensity={5}
						position={[-10, 100, 10]}
						color="white"
						castShadow
						shadow-mapSize={[512, 512]}
						ref={directionalLight}
					/>
				</>
			)}
		</>
	);
};
export default Camera;
