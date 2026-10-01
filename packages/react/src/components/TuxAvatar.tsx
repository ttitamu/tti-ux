import React, { useState } from "react";
import "./tux-avatar.css";

export interface TuxAvatarProps {
  name?: string;
  initials?: string;
  photoUrl?: string;
  size?: "sm" | "md" | "lg";
  dot?: "success" | "warning" | "error" | "info";
  decorative?: boolean;
  alt?: string;
  className?: string;
}

export const TuxAvatar: React.FC<TuxAvatarProps> = ({
  name,
  initials,
  photoUrl,
  size = "md",
  dot,
  decorative = true,
  alt,
  className = "",
}) => {
  const [photoFailed, setPhotoFailed] = useState(false);

  const derivedInitials = initials || (
    (name ?? "")
      .split(/[\s,]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("")
  );

  const showPhoto = !!photoUrl && !photoFailed;

  return (
    <span
      className={`tux-avatar tux-avatar--${size} ${className}`.trim()}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt || name}
    >
      {showPhoto ? (
        <img
          src={photoUrl}
          alt=""
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        derivedInitials || "?"
      )}
      {dot && (
        <span
          className={`tux-avatar__dot tux-avatar__dot--${dot}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
};
