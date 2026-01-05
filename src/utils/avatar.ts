export const getUserInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

export const getAvatarColor = (name: string): string => {
  const colors = [
    "#E53E3E", // Red
    "#38A169", // Green
    "#3182CE", // Blue
    "#805AD5", // Purple
    "#D69E2E", // Yellow
    "#DD6B20", // Orange
    "#C53030", // Dark Red
    "#2D3748", // Dark Gray
    "#1A365D", // Dark Blue
    "#553C9A", // Dark Purple
    "#744210", // Dark Brown
    "#97266D", // Pink
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getAvatarProps = (
  name: string,
  photoURL?: string | null,
  size: "sm" | "md" | "lg" = "md",
) => {
  const sizeMap = {
    sm: { width: 20, height: 20, borderRadius: 10, fontSize: 10 },
    md: { width: 32, height: 32, borderRadius: 16, fontSize: 14 },
    lg: { width: 48, height: 48, borderRadius: 24, fontSize: 20 },
  };

  const dimensions = sizeMap[size];

  return {
    hasPhoto: !!photoURL,
    photoURL,
    initial: getUserInitial(name),
    color: getAvatarColor(name),
    ...dimensions,
  };
};
