import React from "react";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import sha256 from "./helperfunctions/hash";
import axios from "axios";
import Loader from "./components/loader";
import SongCard from "./components/Cards/songCard2";
import { BiSearch } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { Outlet } from "react-router-dom";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
// import Logo from "./../assets/logo2.png";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "web3uikit";
import Link from "next/link";
import classes from ".././styles/myMusic.module.css";
import { MdLibraryMusic } from "react-icons/md";
import { marketplaceAddress } from "./../../backend/config";
import NFTMarketplace from "./../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

function Mymusic({ setSongLink }) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();
    console.log("nfts ", data);
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const hash = await sha256(
          tokenURI.replace("https://pixie2.infura-ipfs.io/ipfs/", "")
        );
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          tokenURI: hash,
          artist: i.artist,
          sold: i.sold,
          audio: meta.data.image,
          // cover: i.cover,
        };
        return item;
      })
    );
    console.log("my nfts", items);
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
              <div className="side_mini ">
                <AiOutlineHome />
                <p>Home</p>
              </div>
            </Link>
            <Link href="/addnewthoughts">
              <div className="side_mini ">
                <RiMoneyDollarCircleLine />
                <p>Mint Your Thoughts</p>
              </div>
            </Link>
            <Link href="/mymusic">
              <div className="side_mini active">
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
            <div className={classes.mymusic_main}>
              <h1>My NFTs</h1>
              <div className={classes.mymusic}>
                {nfts.length == 0 && (
                  <h5 style={{ textAlign: "center", width: "100%" }}>
                    You haven't purchased any NFTs yet...
                  </h5>
                )}
                {nfts.map((d, index) => (
                  <SongCard
                    key={index}
                    songData={d}
                    setSongLink={setSongLink}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mymusic;
