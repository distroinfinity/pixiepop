import React, { useState } from "react";
import Link from "next/link";

import ReactDOM from "react-dom/client";
import "./home.css";

import classes from "./../styles/app.module.css";

// import App from "./App";

// import { MoralisProvider } from "react-moralis";

import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import "../styles/globals.css";
// routing done here
// const root = ReactDOM.createRoot(document.getElementById("root"));
function MyApp({ Component, pageProps }) {
  const [songLink, setSongLink] = useState("");
  return (
    <div className={classes.App}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          {/* <Link href="/"></Link> */}
          <Component
            songLink={songLink}
            setSongLink={setSongLink}
            {...pageProps}
          />
          <div className="player_div">
            {/* {songLink && songLink !== "" && (
              <>
                <p onClick={(e) => setSongLink("")} className="x_div">
                  x
                </p>
                <AudioPlayer
                  autoPlay
                  src={songLink}
                  onPlay={(e) => console.log("onPlay")}
                  // other props here
                />
              </>
            )} */}
          </div>
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}

export default MyApp;
