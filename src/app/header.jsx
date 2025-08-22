"use client"

import Image from "next/image";
import Link from "next/link";

export default function Header() {

    return(
    <header className="border-b h-[80px] py-4 fixed w-full flex justify-center items-center border-gray-200 z-50 bg-white animated animated fadeInDown">
        <div className="w-[85%] max-w-[1200px] mx-auto flex items-center justify-between">
    
            <Link href="/" className="m-0 p-0">
            <Image
                src="/all-images/logoImages/logo.fw.png"
                alt="logo"
                width={130}
                height={20}
                title="Pdfminify"
                className="cursor-pointer"
            />
            </Link>

            
            <div className="flex items-center gap-4">
                <Link
                    href="#main"
                    className="px-4 py-2 bg-gradient-to-tr from-[#2389cc] to-[#1576b6]  text-white rounded-lg transition-colors"
                >
                    Tools
                </Link>
            </div>
        </div>
    </header>
    );
}