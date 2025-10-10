import { ChevronLeft } from "@untitledui/icons";
import { motion } from "motion/react";

import { Button } from "@/components/base/buttons/button";
import { withFieldGroup } from "@/lib/form";

type ParkingLevelFieldGroupProps = {
	name?: string;
	onPreviousStep: () => void;
};

const ParkingLevelFieldGroup = withFieldGroup({
	defaultValues: {
		packingLevelId: null as number | null,
	},
	props: {
		name: "Unknown",
		onPreviousStep: () => {},
	} as ParkingLevelFieldGroupProps,
	render: function Render({ group, name, onPreviousStep }) {
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
							<field.TextInput
								isRequired
								label="Plat Nomor"
								placeholder="Masukkan Plat Nomor Anda"
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
