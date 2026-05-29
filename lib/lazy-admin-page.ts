import dynamic from "next/dynamic";
import { createElement, type ComponentType } from "react";
import { AdminPageLoading } from "@/components/admin/AdminPageLoading";

const adminLoading = () => createElement(AdminPageLoading);

/** Code-split admin page modules (reduces main dashboard bundle). */
export function lazyAdminPage<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
) {
  return dynamic(loader, {
    ssr: false,
    loading: adminLoading,
  });
}

export function lazyAdminNamedPage<P extends object>(
  loader: () => Promise<Record<string, ComponentType<P>>>,
  exportName: string,
) {
  return dynamic(
    () =>
      loader().then((mod) => ({
        default: mod[exportName] as ComponentType<P>,
      })),
    {
      ssr: false,
      loading: adminLoading,
    },
  );
}
