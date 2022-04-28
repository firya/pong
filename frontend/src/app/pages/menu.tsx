import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

const MenuPage = () => {
	const navigate = useNavigate();
	const defaultMenu: MenuItemProps[] = useMemo(
		() => [
			{
				text: "Singleplayer",
				children: [
					{
						text: "Arcanoid",
						path: "/arcanoid",
					},
					{
						text: "Pong vs AI",
						children: [
							{
								text: "Easy",
								path: "/pong/easy",
							},
							{
								text: "Normal",
								path: "/pong/normal",
							},
							{
								text: "Hard",
								path: "/pong/hard",
							},
							{
								text: "Impossible",
								path: "/pong/impossible",
							},
						],
					},
					{
						text: "Pong vs 3 AI",
						children: [
							{
								text: "Easy",
								path: "/vs3/easy",
							},
							{
								text: "Normal",
								path: "/vs3/normal",
							},
							{
								text: "Hard",
								path: "/vs3/hard",
							},
							{
								text: "Impossible",
								path: "/vs3/impossible",
							},
						],
					},
				],
			},
			{
				text: "Multiplayer",
				callback: () => {
					return `/game/${nanoid(8)}`;
				},
			},
		],
		[]
	);

	const [path, setPath] = useState<number[]>([]);

	useEffect(() => {
		window.addEventListener("keydown", back);

		return () => {
			window.removeEventListener("keydown", back);
		};
	}, []);

	const back = (e: KeyboardEvent): void => {
		console.log(e.key);
		if (e.key == "Escape") {
			setPath((prev) => {
				return prev.slice(0, -1);
			});
		}
	};

	const structure = useMemo(() => {
		let str: MenuItemProps[] = defaultMenu;

		for (let i = 0; i < path.length; i++) {
			if (str[path[i]].children) {
				str = str[path[i]].children!;
			}
		}

		return str;
	}, [path]);

	const changeMenu = (i: number) => {
		setPath((prev) => {
			return i >= 0 ? [...prev, i] : prev.slice(0, -1);
		});
	};

	return (
		<div className="menu">
			{structure.map((item, i) => {
				return <MenuItem key={i} {...item} i={i} changeMenu={changeMenu} />;
			})}
			{path.length > 0 && (
				<MenuItem i={-1} text={"Back"} changeMenu={changeMenu} />
			)}
		</div>
	);
};

export interface MenuItemProps {
	text: string;
	i?: number;
	callback?: () => void;
	path?: string;
	children?: MenuItemProps[];
	changeMenu?: (i: number) => void;
}

const MenuItem = (props: MenuItemProps) => {
	const { i = 0, text, callback, path, children, changeMenu } = props;
	const navigate = useNavigate();

	const clickHandler = (): void => {
		if (callback) {
			const result = callback()!;
			navigate(result);
		}

		if (path) {
			navigate(path);
		}

		if (changeMenu) {
			changeMenu(i);
		}
	};

	return (
		<div className="menu__item">
			<button className="menu__link button" onClick={clickHandler}>
				{text}
			</button>
		</div>
	);
};

export default MenuPage;
