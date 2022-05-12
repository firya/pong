import { checkBallBlockCollision } from "./index";
import * as THREE from "three";

describe("check collisions", () => {
	const ballRadius = 0.5;
	const boxSide = 1;

	const ballGeometry = new THREE.SphereGeometry(ballRadius);
	const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const ball = new THREE.Mesh(ballGeometry, ballMaterial);

	const blockGeometry = new THREE.BoxGeometry(boxSide, boxSide, boxSide);
	const blockMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const block = new THREE.Mesh(blockGeometry, blockMaterial);

	it("no collision", () => {
		block.position.set(0, 0, 0);
		ball.position.set(10, 10, 0);

		expect(checkBallBlockCollision(ball, block)).toStrictEqual({
			collision: false,
		});
	});

	it("collision", () => {
		const distance = boxSide / 2 + ballRadius;
		block.position.set(0, 0, 0);
		ball.position.set(distance, 0, 0);

		expect(checkBallBlockCollision(ball, block).collision).toBe(true);
		expect(checkBallBlockCollision(ball, block).side).toBe("right");

		ball.position.set(-distance, 0, 0);
		expect(checkBallBlockCollision(ball, block).side).toBe("left");

		ball.position.set(0, distance, 0);
		expect(checkBallBlockCollision(ball, block).side).toBe("top");

		ball.position.set(0, -distance, 0);
		expect(checkBallBlockCollision(ball, block).side).toBe("bottom");

		ball.position.set(distance, distance, 0);
		expect(checkBallBlockCollision(ball, block).corner).toBe("top-right");

		ball.position.set(-distance, distance, 0);
		expect(checkBallBlockCollision(ball, block).corner).toBe("top-left");

		ball.position.set(distance, -distance, 0);
		expect(checkBallBlockCollision(ball, block).corner).toBe("bottom-right");

		ball.position.set(-distance, -distance, 0);
		expect(checkBallBlockCollision(ball, block).corner).toBe("bottom-left");
	});
});
