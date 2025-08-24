"use client";

import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Share from './Share';

type Data = {
    request: string;
    response: string;
    time: string;
    tool: {
        name: string;
        alias: string;
    };
};

const ClientShareButton = ({ data }: { data: Data }) => {
    const shareRef = useRef<HTMLDivElement>(null);
    const [hidden, setHidden] = React.useState(true);

    const handleCapture = async () => {
        if (shareRef.current) {
            setHidden(false);
        }
    };

    useEffect(() => {
        const captureImage = async () => {
            if (hidden == false && shareRef.current) {
                const canvas = await html2canvas(shareRef.current);
                const imgData = canvas.toDataURL("image/png");
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                    newWindow.document.write(`
                        <html>
                            <head>
                                <title>Share Image</title>
                            </head>
                            <body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0;">
                                <img src="${imgData}" style="max-width: 100%; max-height: 100%;" />
                            </body>
                        </html>
                    `);
                    newWindow.document.close();
                }
                setHidden(true)
            }
        };
        captureImage();
    }, [hidden])

    return (
        <div>
            <button onClick={handleCapture} className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">
                分享
            </button>
            <div ref={shareRef} hidden={hidden}>
                <Share request={data.request} response={data.response} time={data.time} alias={data.tool.alias} />
            </div>
        </div>
    );
};

export default ClientShareButton;