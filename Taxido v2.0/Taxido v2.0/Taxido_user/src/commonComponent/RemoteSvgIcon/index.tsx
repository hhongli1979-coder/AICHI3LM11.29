import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';

const RemoteSvgIcon = ({ uri }: { uri: string }) => {
    const [svgXmlData, setSvgXmlData] = useState<string | null>(null);

    useEffect(() => {
        fetch(uri)
            .then(response => response.text())
            .then(setSvgXmlData)
            .catch(err => {
                console.error('SVG fetch error:', err);
                setSvgXmlData(null);
            });
    }, [uri]);

    if (!svgXmlData) return <ActivityIndicator size="small" color="#999" />;

    return <SvgXml xml={svgXmlData} width="40" height="40" />;
};

export default RemoteSvgIcon;
