import { useState } from "react";

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const SkeletonImage = ({
  src,
  alt,
  className = "",
  fallbackSrc,
}: SkeletonImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const effectiveSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-slate-200 animate-pulse ${className}`}
        />
      )}
      <img
        src={effectiveSrc}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
