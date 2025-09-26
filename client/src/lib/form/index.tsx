import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Eye, EyeOff } from "@untitledui/icons";
import { useState } from "react";
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
			<InputBase {...inputProps} />
		</InputGroupBase>
	);
}

function TextInput(props: InputProps) {
	const field = useFieldContext<string>();

	return (
		<Input
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
			label="Kata Sandi"
			className="w-full"
			size="md"
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

function Errors({ firstOnly = false }: ErrorsProps) {
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

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		InputGroup,
		TextInput,
		PasswordInput,
		Errors,
	},
	formComponents: {
		SubmitButton,
	},
});
