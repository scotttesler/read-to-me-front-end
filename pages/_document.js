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
            href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
            integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
            rel="stylesheet"
          />
          <title>Read To Me</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
