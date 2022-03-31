import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
	var a = 10;
	return res.json({
		status: "success",
	});
});

app.listen(3000, () => console.log("listening on port 3000"));
