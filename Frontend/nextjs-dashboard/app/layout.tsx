import '@/app/ui/global.css';
import { inter } from './ui/fonts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
