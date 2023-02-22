import React, { useState, useEffect } from "react";
import classes from "../styles/dashboard.module.css";
import { AiOutlineHome } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { TfiThought } from "react-icons/tfi";
import "bootstrap/dist/css/bootstrap.min.css";
import { ConnectButton } from "web3uikit";
import Link from "next/link";
import SongCard from "./components/Cards/songCard";
import "bootstrap/dist/css/bootstrap.min.css";
import Web3Modal from "web3modal";
import axios from "axios";
import { ethers } from "ethers";
import Loader from "./components/loader";
import { marketplaceAddress } from "./../config";
import NFTMarketplace from "./../public/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.json";

function Dashboard({ setSongLink }) {
  const [myNfts, setMyNfts] = useState([]);
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

    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await contract.fetchItemsListed();
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          // identiconHash: hash,
          artist: i.artist,
          sold: i.sold,
          audio: meta.data.image,
          cover: i.cover,
        };
        return item;
      })
    );
    setMyNfts(items);
    setLoadingState(false);
  }

  return (
    <div>
      <div className="header_main">
        <div className="header_left">
          <Link href="/">
            <img src="/images/logo.png" style={{ height: "60px" }} />
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "black",
              // marginLeft: "15px",
            }}
          >
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
              <div className="side_mini">
                <TfiThought />
                <p>Owned Thoughts</p>
              </div>
            </Link>
            <Link href="/dashboard">
              <div className="side_mini active">
                <IoPersonOutline />
                <p>Creator Dashboard</p>
              </div>
            </Link>
          </div>

          <div className="home_right">
            <div className={classes.dashboard_main}>
              <h1>My NFTs</h1>
              <br />
              <div className={classes.dashboard_nfts}>
                {myNfts.length == 0 && (
                  <h5
                    style={{
                      textAlign: "center",
                      width: "100%",
                      color: "grey",
                    }}
                  >
                    You haven&apos;t minted any music yet.....
                  </h5>
                )}
                {myNfts.map((d, index) => (
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

export default Dashboard;
