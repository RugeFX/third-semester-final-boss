import { motion, type Variants } from "motion/react";

import type { ParkingLevel } from "@/lib/api/models";
import { withFieldGroup } from "@/lib/form";
import { cx } from "@/lib/utils/cx";

type ParkingLevelFieldGroupProps = {
	name?: string;
	parkingLevels: ParkingLevel[];
	variants: Variants;
	direction: 1 | -1;
};

const ParkingLevelFieldGroup = withFieldGroup({
	defaultValues: {
		packingLevelId: null as number | null,
	},
	props: {
		name: "Unknown",
		parkingLevels: [],
		variants: {},
		direction: 1,
	} as ParkingLevelFieldGroupProps,
	render: function Render({ group, name, parkingLevels, variants, direction }) {
		return (
			<motion.div
				custom={direction}
				variants={variants}
				initial="enter"
				animate="animate"
				exit="exit"
				className="flex flex-col gap-8 justify-center ml-auto max-w-lg"
			>
				<div className="space-y-4">
					<h1 className="text-5xl font-bold">
						Parkir {name?.toLowerCase()} ya!
					</h1>
					<h2 className="text-2xl font-semibold">
						Sekarang, silahkan pilih tempat parkir untuk {name?.toLowerCase()}{" "}
						anda.
					</h2>
				</div>
				<group.AppField name="packingLevelId">
					{(field) => (
						<div>
							<field.RadioGroup
								aria-label="Pilih Lantai Parkir"
								items={parkingLevels.map((level) => ({
									label: level.name,
									value: level.id.toString(),
								}))}
								buttonProps={{
									size: "md",
									className: cx(
										"w-full cursor-pointer ring ring-gray-400 rounded-lg p-4 data-selected:ring-bg-brand-solid data-selected:ring-2 hover:ring-2 hover:ring-gray-300 transition text-lg font-medium",
									),
								}}
								defaultValue={parkingLevels[0].id.toString()}
								isRequired
								className="w-full"
								size="md"
							/>
							<field.Errors firstOnly />
						</div>
					)}
				</group.AppField>
			</motion.div>
		);
	},
});

export default ParkingLevelFieldGroup;
