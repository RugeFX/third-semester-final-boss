import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

export function useElapsedTime(startDate: Date) {
	const [elapsed, setElapsed] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		console.log("startDate", startDate);

		const tick = () => {
			const now = new Date();
			const totalSeconds = differenceInSeconds(now, startDate);

			if (totalSeconds < 0)
				return setElapsed({ hours: 0, minutes: 0, seconds: 0 });

			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;

			setElapsed({ hours, minutes, seconds });
		};

		tick();
		const interval = setInterval(() => tick(), 1000);

		return () => clearInterval(interval);
	}, [startDate]);

	return elapsed;
}
