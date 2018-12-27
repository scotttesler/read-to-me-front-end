import Document, { Head, Main, NextScript } from "next/document";
import React from "react";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <meta
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
            name="viewport"
          />
          <link
            href="/static/favicon.ico"
            key="favicon"
            rel="shortcut icon"
            type="image/x-icon"
          />
          <link
            crossOrigin="anonymous"
            href="https://stackpath.bootstrapcdn.com/bootswatch/4.1.3/journal/bootstrap.min.css"
            integrity="sha384-5C8TGNupopdjruopVTTrVJacBbWqxHK9eis5DB+DYE6RfqIJapdLBRUdaZBTq7mE"
            rel="stylesheet"
          />
          <link
            crossOrigin="anonymous"
            href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
            integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
