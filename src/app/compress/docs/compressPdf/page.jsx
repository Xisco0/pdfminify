"use client";

import { useState,useEffect } from "react";
// import { PDFDocument } from "pdf-lib";
import { FileDown, Zap, Settings, Upload, FileText,ChevronRight } from "lucide-react";
import Header from "../../../header";
import Footer from "../../../footer";
import "../../../../../public/styles/aos.css";
import AOS from '../../../../../public/constant/aos';
import ScrollToTopButton from "../../../components/scrollUp"
import Link from "next/link"
import CustomAlert from "@/app/components/alert";

export default function CompressPdf() {
   useEffect(() => {
  AOS.init({
    easing: 'ease-in-out-sine',
  });
  }, []);

  const [file, setFile] = useState(null);
  const [compressionMode, setCompressionMode] = useState("Balanced");
  const [targetSize, setTargetSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState("MB");
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [compressionPercentage, setCompressionPercentage] = useState(null);
  const [compressionComplete, setCompressionComplete] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: true });


  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (
      uploadedFile.type === "application/pdf" &&
      uploadedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      if (uploadedFile.size > MAX_FILE_SIZE) {
        setAlert({ message: "File size exceeds 50MB limit.", status: false });
        
        return;
      }
      setFile(uploadedFile);
      setOriginalSize(uploadedFile.size);
      setDownloadUrl("");
      setTargetSize("");
      setCompressionComplete(false);
      setCompressedSize(null);
      setCompressionPercentage(null);
    } else {
      setAlert({ message: "Please upload a valid PDF file.", status: false });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setDownloadUrl("");
    setTargetSize("");
    setCompressionComplete(false);
    setCompressedSize(null);
    setCompressionPercentage(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleCompress = async () => {
    if (!file) {
      setAlert({ message: "Please upload a PDF first.", status: false });
      return;
    }
    setLoading(true);
    setCompressionComplete(false);
    setCompressedSize(null);
    setCompressionPercentage(null);

    // --- MOCK API CALL SIMULATION ---
    // In a real app, you would send the file to a server here.
    // The server would compress the file and send back the new file and its size.

    // Simulating a 3-second network request
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      // Simulate a server-side compression result
      let simulatedReductionFactor;
      if (compressionMode === "Maximum Compression") {
        simulatedReductionFactor = Math.random() * (0.85 - 0.70) + 0.70; // 70-85% smaller
      } else if (compressionMode === "Balanced") {
        simulatedReductionFactor = Math.random() * (0.65 - 0.50) + 0.50; // 50-65% smaller
      } else { // High Quality
        simulatedReductionFactor = Math.random() * (0.45 - 0.20) + 0.20; // 20-45% smaller
      }

      const originalBytes = file.size;
      const compressedBytes = originalBytes * (1 - simulatedReductionFactor);
      const percentage = (simulatedReductionFactor * 100).toFixed(0);

      setCompressedSize(compressedBytes);
      setCompressionPercentage(percentage);

      // Create a blob from the original file to simulate a download
      const arrayBuffer = await file.arrayBuffer();
      const compressedPdfBytes = new Uint8Array(arrayBuffer.slice(0, compressedBytes));

      const blob = new Blob([compressedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      setCompressionComplete(true);

    } catch (err) {
      console.error(err);
     setAlert({ message: "Error compressing PDF.", status: false });
    }
    setLoading(false);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      <ScrollToTopButton/>
      <Header />
      
      <div className="flex flex-col w-[85%] max-w-[1200px] body-div text-left justify-center items-center">
        <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
        <Link href="/" className="hover:underline cursor-pointer">Home</Link>
        <ChevronRight size={16} className="mx-1" />
        <span>Compress PDF</span>
        </div>
        <div className=" w-[50%] max-lg:w-full m-auto">
          <h2 className="text-3xl font-bold text-center font-[sub-title-font]">Compress PDF</h2>
          <p className="text-center text-gray-400 text-[clamp(13px,3vw,17px)] mt-4 font-[body-font]">
            Reduce the size of your PDF files while maintaining quality. Choose your compression settings and get optimized files instantly.
          </p>
        </div>

        {/* UPLOAD / PREVIEW */}
        <div className="text-black w-full mt-20">
          <div className="flex my-3 gap-2 items-center text-xl">
            <Upload className="text-[#5B96F6]" /><span>Upload PDF</span>
          </div>
          <label
            htmlFor="pdf-upload"
            className="flex flex-col gap-5 items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-[rgba(225,231,239,.2)] duration-[.5s] ease-in-out"
          >
            <div className="w-20 h-20 flex justify-center items-center rounded-full bg-[rgb(235,242,254)]">
              <Upload className="w-7 h-7 text-gray-500 mb-2" />
            </div>
            <span className="text-gray-700 text-center">
              {file ? file.name : "Drag & drop PDF here or click to upload"}
            </span>
            <span className="text-gray-400 font-[body-font]">Supported format: PDF</span>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* PDF Preview Card */}
          {file && (
            <div className="flex items-center justify-between border rounded-lg p-4 mt-4 bg-white shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-pink-100 rounded-md">
                  <FileText className="text-gray-600" size={28} />
                </div>
                <div className="ml-4">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-200 transition text-sm font-medium"
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* COMPRESSION SETTINGS */}
        <div className="w-full mt-15">
          <div className="flex gap-2 items-center text-xl">
            <Zap className="text-[#5B96F6]" /><span>Compression Options</span>
          </div>

          <div className="w-full mt-5 border p-5 border-gray-300 rounded-lg">
            <div className="flex gap-2 items-center text-xl">
              <Settings className="text-[#5B96F6]" /><span>Compression Settings</span>
            </div>
            <p className="text-gray-500 text-[14px] mt-1">Choose how you want to compress your PDF</p>

            <div className="mt-10">
              <div className="flex flex-col gap-2">
                <span className="font-[body-font] text-black">Compression Mode</span>
                <select
                  value={compressionMode}
                  onChange={(e) => setCompressionMode(e.target.value)}
                  className="border p-4 border-gray-300 rounded-lg cursor-pointer"
                >
                  <option>Balanced</option>
                  <option>Maximum Compression</option>
                  <option>High Quality</option>
                </select>
              </div>

              {/* Target Size Input (optional, as it's not truly functional without a real backend) */}
              <div className="flex flex-col gap-1 mt-5">
                <span className="font-[body-font] text-black">Target Size (optional)</span>
                <div className="flex w-full  items-center gap-3">
                  <input
                    type="number"
                    placeholder="Enter size"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    className="border p-4 outline-none w-[93%] border-gray-300 rounded-lg"
                  />
                  <select
                    value={sizeUnit}
                    onChange={(e) => setSizeUnit(e.target.value)}
                    className="border w-[7%] max-lg:w-[80%] p-4 border-gray-300 rounded-lg cursor-pointer"
                  >
                    <option>MB</option>
                    <option>KB</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCompress}
                disabled={loading || !file}
                className="mt-5 cursor-pointer w-full p-4 btn rounded-lg disabled:opacity-50"
              >
                {loading ? "Compressing..." : "Compress PDF"}
              </button>

              {/* Compression Results UI */}
              {compressionComplete && (
                <div className="mt-5 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Your PDF is now {compressionPercentage}% smaller! 🎉</h3>
                    <div className="text-sm font-medium text-gray-500">
                      {formatFileSize(originalSize)} → {formatFileSize(compressedSize)}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${100 - compressionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`compressed_${file.name}`}
                  className="mt-3 block text-center text-blue-500 underline"
                >
                  <FileDown className="inline mr-2" /> Download Compressed PDF
                </a>
              )}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        
      </div>
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