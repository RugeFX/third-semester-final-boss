import type { SVGProps } from "react";

export default function MainIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="174"
			height="252"
			viewBox="0 0 174 252"
			xmlns="http://www.w3.org/2000/svg"
			fill="white"
			{...props}
		>
			<title>Icon</title>
			<path d="M173.205 50V150L86.9102 199.822V149.822L129.904 125V75L86.6025 50L43.3018 75V75.0898L0 50.0889V50L86.6025 0L173.205 50ZM43.2783 125.083V174.986L0 150V100.097L43.2783 125.083Z" />
			<path d="M43.3008 127V176.087L86.5 201.027V251.027L0 201.087V102L43.3008 127Z" />
		</svg>
	);
}
