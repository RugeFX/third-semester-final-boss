import type { SVGProps } from "react";

import scooter from "@/assets/scooter-side.png";
import { BicycleIcon, CarIcon, ScooterIcon, TruckIcon } from "./icons";

export interface Category {
	id: number;
	name: string;
	image: string;
	icon: React.FC<SVGProps<SVGSVGElement>>;
}

export const categories: Category[] = [
	{
		id: 1,
		name: "Motor",
		image: scooter,
		icon: ScooterIcon,
	},
	{
		id: 2,
		name: "Mobil",
		image: scooter,
		icon: CarIcon,
	},
	{
		id: 3,
		name: "Truk",
		image: scooter,
		icon: TruckIcon,
	},
	{
		id: 4,
		name: "Sepeda",
		image: scooter,
		icon: BicycleIcon,
	},
];
