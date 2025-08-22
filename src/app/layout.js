import "../../public/styles/icons-1.10.2/font/bootstrap-icons.css";
import "./globals.css";
import "../../public/styles/animate.css";


 export const metadata = {
  title: "Pdf Minify",
  description: "A comprehensive toolkit for managing and converting documents, images, and office files. Features include PDF editing, image editing, file conversion, and more.",
  keywords: [
    "PDF editor",
    "image editor",
    "document management",
    "file conversion",
    "PDF merge",
    "PDF split",
    "image compression",
    "office file conversion",
    "Pdf Minify",
  ],
  icons: {
    icon: "/all-images/logoImages/logo.fw.png",
    shortcut: "/all-images/logoImages/logo.fw.png",
  },
  openGraph: {
    title: "Pdf Minify",
    description: "Manage and convert documents, images, and office files with ease. PDF Tools, Image Tools, and Document Tools all in one place.",
    type: "website",
    image: "/all-images/logoImages/mobile_logo.ico", // ensure the file extension is correct
  },
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
