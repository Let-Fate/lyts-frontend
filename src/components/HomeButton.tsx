"use client";

import { useRouter } from 'next/navigation';

const HomeButton = () => {
    const router = useRouter();

    return (
        <button onClick={() => router.push('/')} className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">
            主页
        </button>
    );
};

export default HomeButton;
