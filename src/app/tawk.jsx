jsx
import Script from 'next/script';

export default function MyTawk({ Component, pageProps }) {
  return (
    <>
      <Script
        src={`https://embed.tawk.to/68a8cf90661c3b192cff578f/1j39mlk90`}
        strategy="lazyOnload"
      />
      <Component {...pageProps} />
    </>
  );
}
