/** Bracket mark from the design. Inherits colour from its parent. */
export default function Logo({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M11 4H4v24h7" />
      <path d="M15 9h6v6h-6z" />
      <path d="M15 19h13" />
      <path d="M21 24h7" />
    </svg>
  )
}
