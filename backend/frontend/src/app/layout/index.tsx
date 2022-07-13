import { useEffect } from "react";
import "./index.css";
import { ReactComponent as Logo } from "./logo.svg";

export interface LayoutProps {
	children?: React.ReactNode;
}

function DefaultLayout(props: LayoutProps) {
	const { children } = props;

	useEffect(() => {
		document.body.addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault();
			},
			{ passive: false }
		);

		return (): void => {
			document.body.removeEventListener("touchmove", (e) => {
				e.preventDefault();
			});
		};
	}, []);

	return (
		<div className="app">
			<div className="header">
				<a href="/">
					<Logo width="74px" height="32px" />
				</a>
			</div>
			<div className="content">{children}</div>
			<div className="footer">
				<a href="https://github.com/firya/pong" target="_blank">
					Github
				</a>
			</div>
		</div>
	);
}

export default DefaultLayout;
