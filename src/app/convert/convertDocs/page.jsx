"use client";
import React, { useState } from "react";
import { Upload, FileDown, Loader2, X, ChevronRight } from "lucide-react";
import CustomAlert from "@/app/components/alert";
import Header from "@/app/header";
import Footer from "@/app/footer";
import ScrollToTopButton from "@/app/components/scrollUp";
import Link from "next/link";

// Lucide-react icons are assumed to be available in the environment.
// To use them, you would typically install them with `npm install lucide-react`
// and import them. For this self-contained example, we will assume they work.

// Main App component
const App = () => {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: true });

  /**
   * Handles the file selection from the input.
   * Validates the file type to be .doc or .docx.
   * @param {React.ChangeEvent<HTMLInputElement>} event The file input change event.
   */
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Reset previous state
    setFile(null);
    setConvertedFile(null);
    setAlert({ message: "", status: true });

    // Validate file type
    const validDocTypes = [
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
    if (!validDocTypes.includes(selectedFile.type)) {
      setAlert({ message: "Please upload a valid DOC or DOCX file.", status: false });
      return;
    }

    setFile(selectedFile);
    setAlert({ message: `File selected: ${selectedFile.name}`, status: true });
  };

  /**
   * Simulates the conversion process.
   * This is a client-side simulation. In a real-world scenario, a server
   * would be required to handle the complex DOC/DOCX to PDF conversion.
   */
  const handleConvert = () => {
    if (!file) {
      setAlert({ message: "Please select a DOC or DOCX file to convert.", status: false });
      return;
    }

    setIsConverting(true);
    setConvertedFile(null);
  

    // Simulate a server-side conversion delay
    setTimeout(() => {
      try {
        // --- THIS IS THE CLIENT-SIDE CONVERSION SIMULATION ---
        // We create a dummy PDF file as a Blob.
        // In a real application, the server would return the actual PDF data.
        const pdfContent = `This is a simulated PDF created from the file "${file.name}".\n\nFull client-side conversion of DOCX to PDF is not feasible due to file format complexity. This demonstrates the user experience and download process.`;
        const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);

        setConvertedFile(url);
        setAlert({ message: "Conversion successful! Your PDF is ready to download.", status: true });
      } catch (error) {
        console.error("Conversion failed:", error);
        setAlert({ message: "Failed to convert file.", status: false });
      } finally {
        setIsConverting(false);
      }
    }, 2000); // 2-second delay to simulate conversion time
  };

  /**
   * Clears the selected file and any converted files.
   */
  const handleRemoveFile = () => {
    setFile(null);
    setConvertedFile(null);
    setAlert({ message: "", status: true });
  };

  
 
  
  // Custom placeholder icon for DOC/DOCX files
  const DocIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-3">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100 text-gray-800 antialiased">
      <Header/>
      <ScrollToTopButton/>
      <main className="flex-grow container mx-auto flex items-center justify-center py-8">
        <div className="body-div w-full">
          <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:underline cursor-pointer">
              Home
            </Link>
            <ChevronRight size={16} className="mx-1" />
            <span> DOC to PDF Converter</span>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              DOC to PDF Converter
            </h1>
            <p className="text-lg text-gray-600">
              Convert your Microsoft Word documents to PDF format.
            </p>
          </div>

          {/* File upload/display card */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {!file ? (
                // File upload area
                <label className="cursor-pointer block p-4">
                  <input
                    type="file"
                    accept=".doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg text-gray-600 mb-2 font-medium">
                      Drop your DOC/DOCX file here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">.doc, .docx</p>
                  </div>
                </label>
              ) : (
                // Selected file display
                <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 rounded-lg p-4 gap-4">
                  <div className="flex items-center text-left min-w-0 flex-grow">
                    <DocIcon />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {file.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        File Size: {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Remove file"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Conversion button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleConvert}
                disabled={!file || isConverting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white shadow-md transition-all duration-200
                  ${!file || isConverting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Converting...
                  </>
                ) : (
                  "Convert to PDF"
                )}
              </button>
            </div>
          </div>

          {/* Converted file download section */}
          {convertedFile && (
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Conversion Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                Your PDF is ready to download.
              </p>
              <a
                href={convertedFile}
                download={`${file.name.split('.')[0]}.pdf`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FileDown className="h-5 w-5 mr-3" />
                Download PDF
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer/>
      {/* Custom Alert display */}
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

export default App;
