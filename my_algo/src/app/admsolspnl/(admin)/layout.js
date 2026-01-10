'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import Header from '../../../components/include/Header'
import Sidebar from '../../../components/include/Sidebar'
import Footer from '../../../components/include/Footer';
import PageLoader from '../../../components/include/PageLoader';
import NextTopLoader from 'nextjs-toploader';
import { AuthContextProvider } from '../../../context/auth';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const path = usePathname()
  return (
    <html lang="en" >
      <body className='p-0'>
        <AuthContextProvider>
          <ProgressBar height="4px" color="#0e7883" options={{ showSpinner: false }} shallowRouting />
          <div id="wrapper">
            <Header />
            <Sidebar />
            <PageLoader />
            <NextTopLoader
              color="#4cc9f0"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={true}
              easing="ease"
              speed={200}
              shadow="0 0 10px #4cc9f0,0 0 5px #4cc9f0"
            />
            <div className="content-page">
              {children}
              <Footer />
            </div>
          </div>
        </AuthContextProvider>
      </body>
    </html >
  )
}
