"use client";

import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  type ToasterProps,
} from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";

const toastBase =
  "group-[.toaster]:!rounded-md group-[.toaster]:!border group-[.toaster]:!p-4 group-[.toaster]:!shadow-md group-[.toaster]:!backdrop-blur-sm";

const toastSuccess = [
  toastBase,
  "group-[.toaster]:!border-success/30",
  "group-[.toaster]:!bg-[color-mix(in_srgb,var(--success)_14%,var(--card))]",
  "group-[.toaster]:!text-foreground",
  "[&_[data-icon]]:!text-success",
  "[&_[data-close-button]]:!border-success/25",
  "[&_[data-close-button]]:!bg-success/10",
].join(" ");

const toastError = [
  toastBase,
  "group-[.toaster]:!border-destructive/30",
  "group-[.toaster]:!bg-[color-mix(in_srgb,var(--destructive)_14%,var(--card))]",
  "group-[.toaster]:!text-foreground",
  "[&_[data-icon]]:!text-destructive",
  "[&_[data-close-button]]:!border-destructive/25",
  "[&_[data-close-button]]:!bg-destructive/10",
].join(" ");

const toastNeutral = [
  toastBase,
  "group-[.toaster]:!border-border",
  "group-[.toaster]:!bg-card",
  "group-[.toaster]:!text-foreground",
  "[&_[data-icon]]:!text-muted-foreground",
].join(" ");

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      closeButton
      offset={16}
      gap={10}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 shrink-0" />,
        info: <InfoIcon className="size-4 shrink-0" />,
        warning: <TriangleAlertIcon className="size-4 shrink-0" />,
        error: <OctagonXIcon className="size-4 shrink-0" />,
        loading: <Loader2Icon className="size-4 shrink-0 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          title: "text-sm font-semibold leading-snug",
          description: "text-sm text-muted-foreground",
          success: toastSuccess,
          error: toastError,
          warning: toastError,
          info: toastError,
          default: toastError,
          loading: toastNeutral,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
