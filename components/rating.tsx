import { Star } from 'lucide-react'

/**
 * Star rating. Filled stars use the template's primary orange; nothing else is
 * invented.
 */
export function Stars({
  value,
  size = 'sm',
  showValue = true,
}: {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}) {
  const px = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-[18px] w-[18px]' : 'h-4 w-4'
  const rounded = Math.round(value * 2) / 2

  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => {
          const state = rounded >= index + 1 ? 'full' : rounded >= index + 0.5 ? 'half' : 'empty'
          return (
            <span key={index} className="relative inline-flex">
              <Star className={`${px} text-[color:var(--nb-border)]`} strokeWidth={1.5} fill="currentColor" />
              {state !== 'empty' ? (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: state === 'half' ? '50%' : '100%' }}
                >
                  <Star className={`${px} text-[color:var(--nb-primary)]`} strokeWidth={1.5} fill="currentColor" />
                </span>
              ) : null}
            </span>
          )
        })}
      </span>
      {showValue ? <span className="text-[13px] font-bold text-[color:var(--nb-secondary)]">{value.toFixed(1)}</span> : null}
    </span>
  )
}

export default Stars
