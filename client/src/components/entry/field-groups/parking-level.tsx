import { ChevronLeft } from "@untitledui/icons";
import { motion } from "motion/react";

import { Button } from "@/components/base/buttons/button";
import type { ParkingLevel } from "@/lib/api/models";
import { withFieldGroup } from "@/lib/form";
import { cx } from "@/lib/utils/cx";

type ParkingLevelFieldGroupProps = {
	name?: string;
	parkingLevels: ParkingLevel[];
	onPreviousStep: () => void;
};

const ParkingLevelFieldGroup = withFieldGroup({
	defaultValues: {
		packingLevelId: null as number | null,
	},
	props: {
		name: "Unknown",
		parkingLevels: [],
		onPreviousStep: () => {},
	} as ParkingLevelFieldGroupProps,
	render: function Render({ group, name, parkingLevels, onPreviousStep }) {
		return (
			<motion.div
				initial={{
					x: "20%",
					opacity: 0,
				}}
				animate={{
					x: 0,
					opacity: 1,
					transition: {
						duration: 0.3,
						ease: "easeOut",
					},
				}}
				exit={{
					x: "20%",
					opacity: 0,
					transition: {
						duration: 0.3,
						ease: "easeIn",
					},
				}}
				className="flex flex-col gap-8 justify-center ml-auto max-w-lg"
			>
				<Button
					onClick={onPreviousStep}
					size="xl"
					color="secondary"
					className="w-max aspect-square"
					iconLeading={<ChevronLeft className="size-8" />}
				/>
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
								defaultValue={parkingLevels[0]?.id.toString()}
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
