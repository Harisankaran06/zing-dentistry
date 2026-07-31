import './globals.css';

export const metadata = {
  title: 'Zing Dentistry',
  description: 'Modern dental care in Chennai',
  icons: {
    icon: '/favicon.ico?v=2',
    apple: '/apple-icon.png?v=2',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
