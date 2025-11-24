import * as React from "react";
import { cn } from "@/src/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "border border-neutral-300 px-3 py-2 rounded-md w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-black",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
