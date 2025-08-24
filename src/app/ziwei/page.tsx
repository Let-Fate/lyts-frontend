"use client"
import React, { useEffect } from 'react';
import { astro } from "iztro";
export default function Ziwei() {
    useEffect(() => {
        const astrolabe = astro.bySolar("2000-8-16", 2, "女");
        console.log(astrolabe)
    },[])

    return (
        <>
        </>
    )
}