import { adminCard, adminPageDesc, adminPageTitle } from "@/components/admin/ui/admin-styles";

type Props = {
  title: string;
  description?: string;
};

export function AdminPlaceholder({
  title,
  description = "This section is under active development.",
}: Props) {
  return (
    <div className={`${adminCard} space-y-3 p-6`}>
      <h1 className={adminPageTitle}>{title}</h1>
      <p className={`max-w-xl ${adminPageDesc}`}>{description}</p>
    </div>
  );
}
