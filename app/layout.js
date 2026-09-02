import './globals.css';

export const metadata = {
  title: "Dr. V's Zing Dentistry",
  description: 'Dental care in Annanagar East, Chennai',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}