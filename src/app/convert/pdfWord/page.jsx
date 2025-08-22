"use client";

import React, { useState } from "react";
import { Upload, FileDown, Loader2, X,ChevronRight } from "lucide-react";
import Header from "@/app/header";
import Footer from "@/app/footer";
import ScrollToTopButton from "@/app/components/scrollUp";
import Link from "next/link";


export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError("");
        setDownloadUrl(null);
      } else {
        setError("Please upload a valid PDF file");
        setFile(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setDownloadUrl(null);
    setError("");
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a PDF file to convert");
      return;
    }

    setIsConverting(true);
    setError("");

    try {
      // Simulate API conversion
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create dummy Word file for demo
      const wordContent = new Blob(["This is a dummy Word file"], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(wordContent);
      setDownloadUrl(url);
    } catch (err) {
      setError("Failed to convert PDF to Word");
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
              <span>PDF to Word</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PDF to Word Converter
            </h1>
            <p className="text-lg text-gray-600">
              Easily convert your PDF documents into editable Word files
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

            {error && (
              <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
            )}

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
                  "Convert to Word"
                )}
              </button>
            </div>
          </div>

          {downloadUrl && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileDown className="h-8 w-8 text-green-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Converted Word File
                    </p>
                    <p className="text-sm text-gray-500">Ready to download</p>
                  </div>
                </div>
                <a
                  href={downloadUrl}
                  download={file ? file.name.replace(".pdf", ".docx") : "converted.docx"}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download Word File
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
