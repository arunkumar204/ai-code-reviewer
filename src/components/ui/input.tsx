import * as React from "react";
import { cn } from "@/src/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "border border-neutral-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
