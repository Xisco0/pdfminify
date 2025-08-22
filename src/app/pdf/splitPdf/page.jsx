"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import Header from "@/app/header";
import Footer from "@/app/footer";
import ScrollToTopButton from "@/app/components/scrollUp";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CustomAlert from "@/app/components/alert";

const SplitPdf = () => {
  // State variables
  const [mainPdfFile, setMainPdfFile] = useState(null);
  const [headerFile, setHeaderFile] = useState(null);
  const [footerFile, setFooterFile] = useState(null);
  const [previewPdfBytes, setPreviewPdfBytes] = useState(null);
  const [splitMode, setSplitMode] = useState("single");
  const [splitOption, setSplitOption] = useState("");
  const [addHeaderFooter, setAddHeaderFooter] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: true });

  // Refs for file inputs
  const pdfInputRef = useRef(null);
  const headerInputRef = useRef(null);
  const footerInputRef = useRef(null);

  // Handle file uploads
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setMainPdfFile(file);
    } else {
      setAlert({ message: "Please upload a valid PDF file", status: false });
    }
  };

  const handleHeaderUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setHeaderFile(file);
      setAlert({ message: "Header uploaded successfully", status: true });
    } else {
      setAlert({ message: "Invalid header file format", status: false });
    }
  };

  const handleFooterUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setFooterFile(file);
      setAlert({ message: "Footer uploaded successfully", status: true });
    } else {
      setAlert({ message: "Invalid footer file format", status: false });
    }
  };

  // Drag and drop handlers
  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (type === "pdf" && file.type === "application/pdf") {
      setMainPdfFile(file);
      setAlert({ message: "PDF uploaded via drag & drop", status: true });
    } else if (
      (type === "header" || type === "footer") &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      type === "header" ? setHeaderFile(file) : setFooterFile(file);
      setAlert({ message: `${type} uploaded via drag & drop`, status: true });
    } else {
      setAlert({ message: "Invalid file format", status: false });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Process PDF
  const processPdf = async () => {
    if (!mainPdfFile) {
      setAlert({ message: "No PDF file selected", status: false });
      return;
    }

    setIsProcessing(true);
    setAlert({ message: "Processing started...", status: true });

    try {
      const mainPdfBytes = await readFileAsArrayBuffer(mainPdfFile);
      const pdfDoc = await PDFDocument.load(mainPdfBytes);
      const pageCount = pdfDoc.getPageCount();

      const splitPoints = getSplitPoints(pageCount);
      const splitPdfs = await splitPdf(pdfDoc, splitPoints);

      let processedPdfs = splitPdfs;
      if (addHeaderFooter && (headerFile || footerFile)) {
        processedPdfs = await Promise.all(
          splitPdfs.map((pdf) => addHeaderFooterToPdf(pdf, headerFile, footerFile))
        );
      }

      const firstPdfBytes = await processedPdfs[0].save();
      setPreviewPdfBytes(firstPdfBytes);
      setAlert({ message: "PDF processed successfully", status: true });
    } catch (err) {
      console.error("Error processing PDF:", err);
      setAlert({ message: `Error: ${err.message}`, status: false });
    } finally {
      setIsProcessing(false);
    }
  };

  // Helpers
  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const getSplitPoints = (pageCount) => {
    if (splitMode === "single") {
      const splitPage = parseInt(splitOption) || 1;
      return [Math.min(splitPage, pageCount)];
    } else if (splitMode === "multiple") {
      const n = parseInt(splitOption) || 1;
      const points = [];
      for (let i = n; i < pageCount; i += n) points.push(i);
      return points;
    } else if (splitMode === "range") {
      if (!splitOption.trim()) return [];
      const ranges = splitOption.split(",");
      const points = new Set();
      for (const range of ranges) {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map(Number);
          for (let i = start; i <= Math.min(end, pageCount); i++) {
            if (i < pageCount) points.add(i);
          }
        } else {
          const page = Number(range);
          if (page < pageCount) points.add(page);
        }
      }
      return Array.from(points).sort((a, b) => a - b);
    }
    return [];
  };

  const splitPdf = async (pdfDoc, splitPoints) => {
    const pageCount = pdfDoc.getPageCount();
    if (splitPoints.length === 0) {
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((p) => newDoc.addPage(p));
      return [newDoc];
    }

    const allPoints = [0, ...splitPoints, pageCount];
    const splitDocs = [];

    for (let i = 0; i < allPoints.length - 1; i++) {
      const start = allPoints[i];
      const end = allPoints[i + 1];
      const newDoc = await PDFDocument.create();
      const pageIndices = Array.from({ length: end - start }, (_, idx) => start + idx);
      const pages = await newDoc.copyPages(pdfDoc, pageIndices);
      pages.forEach((p) => newDoc.addPage(p));
      splitDocs.push(newDoc);
    }
    return splitDocs;
  };

  const addHeaderFooterToPdf = async (pdfDoc, headerFile, footerFile) => {
    const pages = pdfDoc.getPages();

    let headerImageBytes, headerDims;
    if (headerFile && headerFile.type.startsWith("image/")) {
      headerImageBytes = await readFileAsArrayBuffer(headerFile);
      headerDims = await getImageDimensions(headerImageBytes);
    }

    let footerImageBytes, footerDims;
    if (footerFile && footerFile.type.startsWith("image/")) {
      footerImageBytes = await readFileAsArrayBuffer(footerFile);
      footerDims = await getImageDimensions(footerImageBytes);
    }

    for (const page of pages) {
      const { width, height } = page.getSize();
      if (headerDims && headerImageBytes) {
        const headerImg = await pdfDoc.embedJpg(headerImageBytes);
        page.drawImage(headerImg, {
          x: 0,
          y: height - headerDims.height,
          width: Math.min(width, headerDims.width),
          height: headerDims.height * (Math.min(width, headerDims.width) / headerDims.width),
        });
      }
      if (footerDims && footerImageBytes) {
        const footerImg = await pdfDoc.embedJpg(footerImageBytes);
        page.drawImage(footerImg, {
          x: 0,
          y: 0,
          width: Math.min(width, footerDims.width),
          height: footerDims.height * (Math.min(width, footerDims.width) / footerDims.width),
        });
      }
    }
    return pdfDoc;
  };

  const getImageDimensions = (imageBytes) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(new Blob([imageBytes]));
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  const downloadSplitPdf = async (index) => {
    if (!previewPdfBytes) {
      setAlert({ message: "No PDF to download", status: false });
      return;
    }
    try {
      const blob = new Blob([previewPdfBytes], { type: "application/pdf" });
      saveAs(blob, `split_document_${index + 1}.pdf`);
      setAlert({ message: "PDF downloaded successfully", status: true });
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setAlert({ message: `Error downloading: ${err.message}`, status: false });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <ScrollToTopButton />

      <div className="body-div">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:underline cursor-pointer">
                Home
              </Link>
              <ChevronRight size={16} className="mx-1" />
              <span>Split PDF</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced PDF Splitter</h1>
            <p className="text-lg text-gray-600">
              Upload your PDF, customize headers/footers, and split into multiple documents
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6 p-6">
              {/* Left Section */}
              <div className="md:col-span-2 space-y-6">
                {/* Main Upload */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">Upload Your PDF Document</h2>
                  <div
                    id="pdfDropzone"
                    className="border-2 border-dashed border-indigo-500 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-700 hover:bg-indigo-50 transition"
                    onClick={() => pdfInputRef.current.click()}
                    onDrop={(e) => handleDrop(e, "pdf")}
                    onDragOver={handleDragOver}
                  >
                    <div className="space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">Drag & drop your PDF here or click to browse</p>
                      {mainPdfFile && <p className="text-sm font-medium text-indigo-600">{mainPdfFile.name}</p>}
                      <input type="file" ref={pdfInputRef} accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                    </div>
                  </div>
                </div>

                {/* Header & Footer Uploads */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Header */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Header (optional)</h2>
                    <div
                      className="border-2 border-dashed border-indigo-400 rounded-lg p-4 text-center cursor-pointer h-[120px] flex items-center justify-center hover:border-indigo-600 hover:bg-indigo-50 transition"
                      onClick={() => headerInputRef.current.click()}
                      onDrop={(e) => handleDrop(e, "header")}
                      onDragOver={handleDragOver}
                    >
                      {headerFile ? (
                        headerFile.type.startsWith("image/") ? (
                          <img src={URL.createObjectURL(headerFile)} alt="Custom header" className="max-h-full max-w-full" />
                        ) : (
                          <p className="text-xs font-medium text-indigo-500">{headerFile.name}</p>
                        )
                      ) : (
                        <p className="text-xs text-gray-500">Upload header image/PDF</p>
                      )}
                      <input type="file" ref={headerInputRef} accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleHeaderUpload} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Footer (optional)</h2>
                    <div
                      className="border-2 border-dashed border-indigo-400 rounded-lg p-4 text-center cursor-pointer h-[120px] flex items-center justify-center hover:border-indigo-600 hover:bg-indigo-50 transition"
                      onClick={() => footerInputRef.current.click()}
                      onDrop={(e) => handleDrop(e, "footer")}
                      onDragOver={handleDragOver}
                    >
                      {footerFile ? (
                        footerFile.type.startsWith("image/") ? (
                          <img src={URL.createObjectURL(footerFile)} alt="Custom footer" className="max-h-full max-w-full" />
                        ) : (
                          <p className="text-xs font-medium text-indigo-500">{footerFile.name}</p>
                        )
                      ) : (
                        <p className="text-xs text-gray-500">Upload footer image/PDF</p>
                      )}
                      <input type="file" ref={footerInputRef} accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFooterUpload} />
                    </div>
                  </div>
                </div>

                {/* Split Options */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800">Split Options</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Split Mode</label>
                      <select
                        id="splitMode"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={splitMode}
                        onChange={(e) => setSplitMode(e.target.value)}
                      >
                        <option value="single">Split after specific page</option>
                        <option value="multiple">Split every N pages</option>
                        <option value="range">Custom page ranges</option>
                      </select>
                    </div>

                    {splitMode !== "range" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {splitMode === "single" ? "Page to split after" : "Split every N pages"}
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder={splitMode === "single" ? "e.g. 3" : "e.g. 2"}
                          value={splitOption}
                          onChange={(e) => setSplitOption(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {splitMode === "range" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Page ranges (e.g. 1-3,5,7-9)</label>
                      <input
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Example: 1-3,5,7-9"
                        value={splitOption}
                        onChange={(e) => setSplitOption(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      id="addHeaderFooter"
                      type="checkbox"
                      checked={addHeaderFooter}
                      onChange={(e) => setAddHeaderFooter(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="addHeaderFooter" className="ml-2 block text-sm text-gray-700">
                      Add header/footer to all pages
                    </label>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  id="processBtn"
                  className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!mainPdfFile || isProcessing}
                  onClick={processPdf}
                >
                  {isProcessing ? "Processing..." : "Process and Split PDF"}
                </button>
              </div>

              {/* Preview */}
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
                <div className="bg-gray-100 rounded-lg p-4 h-[500px] overflow-y-auto preview-container">
                  {previewPdfBytes ? (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-800">Document 1</h3>
                          <button 
                            onClick={() => downloadSplitPdf(0)} 
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Download
                          </button>
                        </div>
                        <div className="bg-gray-100 rounded p-2 flex justify-center">
                          <img 
                            src="https://placehold.co/300x420?text=PDF+Preview" 
                            alt="PDF document preview for split document 1" 
                            className="max-h-60 shadow-sm border border-gray-200"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <p>Your processed PDF will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
         
        </div>
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
};

export default SplitPdf;
