import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import appColors from '../../theme/appColors'

const CarMarker = () => (
    <Svg width={20} height={36}>
        <Path
            d="M15.273 35.996H4.723a2.892 2.892 0 0 1-2.899-2.883V6.246C1.824 2.796 4.633 0 8.102 0h3.793c3.468 0 6.277 2.797 6.277 6.246V33.11a2.892 2.892 0 0 1-2.899 2.887Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: appColors.primary,
                fillOpacity: 1,
            }}
        />
        <Path
            d="M11.996 34.375H8c-3.219 0-4.832-.54-4.832-3.738l1.176-14.68-2.172-9.11C2.172 3.493 4.91.77 8.282.77h3.429c3.375 0 6.11 2.722 6.11 6.078l-2.169 9.109 1.172 14.68c0 3.199-1.61 3.738-4.828 3.738Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#126a55",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M2.129 11.316c.453-.074.308.801 0 1-.305.2-2.129.602-2.129.602s0-1.238 2.129-1.602Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: appColors.primary,
                fillOpacity: 1,
            }}
        />
        <Path
            d="M2.418 9.36s1.242 6.038 1.36 7.199c.12 1.156.242 13.156 0 13.675-.239.52-.61.403-.61.403s-.75-1.403-.75-8.48V9.358Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#9ad7f1",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M2.816 32.754c.079.32 1.446 1.762 1.528 2.039.078.281-.723.617-1.528-.242-.808-.856 0-1.797 0-1.797Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#ff6166",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M4.582 34.375s.984.258 1.387 1c0 0-1.266-.063-1.387-1Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#fc0",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M2.734 4.758S2.512 2 5.277 1.32c0 0-.734 2.559-2.543 3.438Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#bfe7fa",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M17.863 11.316c-.453-.074-.308.801 0 1 .309.2 2.13.602 2.13.602s0-1.238-2.13-1.602Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: appColors.primary,
                fillOpacity: 1,
            }}
        />
        <Path
            d="M17.578 9.36s-1.242 6.038-1.36 7.199c-.12 1.156-.241 13.156 0 13.675.239.52.61.403.61.403s.75-1.403.75-8.48V9.358ZM4.344 15.957s-1.426-6.078-1.176-7.2c.25-1.12 3.375-1.956 6.828-1.956 3.453 0 6.582.836 6.828 1.957.25 1.12-1.172 7.199-1.172 7.199s-1.91-.363-5.656-.363c-3.746.004-5.652.363-5.652.363Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#9ad7f1",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M4.582 32.754s1.219 1.039 5.414 1.039c4.195 0 5.414-1.04 5.414-1.04l.844.642c-2.492 1.8-6.258 1.601-6.258 1.601s-3.766.2-6.258-1.601Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#115444",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M17.18 32.754c-.078.32-1.446 1.762-1.528 2.039-.078.281.723.617 1.528-.242.804-.856 0-1.797 0-1.797Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#ff6166",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M15.41 34.375s-.984.258-1.387 1c0 0 1.266-.063 1.387-1Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#fc0",
                fillOpacity: 1,
            }}
        />
        <Path
            d="M17.262 4.758S17.484 2 14.719 1.32c0 0 .734 2.559 2.543 3.438Zm0 0"
            style={{
                stroke: "none",
                fillRule: "nonzero",
                fill: "#bfe7fa",
                fillOpacity: 1,
            }}
        />
    </Svg>
)
export default CarMarker
