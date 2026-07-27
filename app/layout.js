import "./globals.css";

export const metadata = {
  title: "Zing Dentistry | Dr. V's Dental Clinic, Anna Nagar, Chennai",
  description:
    "Zing Dentistry in Anna Nagar, Chennai — braces, implants, root canal, kids dentistry and more. Open all 7 days, 10 AM to 8 PM.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
