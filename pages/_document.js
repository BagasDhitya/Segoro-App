import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <link  href='https://fonts.googleapis.com/css?family=Roboto&display=optional' rel='stylesheet'></link>
                <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=optional" rel="stylesheet"></link>
                <link href='https://fonts.googleapis.com/css?family=Lato&display=optional' rel='stylesheet'></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}