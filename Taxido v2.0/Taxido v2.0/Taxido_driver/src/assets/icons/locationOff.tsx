import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="m8.199 16.618-2.272-2.272c-.554-.554-1.439-.675-2.081-.226a1.6 1.6 0 0 0-.393 2.244l4.058 5.701a8.35 8.35 0 0 0 6.638 3.286h1.739a6.958 6.958 0 0 0 6.958-6.958V5.869a1.39 1.39 0 0 0-1.392-1.391 1.39 1.39 0 0 0-1.392 1.39v5.393a.522.522 0 0 1-1.043 0V3.434a1.391 1.391 0 1 0-2.783 0v7.827a.522.522 0 0 1-1.044 0V2.1c0-.726-.531-1.375-1.255-1.444a1.391 1.391 0 0 0-1.528 1.385v9.219a.522.522 0 0 1-1.043 0V3.78a1.392 1.392 0 0 0-2.784 0V16.46c0 .2-.241.3-.383.159Z"
    />
  </svg>
)
export default SvgComponent
