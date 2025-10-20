import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Eye, EyeOff } from "@untitledui/icons";
import { type ComponentProps, Fragment, useState } from "react";

import { Button, type ButtonProps } from "@/components/base/buttons/button";
import {
	Input,
	InputBase,
	type InputBaseProps,
	type InputProps,
} from "@/components/base/input/input";
import {
	InputGroup as InputGroupBase,
	type InputGroupProps,
} from "@/components/base/input/input-group";
import {
	PinInput as BasePinInput,
	type PinInputProps as BasePinInputProps,
	type PinInputGroupProps,
} from "@/components/base/pin-input/pin-input";
import {
	RadioGroup as BaseRadioGroup,
	RadioButton,
	type RadioButtonProps,
	type RadioGroupProps,
} from "@/components/base/radio-buttons/radio-buttons";
import { cx } from "../utils/cx";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

interface FormInputGroupProps {
	groupProps?: Omit<InputGroupProps, "children">;
	inputProps?: InputBaseProps;
}

function InputGroup({ groupProps, inputProps }: FormInputGroupProps) {
	const field = useFieldContext<string>();

	return (
		<InputGroupBase
			name={field.name}
			value={field.state.value}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
			isInvalid={field.state.meta.errors.length > 0}
			{...groupProps}
		>
			<InputBase size="xl" {...inputProps} />
		</InputGroupBase>
	);
}

function TextInput(props: InputProps) {
	const field = useFieldContext<string>();

	return (
		<Input
			size="xl"
			name={field.name}
			isInvalid={field.state.meta.errors.length > 0}
			value={field.state.value}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
			{...props}
		/>
	);
}

function PasswordInput({ groupProps, inputProps }: FormInputGroupProps) {
	const [showPassword, setShowPassword] = useState(false);
	const field = useFieldContext<string>();

	return (
		<InputGroupBase
			size="xl"
			label="Kata Sandi"
			className="w-full"
			name={field.name}
			value={field.state.value}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
			isInvalid={field.state.meta.errors.length > 0}
			trailingAddon={
				<Button
					color="secondary"
					onClick={() => setShowPassword((prev) => !prev)}
					aria-label={showPassword ? "Hide password" : "Show password"}
					className="h-full"
				>
					{showPassword ? (
						<EyeOff className="size-5 text-brand-500" />
					) : (
						<Eye className="size-5 text-brand-500" />
					)}
				</Button>
			}
			{...groupProps}
		>
			<InputBase
				type={showPassword ? "text" : "password"}
				placeholder="Masukkan Kata Sandi Anda"
				{...inputProps}
			/>
		</InputGroupBase>
	);
}

interface FormRadioGroupProps extends Omit<RadioGroupProps, "children"> {
	items: {
		label: string;
		value: string | number;
		hint?: string;
	}[];
	buttonProps?: Omit<RadioButtonProps, "label" | "value" | "hint">;
}

function RadioGroup({ items, buttonProps, ...props }: FormRadioGroupProps) {
	const field = useFieldContext<string | number>();

	return (
		<BaseRadioGroup
			name={field.name}
			value={String(field.state.value)}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
			isInvalid={field.state.meta.errors.length > 0}
			{...props}
		>
			{items.map((item) => (
				<RadioButton
					key={item.value}
					label={item.label}
					hint={item.hint}
					value={String(item.value)}
					{...buttonProps}
				/>
			))}
		</BaseRadioGroup>
	);
}

interface PinInputProps extends Omit<BasePinInputProps, "children"> {
	length: number;
	groupProps?: Omit<PinInputGroupProps, "children" | "render" | "maxLength">;
	slotProps?: ComponentProps<"div">;
}

function PinInput({ length, groupProps, slotProps, ...props }: PinInputProps) {
	const field = useFieldContext<string>();

	return (
		<BasePinInput size="lg" {...props}>
			<BasePinInput.Group
				inputMode="text"
				maxLength={length}
				value={field.state.value}
				onChange={field.handleChange}
				onBlur={field.handleBlur}
				isInvalid={field.state.meta.errors.length > 0}
				{...groupProps}
				containerClassName={cx("group", groupProps?.containerClassName)}
			>
				{Array(length)
					.fill(0)
					.map((_, i) => (
						<Fragment key={`slot-${i + 1}`}>
							{i === Math.floor(length / 2) && (
								<BasePinInput.Separator className="text-gray-400" />
							)}
							<BasePinInput.Slot index={i} {...slotProps} />
						</Fragment>
					))}
			</BasePinInput.Group>
		</BasePinInput>
	);
}

function SubmitButton(props: ButtonProps) {
	const form = useFormContext();

	return (
		<form.Subscribe
			selector={(state) =>
				[state.isSubmitting, state.canSubmit, state.isPristine] as const
			}
		>
			{([isSubmitting, canSubmit, isPristine]) => (
				<Button
					type="submit"
					size="xl"
					onClick={form.handleSubmit}
					isLoading={isSubmitting}
					isDisabled={!canSubmit || isPristine}
					{...props}
				/>
			)}
		</form.Subscribe>
	);
}

interface ErrorsProps {
	firstOnly?: boolean;
}

function FieldErrors({ firstOnly = false }: ErrorsProps) {
	const field = useFieldContext<string>();

	return field.state.meta.errors.length > 0 && !firstOnly ? (
		<ul className="space-y-1 text-sm list-disc list-inside text-error-primary">
			{field.state.meta.errors.map((error: Error) => (
				<li key={error.message}>{error.message}</li>
			))}
		</ul>
	) : field.state.meta.errors.length > 0 && firstOnly ? (
		<span className="text-sm text-error-primary">
			{field.state.meta.errors[0].message}
		</span>
	) : null;
}

function FormErrors({ firstOnly = false }: ErrorsProps) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.errors}>
			{(errors) =>
				errors.length > 0 && !firstOnly ? (
					<ul className="space-y-1 text-sm list-disc list-inside text-error-primary">
						{errors.map((error: Error) => (
							<li key={error.message}>{error.message}</li>
						))}
					</ul>
				) : errors.length > 0 && firstOnly ? (
					<span className="block text-sm text-error-primary">
						{errors[0].message}
					</span>
				) : null
			}
		</form.Subscribe>
	);
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		InputGroup,
		TextInput,
		PasswordInput,
		RadioGroup,
		PinInput,
		Errors: FieldErrors,
	},
	formComponents: {
		SubmitButton,
		Errors: FormErrors,
	},
});
