import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { wait } from "@/lib/utils";

export const Route = createFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	const [count, setCount] = useState(0);

	const { mutateAsync: mutateAsyncIncrement, isPending } = useMutation({
		mutationFn: () => wait(2000).then(() => setCount((prev) => prev + 1)),
	});

	return (
		<div>
			<h1>Hello "/about"! {count}</h1>
			<Button
				size="md"
				color="primary"
				onClick={() =>
					toast.promise(mutateAsyncIncrement(), {
						loading: "Incrementing...",
						success: "Number Incremented!",
						error: "Failed to increment",
					})
				}
				isLoading={isPending}
				showTextWhileLoading
			>
				{isPending ? "Incrementing..." : "Increment"}
			</Button>
			<Input label="Name" placeholder="Sigma gyatt" />
		</div>
	);
}
