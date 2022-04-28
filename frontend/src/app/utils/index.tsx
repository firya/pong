export const checkBallBlockCollision = (
	ball: THREE.Mesh,
	block: THREE.Object3D
) => {
	const ballRadius = ball.scale.x;

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
		return { collision: false };
	}

	if (side.x < -ballRadius && side.y < -ballRadius) {
		return { collision: false };
	}

	if (side.x < 0 || side.y < 0) {
		if (Math.abs(side.x) <= ballRadius && side.y < 0) {
			return {
				collision: true,
				side: centerDist.x > 0 ? "right" : "left",
				position: centerDist.y / blockHalf.y,
				offset:
					centerDist.x > 0
						? block.position.x + blockHalf.x + ballRadius
						: block.position.x - (blockHalf.x + ballRadius),
			};
		} else if (Math.abs(side.y) <= ballRadius && side.x < 0) {
			return {
				collision: true,
				side: centerDist.y > 0 ? "top" : "bottom",
				position: centerDist.x / blockHalf.x,
				offset:
					centerDist.y > 0
						? block.position.y + blockHalf.y + ballRadius
						: block.position.y - (blockHalf.y + ballRadius),
			};
		}
	}

	if (side.x * side.x + side.y * side.y < ballRadius * ballRadius) {
		return { collision: false };
	}

	let corner: string = "bottom-left";
	if (centerDist.x > 0 && centerDist.y > 0) {
		corner = "top-right";
	} else if (centerDist.x > 0 && centerDist.y < 0) {
		corner = "bottom-right";
	} else if (centerDist.x < 0 && centerDist.y > 0) {
		corner = "top-left";
	}
	return { collision: true, side: "corner", corner: corner };
};
