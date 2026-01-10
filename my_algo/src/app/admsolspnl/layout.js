"use client"
import Script from 'next/script'
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider } from '../../context/auth'
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const path = usePathname()
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="apple-touch-icon" sizes="57x57" href="/assets/images/logo/favicon/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/assets/images/logo/favicon/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/assets/images/logo/favicon/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/assets/images/logo/favicon/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/assets/images/logo/favicon/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/assets/images/logo/favicon/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/assets/images/logo/favicon/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/assets/images/logo/favicon/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/logo/favicon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/logo/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/assets/images/logo/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/logo/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/assets/images/logo/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/assets/images/logo/favicon/ms-icon-144x144.png" />
        <title>Admin | SOLARES</title>



        <meta content="Explore and collect unique NFTs at NFT21 Store. Your gateway to the world of digital assets." name="description" />
        <meta content="NFT, Buy, Sell, Trading, Mining" name="keywords" />
        <meta property="og:title" content={process.env.SITENAME} />
        <meta property="og:description" content="Explore and collect unique NFTs at NFT21 Store. Your gateway to the world of digital assets." />
        <meta property="og:url" content={process.env.BASEURL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.BASEURL}/assets/images/logo/logo.svg`} />
        <meta name="twitter:card" content={`${process.env.BASEURL}/assets/images/logo/logo.svg`} />
        <meta property="twitter:domain" content="nft21.store" />
        <meta property="twitter:url" content={`${process.env.BASEURL}`} />
        <meta name="twitter:title" content={process.env.SITENAME} />
        <meta name="twitter:description" content="Explore and collect unique NFTs at NFT21 Store. Your gateway to the world of digital assets." />
        <meta name="twitter:image" content={`${process.env.BASEURL}/assets/images/logo/logo.svg`} />



        <link rel="stylesheet" href="/assets/libs/quill/quill.core.css" />
        <link rel="stylesheet" href="/assets/libs/quill/quill.bubble.css" />
        <link rel="stylesheet" href="/assets/libs/custombox/custombox.min.css" />
        <link rel="stylesheet" href="/assets/css/bootstrap-dark.min.css" />
        <link rel="stylesheet" href="/assets/css/icons.min.css" />
        <link rel="stylesheet" href="/assets/css/app-dark.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />

        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-knob/1.2.13/jquery.knob.min.js"></script>

      </head>
      <body className={path == "/admsolspnl" ? "auth-body p-0" : " p-0"}>
        < AuthContextProvider >
          <Toaster position="top-right" />
          {children}
        </AuthContextProvider>
      </body >
      <Script src="/assets/js/vendor.min.js"></Script>
      <Script src="/assets/libs/katex/katex.min.js"></Script>
      <Script src="/assets/libs/quill/quill.min.js"></Script>
      <Script src="/assets/libs/custombox/custombox.min.js"></Script>
      {/* <Script src="/assets/js/pages/inbox.init.js"></Script> */}
      <Script src="/assets/js/app.min.js"></Script>
    </html >
  )
}