import type { ImgHTMLAttributes } from "react";

export type StaticImageData = string;

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
};

export default function ResponsiveImage({ src, alt = "", fill, priority, className = "", ...props }: ResponsiveImageProps) {
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className={`${fill ? "absolute inset-0 h-full w-full " : ""}${className}`} {...props}/>;
}
