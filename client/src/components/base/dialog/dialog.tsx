import { X } from "@untitledui/icons";
import type * as React from "react";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    type DialogProps as AriaDialogProps,
    DialogTrigger as AriaDialogTrigger,
    Heading as AriaHeading,
    type HeadingProps as AriaHeadingProps,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
    type ModalOverlayProps as AriaModalOverlayProps,
    composeRenderProps,
} from "react-aria-components";

import { cx, sortCx } from "@/lib/utils/cx";

const Dialog = AriaDialog;

const styles = sortCx({
    sheet: {
        base: [
            "fixed z-50 gap-4 bg-primary shadow-lg transition ease-in-out",
            "data-entering:duration-500 data-entering:animate-in",
            "data-exiting:duration-300 data-exiting:animate-out",
        ].join(" "),
        sides: {
            top: "inset-x-0 top-0 border-b data-entering:slide-in-from-top data-exiting:slide-out-to-top",
            bottom:
                "inset-x-0 bottom-0 border-t data-entering:slide-in-from-bottom data-exiting:slide-out-to-bottom",
            left: "inset-y-0 left-0 h-full w-3/4 border-r data-entering:slide-in-from-left data-exiting:slide-out-to-left sm:max-w-sm",
            right:
                "inset-y-0 right-0 h-full w-3/4 border-l data-entering:slide-in-from-right data-exiting:slide-out-to-right sm:max-w-sm",
        },
    },
    overlay: [
        "fixed inset-0 z-50 bg-black/80",
        "data-exiting:duration-300 data-exiting:animate-out data-exiting:fade-out-0",
        "data-entering:animate-in data-entering:fade-in-0",
    ].join(" "),
    modal: {
        default:
            "fixed text-primary left-[50vw] top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-secondary bg-primary p-6 shadow-lg duration-200 data-exiting:duration-300 data-entering:animate-in data-exiting:animate-out data-entering:fade-in-0 data-exiting:fade-out-0 data-entering:zoom-in-95 data-exiting:zoom-out-90 sm:rounded-lg md:w-full",
        sheet: "h-full p-6",
    },
    dialog: {
        default: "h-full outline-none",
        withGrid: "grid h-full gap-4",
    },
    closeButton:
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-disabled:pointer-events-none data-entering:bg-accent data-entering:text-muted-foreground data-hovered:opacity-100 data-focused:outline-none data-focused:ring-2 data-focused:ring-ring data-focused:ring-offset-2",
    header: "flex flex-col space-y-1.5 text-center sm:text-left",
    footer: "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
    title: "text-lg font-semibold leading-none tracking-tight",
    description: "flex flex-col space-y-1.5 text-center sm:text-left",
});

const DialogTrigger = AriaDialogTrigger;

const DialogOverlay = ({
    className,
    isDismissable = true,
    ...props
}: AriaModalOverlayProps) => (
    <AriaModalOverlay
        isDismissable={isDismissable}
        className={composeRenderProps(className, (className) =>
            cx(styles.overlay, className),
        )}
        {...props}
    />
);

interface DialogContentProps
    extends Omit<React.ComponentProps<typeof AriaModal>, "children"> {
    children?: AriaDialogProps["children"];
    role?: AriaDialogProps["role"];
    closeButton?: boolean;
    side?: keyof typeof styles.sheet.sides;
}

const DialogContent = ({
    className,
    children,
    side,
    role,
    closeButton = true,
    ...props
}: DialogContentProps) => (
    <AriaModal
        className={composeRenderProps(className, (className) =>
            cx(
                side
                    ? cx(styles.sheet.base, styles.sheet.sides[side], styles.modal.sheet)
                    : styles.modal.default,
                className,
            ),
        )}
        {...props}
    >
        <AriaDialog
            role={role}
            className={cx(!side && styles.dialog.withGrid, styles.dialog.default)}
        >
            {composeRenderProps(children, (children, renderProps) => (
                <>
                    {children}
                    {closeButton && (
                        <AriaButton
                            onPress={renderProps.close}
                            className={styles.closeButton}
                        >
                            <X className="size-4" />
                            <span className="sr-only">Close</span>
                        </AriaButton>
                    )}
                </>
            ))}
        </AriaDialog>
    </AriaModal>
);

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cx(styles.header, className)} {...props} />
);

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cx(styles.footer, className)} {...props} />
);

const DialogTitle = ({ className, ...props }: AriaHeadingProps) => (
    <AriaHeading
        slot="title"
        className={cx(styles.title, className)}
        {...props}
    />
);

const DialogDescription = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cx(styles.description, className)} {...props} />
);

export {
    Dialog,
    DialogOverlay,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
};
export type { DialogContentProps };
