"use client";

import { useState, useRef } from "react";
import Header from "../../header";
import Footer from "../../footer";
import Link from "next/link";
import { ChevronRight, File, X } from "lucide-react";
import LoaderModal from "../../components/loader";
import { PDFDocument } from "pdf-lib";
import fileDownload from "js-file-download";
import { useRouter } from "next/navigation";
import CustomAlert from "@/app/components/alert";

export default function MergePdf() {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [alert, setAlert] = useState({ message: "", status: true });

  const handleFiles = (newFiles) => {
    const pdfFiles = Array.from(newFiles).filter(
      (file) => file.type === "application/pdf"
    );
    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const handleFileChange = (event) => {
    handleFiles(event.target.files);
    event.target.value = null; // reset
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  // MERGE ACTION
  const handleMerge = async () => {
    if (files.length < 2) {
      setAlert({
        message: "Please select at least two PDF files to merge.",
        status: false,
      });
      return;
    }
    setIsLoaderVisible(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        try {
          const fileBytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

          const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (err) {
          console.warn(`Skipping invalid PDF: ${file.name}`, err);
          setAlert({
            message: `Skipped invalid or encrypted PDF: ${file.name}`,
            status: false,
          });
        }
      }

      if (mergedPdf.getPageCount() === 0) {
        setAlert({
          message: "No valid PDFs could be merged.",
          status: false,
        });
        return;
      }

      const mergedPdfBytes = await mergedPdf.save();
      fileDownload(mergedPdfBytes, "merged.pdf", "application/pdf");

      setFiles([]); // clear
      setAlert({ message: "PDFs merged successfully!", status: true });
    } catch (error) {
      console.error("Error merging PDFs:", error);
      setAlert({
        message: "An error occurred during merging. Please try again.",
        status: false,
      });
    } finally {
      setIsLoaderVisible(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.warn("File input not ready yet");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <LoaderModal isVisible={isLoaderVisible} />

      <main className="body-div">
        <section className="text-center mb-12">
          <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>
            <ChevronRight size={16} className="mx-1" />
            <span>Merge PDF</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-[title-font] text-gray-900 mb-4">
            Merge PDF Files
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-[body-font]">
            Easily combine multiple PDF documents into a single, unified file.
            Simply drag and drop your PDFs below to get started.
          </p>
        </section>

        {/* File Drop Zone */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="md:col-span-2"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Hidden input always rendered */}
              <input
                type="file"
                multiple
                accept="application/pdf"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                ref={fileInputRef}
              />

              {files.length === 0 ? (
                <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full">
                  <span className="text-gray-400 text-6xl mb-4">📄</span>
                  <p className="text-gray-600 font-semibold mb-2">
                    Drag & Drop PDF files here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to select files
                  </p>
                  <label
                    htmlFor="file-upload"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Select Files
                  </label>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selected Files
                  </h3>
                  <div className="flex flex-col gap-3">
                    {files.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <File size={24} className="text-red-500" />
                          <span className="text-sm font-medium text-gray-800">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(file)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={triggerFileInput}
                      className="text-blue-600 cursor-pointer hover:underline text-sm font-medium"
                    >
                      Add More Files
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Merge Settings */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Merge Settings
              </h3>
              <div className="w-full flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="sort-order"
                    className="text-gray-700 text-sm"
                  >
                    Sort Order
                  </label>
                  <select
                    id="sort-order"
                    className="border rounded-md px-2 py-1 text-sm bg-white"
                  >
                    <option>Alphabetical</option>
                    <option>Date Added</option>
                    <option>Custom</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="add-cover-page"
                    className="mr-2 rounded"
                  />
                  <label
                    htmlFor="add-cover-page"
                    className="text-gray-700 text-sm"
                  >
                    Add cover page
                  </label>
                </div>
              </div>
              <button
                onClick={handleMerge}
                className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled={files.length < 2}
              >
                Merge PDFs
              </button>
            </div>
          </div>
        </section>
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
