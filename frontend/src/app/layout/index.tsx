import * as React from "react";
import "./index.css";

export interface LayoutProps {
	children?: React.ReactNode;
}

function DefaultLayout(props: LayoutProps) {
	const { children } = props;

	return (
		<div className="app">
			<div className="header">Header</div>
			<div className="content">{children}</div>
			<div className="footer">Footer</div>
		</div>
	);
}

export default DefaultLayout;
