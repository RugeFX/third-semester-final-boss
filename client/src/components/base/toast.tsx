import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="system"
			className="toaster group"
			style={
				{
					"--normal-bg": "var(--color-bg-primary)",
					"--normal-text": "var(--color-text-primary)",
					"--normal-border": "var(--color-border-primary)",
				} as React.CSSProperties
			}
			expand
			closeButton
			{...props}
		/>
	);
};

export { Toaster };
