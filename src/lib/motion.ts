export const EASE = [0.22, 1, 0.36, 1] as const;

export const EASE_SPRING = { type: "spring", stiffness: 260, damping: 20 } as const;

export const EASE_MAGNETIC = { stiffness: 120, damping: 12, mass: 0.1 } as const;