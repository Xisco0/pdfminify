"use client"
import { Zap, CircleCheckBig, CircleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function Footer(){
  const tools = [
    { title: "Lightning Fast", description: "Process files instantly with our optimized compression engine", Icon: Zap },
    { title: "Quality Preserved", description: "Smart compression algorithms maintain document readability", Icon: CircleCheckBig },
    { title: "Secure & Private", description: "Files are processed locally in your browser - no upload needed", Icon: CircleAlert },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/" },
    { name: "Blog", href: "#" },
    { name: "Contact", href: "/contact" },
  ];

  const categories = [
    { name: "Compress PDF", href: "/compress/docs/compressPdf" },
    { name: "Merge PDF", href: "/pdf/mergePdf" },
    { name: "Split PDF", href: "/pdf/splitPdf" },
    { name: "Convert to PDF", href: "/convert/convertDocs" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Disclaimer", href: "#" },
  ];
  
  return(
    <footer className="w-full bg-gray-50 mt-[40px] flex flex-col items-center border-t border-gray-200">
      
      {/* Why Use Our PDF Toolkit? Section */}
      <div className="max-w-[1200px] m-auto w-[85%] gap-7 flex flex-col justify-between items-center py-10">
        <h3 className="font-[sub-title-font] text-center text-4xl">Why Use Our PDF Minify?</h3>
        <div className="w-full flex justify-center gap-10 items-center flex-wrap">
          {tools.map(({ title, description, Icon }, index) => (
            <div key={index} className="border p-5 w-[200px]  flex-grow border-gray-300 rounded-lg" data-aos="fade-right" data-aos-duration="1000">
              <div className="flex flex-col gap-4 items-center justify-center">
                <div className="w-13 h-13 flex justify-center text-center items-center rounded-[10px] bg-[rgb(235,242,254)]">
                  <Icon className="w-7 h-7 text-gray-500" />
                </div>
                <h3 className="text-black font-[sub-title-font]">{title}</h3>
                <p className="text-center text-gray-400 font-[body-font]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-200 mt-10"data-aos="fade-up" data-aos-duration="1000">
        <div className="max-w-[1200px] m-auto w-[85%] py-8 flex flex-col md:flex-row justify-between md:items-start text-center md:text-left gap-10">
          
        
          <div className="flex flex-col md:items-center gap-4 w-full md:w-auto md:max-w-[300px]">
            <Link href="/" className="w-fit h-fit">
              <Image
                src="/all-images/logoImages/logo.fw.png"
                alt="logo"
                width={200}
                height={90}
                title="Pdfminify"
                className="cursor-pointer"
              />
            </Link>
            <p className="text-gray-500 text-sm md:w-[200px] mt-0">
              Your one-stop solution for all PDF needs. Easily merge, split, compress, and convert your documents for free.
            </p>
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-500 hover:text-blue-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          

          <div className="flex flex-col gap-3 items-center md:items-start">
            <h4 className="text-lg font-bold">PDF Tools</h4>
            <ul className="flex flex-col gap-2">
              {categories.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-500 hover:text-blue-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div className="flex flex-col gap-3 items-center md:items-start">
            <h4 className="text-lg font-bold">Legal</h4>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-500 hover:text-blue-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>

     
      <div className="w-full border-t border-gray-200 py-4 text-center text-gray-500 text-sm" data-aos="fade-up" data-aos-duration="1000">
        <p>© {new Date().getFullYear()} PDF Minify. All Rights Reserved.</p>
      </div>

    </footer>
  );
}