import './globals.css';

export const metadata = {
  title: 'Zing Dentistry',
  description: 'Modern dental care in Chennai',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}