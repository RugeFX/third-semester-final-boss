import { useStore } from "@tanstack/react-form";
import { motion, type Variants } from "motion/react";

import { Button } from "@/components/base/buttons/button";
import { RemoteSVG } from "@/components/svg/remote-svg";
import type { Category } from "@/lib/api/models";
import { withFieldGroup } from "@/lib/form";
import { cx } from "@/lib/utils/cx";

type CategoryFieldGroupProps = {
	categories: Category[];
	variants: Variants;
	direction: 1 | -1;
};

const CategoryFieldGroup = withFieldGroup({
	props: {
		categories: [],
		variants: {},
		direction: 1,
	} as CategoryFieldGroupProps,
	defaultValues: {
		categoryId: null as number | null,
	},
	render: function Render({ group, categories, variants, direction }) {
		const categoryId = useStore(
			group.store,
			(state) => state.values.categoryId,
		);

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
									const { id, name, icon } = category;
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
											<div
												className={cx(
													"grid place-items-center **:transition-colors **:fill-gray-400 group-hover:**:fill-bg-brand-solid",
													isSelected &&
														"**:fill-gray-500 group-hover:**:fill-gray-600",
												)}
											>
												{icon && <RemoteSVG url={icon} className="*:size-14" />}
											</div>
											<span className={cx(icon && "sr-only")}>{name}</span>
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
