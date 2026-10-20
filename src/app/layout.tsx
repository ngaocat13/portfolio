import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alex Rivera | Robotics & Embedded Systems Engineer',
  description: 'Personal engineering portfolio, projects, and technical journal on robotics, modern control theory, and embedded firmware.',
  keywords: ['Robotics', 'Control Theory', 'LQR', 'Embedded Systems', 'FreeRTOS', 'STM32', 'ROS 2', 'Kalman Filter'],
  authors: [{ name: 'Alex Rivera' }],
  openGraph: {
    title: 'Alex Rivera | Robotics & Control Systems Engineer',
    description: 'Robotics, control theory, and embedded systems engineering portfolio and technical blog.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* KaTeX CSS for LaTeX math rendering */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-300">
        {children}
      </body>
    </html>
  );
}
