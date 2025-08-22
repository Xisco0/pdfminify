"use client";
import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import { Upload, FileDown, Loader2, X, ChevronRight, Image } from "lucide-react";
import CustomAlert from "@/app/components/alert";
import Header from "@/app/header";
import Footer from "@/app/footer";
import ScrollToTopButton from "@/app/components/scrollUp"; 
import Link from "next/link";


export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [targetSize, setTargetSize] = useState(500); // Default target size in KB
  const [alert, setAlert] = useState({ message: "", status: true });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Reset previous state
    setFile(selectedFile);
    setCompressedImage(null);
    setAlert({ message: "", status: true });

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setAlert({ message: "Please upload a valid image file (JPEG, PNG, etc.).", status: false });
      setFile(null);
      return;
    }

  };

  const handleCompress = async () => {
    if (!file) {
      setAlert({ message: "Please select an image to compress.", status: false });
      return;
    }

    setIsCompressing(true);
    setCompressedImage(null);
    setAlert({ message: `Compressing image to target size of ${targetSize} KB...`, status: true });

    try {
      // The browser-image-compression library works with a target MB value,
      // so we convert our target KB value to MB.
      const options = {
        maxSizeMB: targetSize / 1024,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompressedImage(e.target.result);
      };
      reader.readAsDataURL(compressedFile);

      setAlert({ message: "Compression successful! Your image is ready to download.", status: true });

    } catch (error) {
      console.error("Compression failed:", error);
      setAlert({ message: "Failed to compress image. Please try again.", status: false });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setCompressedImage(null);
    setAlert({ message: "", status: true });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      <Header />
      <ScrollToTopButton />
      <main className="flex-grow container mx-auto px-4 py-4">
        <div className="body-div">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>
            <ChevronRight size={16} className="mx-1" />
            <span>Image Compressor</span>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Image Compressor
            </h1>
            <p className="text-lg text-gray-600">
              Compress images to a specific target size in the browser.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {!file ? (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg text-gray-600 mb-2">
                      Drop your image here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">JPG, PNG, WebP, etc.</p>
                  </div>
                </label>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-lg p-4 gap-3 sm:gap-0">
                  <div className="flex items-center">
                    <Image className="h-8 w-8 text-blue-500 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm sm:text-base break-all">
                        {file.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Original Size: {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="self-end sm:self-auto text-gray-400 hover:text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label htmlFor="target-size" className="block text-sm font-semibold text-gray-700 mb-2">
                Target File Size
              </label>
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="number"
                  id="target-size"
                  name="target-size"
                  value={targetSize}
                  onChange={(e) => setTargetSize(Number(e.target.value))}
                  className="block w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-3 pr-16 text-lg text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 500"
                  min="1"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-gray-500 font-medium text-sm">
                    KB
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCompress}
                disabled={!file || isCompressing}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                  !file || isCompressing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Compressing...
                  </>
                ) : (
                  "Compress Image"
                )}
              </button>
            </div>
          </div>

          {compressedImage && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Compressed Image
              </h2>
              <div className="flex flex-col items-center">
                <div className="border border-gray-300 rounded-md overflow-hidden mb-4 max-w-full">
                  <img
                    src={compressedImage}
                    alt="Compressed"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Compressed Size: {(Buffer.from(compressedImage.split(',')[1], 'base64').length / 1024).toFixed(2)} KB
                </p>
                <a
                  href={compressedImage}
                  download={`compressed_${file.name}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download
                </a>
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
