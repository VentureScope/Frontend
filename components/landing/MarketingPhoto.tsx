import Image from "next/image";

type MarketingPhotoProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function MarketingPhoto({
  src,
  alt,
  className = "object-cover",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: MarketingPhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
