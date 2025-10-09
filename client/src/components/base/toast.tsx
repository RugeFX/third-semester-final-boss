import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = (props: ToasterProps) => {
	return (
		<Sonner
			theme="system"
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--color-gray-700)",
					"--normal-text": "var(--color-text-primary)",
					"--normal-border": "var(--color-border-primary)",
					"--success-bg": "var(--color-gray-700)",
					"--success-text": "var(--color-text-success-primary)",
					"--error-bg": "var(--color-gray-700)",
					"--error-text": "var(--color-text-error-primary)",
				} as React.CSSProperties
			}
			expand
			closeButton
			richColors
			{...props}
		/>
	);
};

export { Toaster };
