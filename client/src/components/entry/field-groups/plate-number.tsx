import { motion, type Variants } from "motion/react";

import { withFieldGroup } from "@/lib/form";

type PlateNumberFieldGroupProps = {
	name?: string;
	variants: Variants;
	direction: 1 | -1;
};

const PlateNumberFieldGroup = withFieldGroup({
	defaultValues: {
		plateNumber: "",
	},
	props: {
		name: "Unknown",
		variants: {},
		direction: 1,
	} as PlateNumberFieldGroupProps,
	render: function Render({ group, name, variants, direction }) {
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
						Sekarang, silahkan masukkan data plat nomor {name?.toLowerCase()}{" "}
						anda.
					</h2>
				</div>
				<group.AppField name="plateNumber">
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

export default PlateNumberFieldGroup;
