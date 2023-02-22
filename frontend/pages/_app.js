import React, { useEffect, useState } from "react";
import Link from "next/link";

import ReactDOM from "react-dom/client";
import "./home.css";

import classes from "./../styles/app.module.css";

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import "../styles/globals.css";
function MyApp({ Component, pageProps }) {
  const [songLink, setSongLink] = useState("");
  // useEffect(() => {
  //   console.log("reached here once");
  //   checkConnection();
  // }, []);

  // async function checkConnection() {
  //   const isUnlocked = await window?.ethereum?._metamask.isUnlocked();
  //   console.debug("check if connected", { isUnlocked });
  // }
  return (
    <div className={classes.App}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Component
            songLink={songLink}
            setSongLink={setSongLink}
            {...pageProps}
          />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
