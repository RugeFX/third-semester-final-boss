import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

import { cx } from "@/lib/utils/cx";

interface RemoteSVGProps {
	url: string;
	className?: string;
}

function InnerRemoteSVG({ url, className }: RemoteSVGProps) {
	const { data } = useSuspenseQuery({
		queryKey: ["remote-svg", url],
		queryFn: () => axios.get<string>(url).then((res) => res.data),
		staleTime: Infinity,
	});

	return (
		<span
			className={className}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: the backend SHOULD have already sanitized this
			dangerouslySetInnerHTML={{ __html: data }}
		/>
	);
}

export function RemoteSVG({ url, className }: RemoteSVGProps) {
	return (
		<ErrorBoundary fallback={<span className={className}>Error</span>}>
			<React.Suspense
				fallback={<span className={cx("bg-gray-500 rounded-xl")} />}
			>
				<InnerRemoteSVG
					url={url}
					className={cx("animate-in fade-in duration-500", className)}
				/>
			</React.Suspense>
		</ErrorBoundary>
	);
}
