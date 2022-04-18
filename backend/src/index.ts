import path from "path";
import express, { Request, Response } from "express";
import { Server } from "socket.io";

const router = express.Router();
const app = express();

app.use(express.static("public"));
app.use("/", router);

router.get("/*", (req: Request, res: Response) => {
	res.sendFile("index.html", {
		root: path.join(__dirname, "public"),
	});
});

const server = app.listen(3001, () => console.log("listening on port 3001"));
const io = new Server(server, {
	cors: {
		origin: "http://pong.maksimlebedev.local:8080",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("a user connected");
});
