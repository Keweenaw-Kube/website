import React from 'react';
import { AppProps } from 'next/app'
import Link from 'next/link'
import Head from 'next/head'
import { Navbar, Button } from 'rbx';
import './styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet"/> 
        <title>Keweenaw Kube</title>
      </Head>

      <Navbar>
        <Navbar.Brand>
          <Link href="/" passHref>
            <Navbar.Item>
              <img
                src="/logo.svg"
                alt=""
                role="presentation"
                width="28"
                height="28"
              />
            </Navbar.Item>
          </Link>
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Segment align="start">
            <Link href="/servers" passHref>
              <Navbar.Item>Servers</Navbar.Item>
            </Link>

            <Link href="/about" passHref>
              <Navbar.Item>About</Navbar.Item>
            </Link>
          </Navbar.Segment>

          <Navbar.Segment align="end">
            <Navbar.Item>
              <Button.Group>
                <Link href="/login" passHref>
                  <Button color="primary" as="a">
                    <strong>Login</strong>
                  </Button>
                </Link>
              </Button.Group>
            </Navbar.Item>
          </Navbar.Segment>
        </Navbar.Menu>
      </Navbar>
      
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
