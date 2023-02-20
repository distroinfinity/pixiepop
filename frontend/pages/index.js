import React from "react";
import { BiSearch } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { MdLibraryMusic } from "react-icons/md";
// import Logo from "./../assets/logo2.png";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "web3uikit";
import Link from "next/link";
import classes from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Loader from "./components/loader";
import sha256 from "./helperfunctions/hash";

import { marketplaceAddress } from "./../../backend/config";
import NFTMarketplace from "./../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

import Song from "./components/songs/songs";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function Home({ setSongLink }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [newBuy, setNewBuy] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, [newBuy]);

  async function loadNFTs() {
    /* query music */
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItems();
    // console.log("nfts are", data);

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        console.log("meta data is", meta);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const hash = await sha256(
          tokenUri.replace("https://pixie2.infura-ipfs.io/ipfs/", "")
        );
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.desc,
          tokenURI: hash,
          artist: i.artist,
          sold: i.sold,
          audio: meta.data.image,
          // cover: i.cover,
        };
        return item;
      })
    );
    console.log("filetered items are", items);
    setNfts(items);
    setLoadingState(false);
  }

  return (
    <div>
      <div className="header_main">
        <div className="header_left">
          <Link href="/">
            <img src="/images/logo2.png" />
          </Link>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1>PixiePop</h1>
          </div>
        </div>
        <div className="header_center"></div>
        <div className="header_right">
          <ConnectButton moralisAuth={false} />
        </div>
      </div>
      {loadingState ? (
        <Loader />
      ) : (
        <div className="home2">
          <div className="sidebar_main">
            <Link href="/">
              <div className="side_mini active">
                <AiOutlineHome />
                <p>Home</p>
              </div>
            </Link>
            <Link href="/addnewmusic">
              <div className="side_mini ">
                <RiMoneyDollarCircleLine />
                <p>Mint Your Thoughts</p>
              </div>
            </Link>
            <Link href="/mymusic">
              <div className="side_mini">
                <MdLibraryMusic />
                <p>Owned Thoughts</p>
              </div>
            </Link>
            <Link href="/dashboard">
              <div className="side_mini">
                <IoPersonOutline />
                <p>Creator Dashboard</p>
              </div>
            </Link>
          </div>

          <div className="home_right">
            <h1>
              gm, <span className="grad">dreamers</span> 💭
            </h1>
            <h4 className="textt">Freshly Minted Thoughts</h4>

            {nfts.length == 0 && (
              <h5 style={{ textAlign: "center", width: "100%" }}>
                Nothing published yet...
              </h5>
            )}
            <Song
              newBuy={newBuy}
              setNewBuy={setNewBuy}
              setSongLink={setSongLink}
              nfts={nfts}
            ></Song>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
