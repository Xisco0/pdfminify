"use client";

import Image from "next/image"; // You will need to import Image from next/image for your GIF


const LoaderModal = ({ isVisible }) => {
  // Only render the modal if it's visible
  if (!isVisible) return null;

  return (
    // Fixed container to cover the entire screen with a semi-transparent background
    <div className="fixed inset-0 bg-[rgba(255,255,255,.8)] bg-opacity-75 flex flex-col items-center justify-center z-[100]">
        <Image
          src="/all-images/bodyImages/loading.gif"
          alt="Loading..."
          width={96}
          height={96}
          className="mb-4"
        />
    
    </div>
  );
};

export default LoaderModal;
