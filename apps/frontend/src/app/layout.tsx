import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TicketPulse - High-Concurrency Flash Sale Ticket Engine',
  description: 'Platform booking tiket konser real-time dengan proteksi Redis Lock & RabbitMQ Event Driven Architecture.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
