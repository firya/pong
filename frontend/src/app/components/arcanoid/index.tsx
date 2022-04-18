import { useEffect, useRef } from "react";
import defaultData from "../../data/default";
import styles from "./index.module.css";

export interface MenuProps {
	data: string;
}

export default (props: MenuProps) => {
	let { data } = props;

	const requestRef = useRef<number>(0);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	console.log(canvasRef);

	data = data || defaultData;

	useEffect(() => {
		init();
		requestRef.current = requestAnimationFrame(render);
		return () => cancelAnimationFrame(requestRef.current);
	}, []);

	const init = (): void => {
		window.addEventListener("resize", setupCanvas);
		setupCanvas();
	};

	const setupCanvas = (): void => {
		if (canvasRef.current) {
			canvasRef.current.width = canvasRef.current.clientWidth;
			canvasRef.current.height = canvasRef.current.clientHeight;
		}
	};

	const render = (time: Number) => {
		requestRef.current = requestAnimationFrame(render);

		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext("2d");

			if (ctx) {
				ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			}
		}
	};

	return (
		<div className={styles.wrapper}>
			<canvas className={styles.canvas} ref={canvasRef} />
		</div>
	);
};
