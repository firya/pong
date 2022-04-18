import * as React from "react";
import "./index.css";

export interface LayoutProps {
	children?: React.ReactNode;
}

function DefaultLayout(props: LayoutProps) {
	const { children } = props;

	return <div className="app">{children}</div>;
}

export default DefaultLayout;
