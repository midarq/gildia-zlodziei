"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

return (
  <button {...props} type="submit" aria-disabled={pending}>
    {isPending ? (
      <span className="flex items-center gap-2">
        <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-foreground rounded-full" />
        {pendingText}
      </span>
    ) : (
      children
    )}
  </button>
);
}
