import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Notification() {
  return (
    <Svg width={69} height={69} fill="none">
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={4.128}
        d="M34.47 5.736c-10.438 0-18.92 8.483-18.92 18.92v9.114c0 1.923-.82 4.856-1.798 6.495l-3.627 6.023c-2.238 3.721-.693 7.852 3.406 9.24a65.971 65.971 0 0 0 41.845 0c3.815-1.262 5.487-5.771 3.406-9.24l-3.627-6.023c-.946-1.64-1.766-4.572-1.766-6.495v-9.114c0-10.406-8.514-18.92-18.92-18.92Z"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={4.128}
        d="M40.29 6.649a19.091 19.091 0 0 0-3.028-.63c-3.027-.38-5.928-.158-8.64.63a6.26 6.26 0 0 1 5.834-3.973 6.26 6.26 0 0 1 5.833 3.973Z"
      />
      <Path
        stroke="#fff"
        strokeMiterlimit={10}
        strokeWidth={4.128}
        d="M43.927 56.665c0 5.203-4.257 9.46-9.46 9.46a9.493 9.493 0 0 1-6.685-2.775 9.493 9.493 0 0 1-2.775-6.685"
      />
    </Svg>
  );
}
