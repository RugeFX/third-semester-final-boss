import { useStore } from "@tanstack/react-form";
import { motion } from "motion/react";

import { Button } from "@/components/base/buttons/button";
import { withFieldGroup } from "@/lib/form";
import { cx } from "@/lib/utils/cx";
import { categories } from "../data";

const CategoryFieldGroup = withFieldGroup({
	defaultValues: {
		categoryId: null as number | null,
	},
	render: function Render({ group }) {
		const categoryId = useStore(
			group.store,
			(state) => state.values.categoryId,
		);

		return (
			<motion.div
				initial={{
					x: "-20%",
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
					x: "-20%",
					opacity: 0,
					transition: {
						duration: 0.3,
						ease: "easeIn",
					},
				}}
				className="flex flex-col gap-8 justify-center ml-auto max-w-lg"
			>
				<div className="space-y-4">
					<h1 className="text-5xl font-bold">Halo, Selamat Pagi!</h1>
					<h2 className="text-2xl font-semibold">
						Silahkan pilih kategori kendaraan yang ingin anda parkir.
					</h2>
				</div>
				<group.AppField name="categoryId">
					{(field) => (
						<>
							<div className="flex gap-4">
								{categories.map((category) => {
									const { id, name, icon: Icon } = category;
									const isSelected = categoryId === id;

									return (
										<Button
											key={id}
											color={isSelected ? "primary" : "secondary"}
											size="xl"
											className={cx(
												"group aspect-square w-full max-h-24",
												!isSelected && "bg-gray-500",
											)}
											onClick={() => field.handleChange(id)}
										>
											<Icon
												className={cx(
													"transition-inherit-all size-14 fill-gray-400 group-hover:fill-bg-brand-solid",
													isSelected &&
														"fill-gray-500 group-hover:fill-gray-600",
												)}
											/>
											<span className="sr-only">{name}</span>
										</Button>
									);
								})}
							</div>
							<field.Errors firstOnly />
						</>
					)}
				</group.AppField>
			</motion.div>
		);
	},
});

export default CategoryFieldGroup;
