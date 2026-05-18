"use client";

import { useState } from "react";
import { ExternalLink, Package, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { ORGANIZATION_PRODUCT_TYPES } from "@/lib/organization-create-constants";
import type {
  OrganizationProduct,
  OrganizationProductType,
} from "@/types/organization-profile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function newProductId() {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function productTypeLabel(type: OrganizationProductType): string {
  return (
    ORGANIZATION_PRODUCT_TYPES.find((t) => t.value === type)?.label ?? type
  );
}

type Props = {
  products: OrganizationProduct[];
  onChange: (products: OrganizationProduct[]) => void;
  readOnly?: boolean;
};

export function OrganizationProductsEditor({
  products,
  onChange,
  readOnly = false,
}: Props) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<OrganizationProduct | null>(null);
  const [repoInput, setRepoInput] = useState("");

  function startNew() {
    setDraft({
      id: newProductId(),
      name: "",
      productType: "website",
      hostedUrl: "",
      description: "",
      linkedRepos: [],
    });
    setEditingId("new");
    setRepoInput("");
  }

  function startEdit(product: OrganizationProduct) {
    setDraft({ ...product });
    setEditingId(product.id);
    setRepoInput("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
    setRepoInput("");
  }

  function saveProduct() {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (editingId === "new") {
      onChange([...products, draft]);
    } else {
      onChange(products.map((p) => (p.id === draft.id ? draft : p)));
    }
    cancelEdit();
    toast.success("Product saved.");
  }

  function removeProduct(id: string) {
    onChange(products.filter((p) => p.id !== id));
    if (editingId === id) cancelEdit();
  }

  function addRepo() {
    if (!draft) return;
    const value = repoInput.trim();
    if (!value) return;
    if (!value.includes("/")) {
      toast.error("Use owner/repository format.");
      return;
    }
    if (draft.linkedRepos.includes(value)) return;
    setDraft({ ...draft, linkedRepos: [...draft.linkedRepos, value] });
    setRepoInput("");
  }

  function removeRepo(repo: string) {
    if (!draft) return;
    setDraft({
      ...draft,
      linkedRepos: draft.linkedRepos.filter((r) => r !== repo),
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Document what your company ships—live URLs, product type, narrative, and
        repos that power each offering.
      </p>

      {products.length > 0 && (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product.id}
              className={cn(
                "vs-surface rounded-md border p-4",
                editingId === product.id && "border-primary/40",
              )}
            >
              {editingId === product.id && draft ? (
                <ProductForm
                  draft={draft}
                  setDraft={setDraft}
                  repoInput={repoInput}
                  setRepoInput={setRepoInput}
                  onAddRepo={addRepo}
                  onRemoveRepo={removeRepo}
                  onSave={saveProduct}
                  onCancel={cancelEdit}
                />
              ) : (
                <ProductCard
                  product={product}
                  readOnly={readOnly}
                  onEdit={() => startEdit(product)}
                  onRemove={() => removeProduct(product.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {readOnly && products.length === 0 && (
        <p className="text-sm text-muted-foreground">No products listed yet.</p>
      )}

      {!readOnly && editingId === "new" && draft && (
        <li className="vs-surface-accent list-none rounded-md border border-primary/30 p-4">
          <p className="mb-4 text-xs font-semibold text-foreground">New product</p>
          <ProductForm
            draft={draft}
            setDraft={setDraft}
            repoInput={repoInput}
            setRepoInput={setRepoInput}
            onAddRepo={addRepo}
            onRemoveRepo={removeRepo}
            onSave={saveProduct}
            onCancel={cancelEdit}
          />
        </li>
      )}

      {!readOnly && editingId !== "new" && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={startNew}
        >
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      )}
    </div>
  );
}

function ProductCard({
  product,
  readOnly,
  onEdit,
  onRemove,
}: {
  product: OrganizationProduct;
  readOnly: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="vs-icon-tile-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{product.name}</p>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
              {productTypeLabel(product.productType)}
            </span>
          </div>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md p-2 text-muted-foreground hover:text-destructive"
              aria-label="Remove product"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {product.hostedUrl && (
        <a
          href={product.hostedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {product.hostedUrl}
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {product.description && (
        <p className="text-sm text-muted-foreground">{product.description}</p>
      )}
      {product.linkedRepos.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Linked repos
          </p>
          <ul className="mt-1 space-y-0.5 text-sm text-foreground">
            {product.linkedRepos.map((repo) => (
              <li key={repo}>{repo}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  draft,
  setDraft,
  repoInput,
  setRepoInput,
  onAddRepo,
  onRemoveRepo,
  onSave,
  onCancel,
}: {
  draft: OrganizationProduct;
  setDraft: (p: OrganizationProduct) => void;
  repoInput: string;
  setRepoInput: (v: string) => void;
  onAddRepo: () => void;
  onRemoveRepo: (repo: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Product name</FieldLabel>
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="VentureScope Platform"
            className="h-9"
          />
        </Field>
        <Field>
          <FieldLabel>Product type</FieldLabel>
          <select
            value={draft.productType}
            onChange={(e) =>
              setDraft({
                ...draft,
                productType: e.target.value as OrganizationProductType,
              })
            }
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm"
          >
            {ORGANIZATION_PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field>
        <FieldLabel>Hosted URL</FieldLabel>
        <Input
          value={draft.hostedUrl}
          onChange={(e) => setDraft({ ...draft, hostedUrl: e.target.value })}
          placeholder="https://app.example.com"
          className="h-9"
        />
        <FieldDescription>Where customers or users access this product.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm"
          placeholder="What this product does and who it serves."
        />
      </Field>
      <Field>
        <FieldLabel>Linked repositories</FieldLabel>
        <div className="flex gap-2">
          <Input
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            placeholder="owner/repository"
            className="h-9 flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAddRepo();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={onAddRepo}>
            Add repo
          </Button>
        </div>
        {draft.linkedRepos.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {draft.linkedRepos.map((repo) => (
              <li
                key={repo}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
              >
                {repo}
                <button
                  type="button"
                  onClick={() => onRemoveRepo(repo)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>
      <div className="flex gap-2">
        <Button type="button" size="sm" onClick={onSave}>
          Save product
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
