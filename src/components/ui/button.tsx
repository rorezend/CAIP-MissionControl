import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#50E6FF] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#0078D4] px-5 py-2 text-white hover:bg-[#106EBE]",
        secondary: "bg-white/8 px-5 py-2 text-white hover:bg-white/15",
        outline: "border border-white/20 bg-transparent px-5 py-2 text-white hover:bg-white/8",
        ghost: "bg-transparent px-3 py-2 text-neutral-300 hover:bg-white/8",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-4 text-xs",
        lg: "h-11 px-6",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
