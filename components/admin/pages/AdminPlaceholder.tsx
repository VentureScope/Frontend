import { adminCard, adminPageDesc, adminPageTitle } from "@/components/admin/ui/admin-styles";

type Props = {
  title: string;
  description?: string;
  noApi?: boolean;
};

export function AdminPlaceholder({
  title,
  description = "This module will connect to backend admin APIs when available.",
  noApi = false,
}: Props) {
  return (
    <div className={`${adminCard} space-y-3 p-6`}>
      <h1 className={adminPageTitle}>{title}</h1>
      <p className={`max-w-xl ${adminPageDesc}`}>{description}</p>
      {noApi ? (
        <div className="max-w-xl rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">
          <span className="font-medium text-warning">Not in API yet.</span>{" "}
          There is no admin endpoint for this screen in the current OpenAPI spec.
          Navigation is kept for planning; other admin pages use live APIs.
        </div>
      ) : null}
    </div>
  );
}
