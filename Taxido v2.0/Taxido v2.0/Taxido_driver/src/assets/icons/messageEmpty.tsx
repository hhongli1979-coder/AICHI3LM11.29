import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import SvgComponentProps from './type'

const SvgComponent: React.FC<SvgComponentProps> = ({ color }) => (
  <Svg width={20} height={20} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="m15.392 14.025.325 2.633c.083.692-.658 1.175-1.25.817L10.975 15.4c-.383 0-.758-.025-1.124-.075a4.05 4.05 0 0 0 .983-2.633c0-2.367-2.05-4.284-4.583-4.284-.967 0-1.859.275-2.6.758a5.282 5.282 0 0 1-.034-.633c0-3.791 3.292-6.866 7.359-6.866 4.066 0 7.358 3.075 7.358 6.866 0 2.25-1.159 4.242-2.942 5.492Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M10.833 12.691c0 .992-.367 1.909-.984 2.634-.825 1-2.133 1.642-3.6 1.642l-2.175 1.291c-.366.225-.833-.083-.783-.508l.208-1.642c-1.116-.775-1.833-2.017-1.833-3.417 0-1.466.783-2.758 1.983-3.524a4.736 4.736 0 0 1 2.6-.759c2.534 0 4.584 1.917 4.584 4.284Z"
    />
  </Svg>
)
export default SvgComponent
