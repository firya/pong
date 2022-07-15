import { createServer } from "http";
import { Server, Socket } from "socket.io";
import express from "express";

var app = express();

app.use(express.static("public", { extensions: ["html"] }));

app.get("/*", (req, res) => {
	res.sendFile("/app/public/index.html");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin:
			process.env.NODE_ENV === "development"
				? "http://localhost:8080"
				: `https://${process.env.VIRTUAL_HOST}`,
		methods: ["GET", "POST"],
	},
});

interface Room {
	id: string;
	first?: string;
	second?: string;
}

const rooms: Room[] = [];

io.on("connection", (socket: Socket): void => {
	socket.on("join", (roomId: string): void => {
		const roomSize: number = io.sockets.adapter.rooms.get(roomId)?.size || 0;

		let roomIndex: number = rooms.findIndex((room) => room.id === roomId);

		if (roomIndex === -1) {
			rooms.push({
				id: roomId,
			});
			roomIndex = rooms.length - 1;
		}

		if (roomSize < 2) {
			socket.join(roomId);
			socket.emit(
				"player",
				rooms[roomIndex]?.first === undefined ? "first" : "second"
			);
			rooms[roomIndex][
				rooms[roomIndex]?.first === undefined ? "first" : "second"
			] = socket.id;
		} else {
			socket.emit("full", true);
		}

		if (io.sockets.adapter.rooms.get(roomId)?.size === 2) {
			io.in(roomId).emit("start", true);
		}
	});

	socket.on("newgame", (): void => {
		socket.broadcast.emit("newgame");
	});
	socket.on("winhandler", (): void => {
		socket.broadcast.emit("winhandler");
	});
	socket.on("update", (gameData): void => {
		socket.broadcast.emit("update", gameData);
	});
	socket.on("startgame", (): void => {
		socket.broadcast.emit("startgame");
	});
	socket.on("updatelives", (value: boolean): void => {
		socket.broadcast.emit("updatelives", value);
	});

	socket.on("disconnect", (): void => {
		const roomIndex = findRoomIndexByUser(socket.id);

		if (roomIndex !== -1) {
			if (rooms[roomIndex].first === socket.id) {
				rooms[roomIndex].first = undefined;
			} else {
				rooms[roomIndex].second = undefined;
			}
		}
		socket.broadcast.emit("wait");
	});
});

const findRoomIndexByUser = (user: string): number => {
	return rooms.findIndex((room) => room.first === user || room.second === user);
};

httpServer.listen(3001);
