"use client"
import { QRCodeCanvas } from "qrcode.react";


export default function Share({ request, response, time, alias }: { request: string, response: string, time: string, alias: string }) {


    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor: '#f4f8fb' }}>
            <h1 className="text-4xl font-extrabold text-center mb-4 whitespace-pre-line">{request.replace(/\\n/g, '\n').replace(/\n\s*\n/g, '\n\n')}</h1>
            <p className="text-sm text-gray-500 text-center mb-6">{time}</p>
            <p className="mt-6 text-xs text-gray-700 whitespace-pre-line">{response}</p>
            <div className="mt-6 flex justify-center">
                <QRCodeCanvas value={`${window.location.origin}/${alias.split("_")[0]}`} size={128} />
            </div>
            <p className="mt-6 text-center text-red-600 text-xl font-semibold">{"扫码立即免费体验"}</p>
        </div>
    );
}
