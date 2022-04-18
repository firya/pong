// import { useEffect, useState } from "react";
import Router from "./router";

// import socketIOClient, { Socket } from "socket.io-client";

function App() {
	// const [socket, setSocket] = useState<Socket | null>(null);

	// useEffect(() => {
	// 	const newSocket = socketIOClient(`${window.location.hostname}:3001`);
	// 	console.log(newSocket);

	// 	setSocket(newSocket);
	// }, []);

	return <Router></Router>;
}

export default App;
