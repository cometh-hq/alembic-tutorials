import { createElement } from "react";
import { cn } from "../../utils";

export interface ITextProps {
  content: string;
  component?: string;
  variant?: string;
  className?: string;
}

export function Text({
  content,
  component = "p",
  variant,
  className,
}: ITextProps) {
  function renderVariant(variant: string) {
    switch (variant) {
      case "h1":
        return "text-[28px] md:text-[48px] font-bold";
      case "h2":
        return "text-xl md:text-3xl font-bold";
      case "h3":
        return "text-2xl font-bold";
      case "h4":
        return "text-xl font-bold";
      case "h5":
        return "text-lg font-bold";
      case "h6":
        return "text-base font-bold";
      case "p":
        return "text-base";
      case "span":
        return "text-sm";
      case "caption":
        return "text-xs";
      default:
        return "text-base";
    }
  }

  return createElement(
    component,
    {
      className: cn(renderVariant(variant ?? component), className),
    },
    content
  );
}
