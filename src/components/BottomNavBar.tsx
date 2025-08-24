"use client"
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function BottomNavBar() {
    const [active, setActive] = useState("home");
    const [isVisible, setIsVisible] = useState(true);
    const router = useRouter();

    // useEffect(() => {
    //     let lastScrollY = window.scrollY;

    //     const handleScroll = () => {
    //         if (window.scrollY < lastScrollY) {
    //             setIsVisible(true);
    //         } else {
    //             setIsVisible(false);
    //         }
    //         lastScrollY = window.scrollY;
    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);  

    return (
        <div className={`fixed bottom-0 w-full shadow-lg bg-gradient-to-r from-red-400 to-yellow-600 mt-4`}>
            <nav className="flex justify-around py-2">
                <NavItem
                    label="首页"
                    icon={<GroupIcon />}
                    isActive={false}
                    onClick={() => {
                        router.push("/")
                    }}
                />
                <NavItem
                    label="个人中心"
                    icon={<ProfileIcon />}
                    isActive={active === "profile"}
                    onClick={() => router.push("/profile")}
                />
                <NavItem
                    label="加群讨论"
                    icon={<GroupIcon />}
                    isActive={false}
                    onClick={() => {
                        window.open("https://qm.qq.com/q/lLgdUgxtkY")
                    }}
                />
            </nav>
        </div>
    );
}

interface NavItemProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

function NavItem({ label, icon, isActive, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center space-y-1 ${isActive ? "text-yellow-200" : "text-gray-200"}`}
        >
            <div>{icon}</div>
            <span className="text-0.2xl">{label}</span>
        </button>
    );
}

function ProfileIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                <circle cx="12" cy="7" r="3" />
            </g>
        </svg>
    );
}

function GroupIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14c2.764 0 5-2.238 5-5s-2.236-5-5-5s-5 2.238-5 5s2.236 5 5 5m0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3s-3-1.346-3-3s1.346-3 3-3m8 9a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m0-4c.827 0 1.5.673 1.5 1.5S20.827 14 20 14s-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5m0 4.59c-1.331 0-2.332.406-2.917.969C15.968 15.641 14.205 15 12 15c-2.266 0-3.995.648-5.092 1.564c-.596-.565-1.608-.975-2.908-.975c-2.188 0-3.5 1.091-3.5 2.183c0 .545 1.312 1.092 3.5 1.092c.604 0 1.146-.051 1.623-.133l-.04.27c0 1 2.405 2 6.417 2c3.762 0 6.417-1 6.417-2l-.021-.255c.463.073.996.118 1.604.118c2.051 0 3.5-.547 3.5-1.092c0-1.092-1.373-2.182-3.5-2.182M4 17.863c-1.309 0-2.068-.207-2.417-.354c.239-.405 1.003-.92 2.417-.92c1.107 0 1.837.351 2.208.706l-.235.344c-.452.119-1.108.224-1.973.224M12 19c-2.163 0-3.501-.312-4.184-.561C8.337 17.761 9.734 17 12 17c2.169 0 3.59.761 4.148 1.425c-.755.27-2.162.575-4.148.575m8-1.137c-.914 0-1.546-.103-1.973-.213a3 3 0 0 0-.248-.375c.356-.345 1.071-.685 2.221-.685c1.324 0 2.141.501 2.404.911c-.39.163-1.205.362-2.404.362M4 15a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m0-4c.827 0 1.5.673 1.5 1.5S4.827 14 4 14s-1.5-.673-1.5-1.5S3.173 11 4 11" /></svg>
    )
}