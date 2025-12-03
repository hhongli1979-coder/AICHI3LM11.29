import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useValues } from '../../utils/context';
import appColors from '../../theme/appColors';

const SvgComponent = () => {
    const { isDark } = useValues();

    return (
        <Svg width={26} height={26} viewBox="0 0 26 26">
            <Path
                fill={isDark ? appColors.white : appColors.primaryFont}
                d="M8.265 3.868c.195-.106.401.058.401.279v14.717c0 .223-.152.412-.35.513a1.63 1.63 0 0 0-.05.027L5.72 20.855c-1.777 1.018-3.24.174-3.24-1.885V8.43c0-.683.488-1.528 1.095-1.875l4.69-2.687ZM15.972 6.622a.5.5 0 0 1 .278.448v14.342a.5.5 0 0 1-.717.45l-4.688-2.258a.5.5 0 0 1-.283-.45V4.748a.5.5 0 0 1 .722-.448l4.688 2.321ZM23.832 7.032v10.54c0 .683-.488 1.528-1.094 1.875l-3.845 2.203a.5.5 0 0 1-.748-.434V6.834a.5.5 0 0 1 .252-.434l2.196-1.253c1.776-1.019 3.239-.174 3.239 1.885Z"
            />
        </Svg>
    );
};

export default SvgComponent;
