import Image from "next/image";

type MarketingPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
};

export function MarketingPhoto({
  src,
  alt,
  className = "object-cover",
  priority = false,
  fetchPriority,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: MarketingPhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
      sizes={sizes}
      className={className}
    />
  );
}
