import Document, { Head, Main, NextScript } from "next/document";
import React from "react";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charset="utf-8" />
          <meta
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
            name="viewport"
          />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
          <link
            crossorigin="anonymous"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
            integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
            rel="stylesheet"
          />
          <link
            crossorigin="anonymous"
            href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
            integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
            rel="stylesheet"
          />
          <link
            href="https://unpkg.com/react-rangeslider/umd/rangeslider.min.css"
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
