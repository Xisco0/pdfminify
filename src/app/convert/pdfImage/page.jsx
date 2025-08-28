"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist"; 
import "pdfjs-dist/build/pdf.worker.mjs";
import {Upload,Image as ImageIcon,Loader2,Download,ChevronRight,CircleAlert,CircleCheckBig,
} from "lucide-react";
import Link from "next/link";
import Header from "@/app/header";
import Footer from "@/app/footer";

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [imageWidth, setImageWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState(1000);
  const [isDragging, setIsDragging] = useState(false); // 💡 NEW: State for drag-and-drop UI feedback

  // 💡 MODIFIED: This function now handles both file input and dropped files
  const handleFileChange = (e) => {
    let uploadedFile;
    if (e.dataTransfer && e.dataTransfer.files) {
      uploadedFile = e.dataTransfer.files[0];
    } else {
      uploadedFile = e.target.files[0];
    }

    if (uploadedFile && uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      setImages([]);
      setAlert(null);
    } else {
      setAlert({ message: "Please upload a valid PDF file.", status: false });
    }
  };

  // 💡 NEW: Event handlers for drag-and-drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };

  const handleConvert = async () => {
    if (!file) {
      setAlert({ message: "Please select a PDF file to convert.", status: false });
      return;
    }
    if (!imageWidth || !imageHeight || imageWidth <= 0 || imageHeight <= 0) {
      setAlert({ message: "Please enter valid width and height values.", status: false });
      return;
    }

    setIsConverting(true);
    setImages([]);
    setAlert({ message: "Converting your PDF to images...", status: true });

    let pdfUrl = null;
    try {
      pdfUrl = URL.createObjectURL(file);
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      const MAX_PAGES = 100;
      if (pdf.numPages > MAX_PAGES) {
        setAlert({
          message: `PDF has too many pages. Limit is ${MAX_PAGES}.`,
          status: false,
        });
        setIsConverting(false);
        return;
      }

      const newImages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const originalViewport = page.getViewport({ scale: 1 });
        const scaleX = imageWidth / originalViewport.width;
        const scaleY = imageHeight / originalViewport.height;
        const scale = Math.min(scaleX, scaleY);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const offsetX = (canvas.width - viewport.width) / 2;
        const offsetY = (canvas.height - viewport.height) / 2;

        await page.render({
          canvasContext: context,
          viewport,
          transform: [1, 0, 0, 1, offsetX, offsetY],
        }).promise;

        newImages.push(canvas.toDataURL("image/png"));
      }

      setImages(newImages);
      setAlert({ message: "Conversion successful! Images are ready.", status: true });
    } catch (err) {
      console.error("PDF Conversion Error:", err);
      setAlert({
        message: "Failed to convert PDF. File may be corrupted or not valid.",
        status: false,
      });
    } finally {
      setIsConverting(false);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="body-div">
          <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>
            <ChevronRight size={16} className="mx-1" />
            <span>PDF to Images</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
            Convert PDF to Images
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Upload a PDF and convert it into high-quality images. Choose custom width and height.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col items-center gap-4">
              {/* File Upload with Drag & Drop Handlers */}
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <p className="text-gray-600 mt-2">Click to upload or drag and drop</p>
                {file && <p className="text-gray-800 font-medium mt-1">File: {file.name}</p>}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              {/* ... (rest of the component remains the same) ... */}
              <div className="flex gap-4 w-full justify-center">
                <input
                  type="number"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(parseInt(e.target.value))}
                  className="w-32 p-2 border rounded-lg"
                  placeholder="Width"
                />
                <input
                  type="number"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(parseInt(e.target.value))}
                  className="w-32 p-2 border rounded-lg"
                  placeholder="Height"
                />
              </div>

              <button
                onClick={handleConvert}
                disabled={!file || isConverting}
                className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5" />
                    Convert to Images
                  </>
                )}
              </button>

              {alert && (
                <div
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-md ${
                    alert.status
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {alert.status ? (
                    <CircleCheckBig className="h-5 w-5" />
                  ) : (
                    <CircleAlert className="h-5 w-5" />
                  )}
                  {alert.message}
                </div>
              )}
            </div>
          </div>
          {images.length > 0 && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((src, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
                >
                  <img
                    src={src}
                    alt={`Page ${idx + 1}`}
                    className="rounded-lg w-full object-contain"
                  />
                  <a
                    href={src}
                    download={`page-${idx + 1}.png`}
                    className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}