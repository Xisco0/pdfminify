"use client"

import { useState } from "react";
import Header from "./header";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import ToolCard from "./components/toolCard";
import Footer from "./footer";
import ScrollToTopButton from "./components/scrollUp"
import LoaderModal from "./components/loader";
import Script from "next/script";

// lucide icons
import { Files, Scissors, FileText, Repeat,Minimize2,UnfoldVertical } from "lucide-react";

export default function Home() {
  // State to control the visibility of the loader
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  
  // Initialize the router
  const router = useRouter();

  const tools = [
    { title: "Merge PDF", description: "Combine multiple PDF files into one document.", link: "/pdf/mergePdf", Icon: Files, note: "Free: up to 3 files" },
    { title: "Split PDF", description: "Extract specific pages from a PDF file.", link: "/pdf/splitPdf", Icon: Scissors, note: "Preview pages" },
    { title: "Compress PDF", description: "Reduce PDF size with safe settings.", link: "/compress/docs/compressPdf", Icon: Minimize2, note: "Medium compression" },
    { title: "PDF to Word", description: "Convert PDF documents to editable Word files.", link: "/convert/pdfWord", Icon: FileText, note: "Text-first PDFs" },
    { title: "PDF to Image", description: "Export PDF pages as JPG or PNG.", link: "/convert/pdfImage", Icon: Files, note: "Download per page" },
    { title: "Compress Images", description: "Shrink JPG/PNG/WebP images in-browser.", link: "compress/image/compressImage", Icon: UnfoldVertical, note: "Batch images" },
    { title: "Convert Images", description: "Convert between JPG, PNG and WebP.", link: "convert/convertImages", Icon: Repeat, note: "High quality" },
    { title: "DOC ↔ PDF", description: "Convert Word documents to PDF and back.", link: "convert/convertDocs", Icon: Files, note: "Text-based conversion" },
  ];

  const handleToolClick = (toolLink) => {
    setIsLoaderVisible(true);
    router.push(toolLink); 
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTopButton/>
      {/* Render the loader component conditionally */}
      <LoaderModal isVisible={isLoaderVisible} />
    
      <Header />
     <Script
        src="https://embed.tawk.to/68a8cf90661c3b192cff578f/1j39mlk90"
        strategy="lazyOnload"
      />

      
      <section className="body-div">
        <h1 className="text-4xl md:text-5xl font-extrabold font-[title-font] text-gray-900 mb-4">
          All-in-One PDF & File Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-[body-font]">
          Fast, private, and ad-free file tools to merge, split, compress and
          convert documents and images — all in your browser.
        </p>
      </section>

      {/* Tools Grid */}
      <main className="max-w-6xl w-[83%] mx-auto px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-wrap">
          {tools.map((t, i) => (
            <div 
              key={i} 
              // Added an onClick handler to the wrapper div
              onClick={() => handleToolClick(t.link)}
              className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
              <ToolCard
                title={t.title}
                description={t.description}
                link={t.link}
                Icon={t.Icon}
                note={t.note}
              />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-12 bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-200">
          <div>
            <h3 className="text-lg font-semibold">
              Need larger conversions or OCR?
            </h3>
            <p className="text-sm text-gray-700">
              We’ll add server-side heavy tasks and a Pro plan soon — but free
              in-browser tools work for most everyday jobs.
            </p>
          </div>
          <div>
            <Link
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              href="/pricing"
            >
              See Pro (coming)
            </Link>
          </div>
        </section>
        
      </main>
      <Footer />
    </div>
  );
}
