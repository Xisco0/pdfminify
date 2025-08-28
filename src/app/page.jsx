"use client";
import { useState } from "react";
import Header from "./header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ToolCard from "./components/toolCard";
import Footer from "./footer";
import ScrollToTopButton from "./components/scrollUp"
import LoaderModal from "./components/loader";
import Script from "next/script";

// lucide icons
import { Files, Scissors, FileText, Repeat, Minimize2, UnfoldVertical, Wrench } from "lucide-react";

export default function Home() {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
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
    { title: "More tools", description: "Discover additional tools to enhance your productivity and workflow", link: "#", Icon: Wrench, note: "Coming soon", isDisabled: true },
  ];

  const handleToolClick = (toolLink) => {
    setIsLoaderVisible(true);
    router.push(toolLink);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTopButton/>
      <LoaderModal isVisible={isLoaderVisible} />
      <Header />
      <Script
        src="https://embed.tawk.to/68a8cf90661c3b192cff578f/1j39mlk90"
        strategy="lazyOnload"
      />
      <section className="body-div mt-3">
        <h1 className="text-4xl md:text-5xl font-extrabold font-[title-font] text-gray-900 mb-4">
          All-in-One PDF & File Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-[body-font]">
          Fast, private, and ad-free file tools to merge, split, compress and
          convert documents and images — all in your browser.
        </p>
      </section>
      <main className="max-w-6xl w-[85%] mx-auto px-4 pb-16">
        <div className="flex justify-center gap-10 items-center flex-wrap w-full" id="main">
          {tools.map((t, i) => (
            <div
              key={i}
              onClick={!t.isDisabled ? () => handleToolClick(t.link) : undefined}
              className={`flex-grow w-[300px] bg-white border rounded-xl transition-shadow duration-200 ${!t.isDisabled ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
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