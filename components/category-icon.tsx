import {
  HardHat,
  Layers,
  PaintBucket,
  Plane,
  Ruler,
  Warehouse,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/**
 * Category icons. The template carries a seven glyph construction icon font
 * (Flaticon) which is too small a set for eight trades, so the same silhouette
 * weight is kept with lucide-react, already part of the project. The Flaticon
 * crane remains the brand mark, exactly as the template uses it.
 */
const ICONS: Record<string, LucideIcon> = {
  architecture: Ruler,
  engineer: Zap,
  'engineer-1': Plane,
  worker: Wrench,
  'worker-1': Layers,
  crane: Warehouse,
  hammer: PaintBucket,
  paint: PaintBucket,
  interior: Layers,
}

export function categoryIcon(key: string): LucideIcon {
  return ICONS[key] ?? Wrench
}

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = categoryIcon(icon)
  return <Icon className={className} aria-hidden="true" />
}

export default CategoryIcon
