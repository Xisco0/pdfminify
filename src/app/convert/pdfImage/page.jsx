"use client";

export const ssr = false;
import React, { useState } from "react";
import { Upload, FileDown, Loader2, X, ChevronRight } from "lucide-react";
import Header from "@/app/header";
import Footer from "@/app/footer";
import ScrollToTopButton from "@/app/components/scrollUp";
import Link from "next/link";
import * as pdfjs from "pdfjs-dist/build/pdf";
import CustomAlert from "@/app/components/alert";

// Set the worker source for PDF.js


if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [images, setImages] = useState([]);
  const [alert, setAlert] = useState({ message: "", status: true });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Reset previous states
    setFile(null);
    setImages([]);
    setAlert({ message: "", status: true });

    if (!selectedFile) {
      return; // User canceled file selection
    }

    // Security Check 1: File type validation
    if (selectedFile.type !== "application/pdf") {
      setAlert({ message: "Please upload a valid PDF file.", status: false });
      return;
    }

    // Security Check 2: File size limit (e.g., 50 MB)
    const MAX_FILE_SIZE_MB = 50;
    const maxFileSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (selectedFile.size > maxFileSizeInBytes) {
      setAlert({ message: `File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`, status: false });
      return;
    }

    // If all checks pass
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setImages([]);
    setAlert({ message: "", status: true });
  };

  const handleConvert = async () => {
    if (!file) {
      setAlert({ message: "Please select a PDF file to convert.", status: false });
      return;
    }

    setIsConverting(true);
    setImages([]);
    setAlert({ message: "Converting your PDF to images...", status: true });

    try {
      const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));
      const pdf = await loadingTask.promise;

      // Security Check 3: Number of pages limit (e.g., 100 pages)
      const MAX_PAGES = 100;
      if (pdf.numPages > MAX_PAGES) {
        setAlert({ message: `PDF has too many pages. The limit is ${MAX_PAGES}.`, status: false });
        setIsConverting(false);
        return;
      }

      const newImages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const imageDataUrl = canvas.toDataURL("image/png");
        newImages.push(imageDataUrl);
      }

      setImages(newImages);
      setAlert({ message: "Conversion successful! Your images are ready to download.", status: true });
    } catch (err) {
      console.error(err);
      setAlert({ message: "Failed to convert PDF to image. The file may be corrupted.", status: false });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ScrollToTopButton />
      <main className="flex-grow">
        <div className="body-div">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:underline cursor-pointer">
                Home
              </Link>
              <ChevronRight size={16} className="mx-1" />
              <span>PDF to Image</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PDF to Image Converter
            </h1>
            <p className="text-lg text-gray-600">
              Easily convert your PDF pages into high-quality images
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!file ? (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg text-gray-600 mb-2">
                      Drop your PDF here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">PDF files only</p>
                  </div>
                </label>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-lg p-4 gap-3 sm:gap-0">
                  <div className="flex items-center">
                    <FileDown className="h-8 w-8 text-blue-500 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm sm:text-base break-all">
                        {file.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="self-end cursor-pointer sm:self-auto text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleConvert}
                disabled={!file || isConverting}
                className={`inline-flex cursor-pointer items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                  !file || isConverting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Converting...
                  </>
                ) : (
                  "Convert to Image"
                )}
              </button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Converted Images
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-lg p-4 flex flex-col items-center"
                  >
                    <p className="text-sm text-gray-600 mb-2">
                      Page {index + 1}
                    </p>
                    <div className="border border-gray-300 rounded-md overflow-hidden mb-4">
                      <img
                        src={image}
                        alt={`Converted Page ${index + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <a
                      href={image}
                      download={`page-${index + 1}.png`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {alert.message && (
        <CustomAlert
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert({ message: "", status: true })}
        />
      )}
    </div>
  );
}