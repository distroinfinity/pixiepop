import React, { useEffect, useState } from "react";
import classes from "../../styles/songPage.module.css";
import { ConnectButton } from "web3uikit";
import FansList from "../components/fansList";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import { TfiThought } from "react-icons/tfi";
import { Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ethers } from "ethers";
import axios from "axios";
import { marketplaceAddress } from "../../config";
import NFTMarketplace from "./../../public/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.json";
function SongPage({ setSongLink }) {
  const [fans, setFans] = useState([]);
  const [trackInfo, setTrackInfo] = useState("");
  const [account, setAccount] = useState(null);

  let router = useRouter();

  useEffect(() => {
    loadData();
  }, [account, fans, trackInfo]);

  async function loadData() {
    await getTrackInfo(router.query.songId);
    await fetchFans(router.query.songId);
    // await getAccount();
  }

  async function getTrackInfo(trackId) {
    //getNFT
    if (trackInfo != "") return;

    console.log("track id is ", trackId);
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.testnet.mantle.xyz/"
    );

    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.getNFT(trackId);
    // console.log("data is", data);
    const tokenUri = await contract.tokenURI(data.tokenId);
    const meta = await axios.get(tokenUri);
    let price = ethers.utils.formatUnits(data.price.toString(), "ether");

    let item = {
      price,
      tokenId: data.tokenId.toNumber(),
      seller: data.seller,
      owner: data.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.desc,
      artist: data.artist,
      sold: data.sold,
      audio: meta.data.image,
      cover: data.cover,
    };
    // return item;

    console.log("song info", item);
    setTrackInfo(item);
  }

  async function fetchFans(songId) {
    if (!songId || fans.length > 0) return;
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.testnet.mantle.xyz/"
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchFansforNft(songId);

    const items = await Promise.all(
      data?.map(async (i) => {
        let amount = ethers.utils.formatUnits(i.amount.toString(), "ether");
        let type =
          ethers.utils.formatUnits(i.fanType.toString(), "ether") * 1e18;
        let item = {
          amount,
          fan: i.fan,
          fanType: type,
        };
        return item;
      })
    );

    let uniqueItems;
    var holder = {};

    items.forEach(function (d) {
      if (holder.hasOwnProperty(d.fan)) {
        holder[d.fan] = {
          amount: parseInt(holder[d.fan].amount) + parseInt(d.amount),
          fanType: parseInt(holder[d.fan].fanType) || parseInt(d.fanType),
        };
      } else {
        holder[d.fan] = { amount: d.amount, fanType: parseInt(d.fanType) };
      }
    });
    let final = [];
    for (var prop in holder) {
      final.push({
        fan: prop,
        amount: holder[prop].amount,
        fanType: holder[prop].fanType,
      });
    }
    function compare(a, b) {
      if (a.amount > b.amount) {
        return 1;
      }
      return 0;
    }
    final.sort(compare);
    // console.log("Filtered fans are", final);
    setFans(final);
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
          <Link href="/mythoughts">
            <div className="side_mini">
              <TfiThought />
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

        <div className="home_right1">
          <div className={classes.songpage_main}>
            <h1>NFT Details</h1>
            <div className={classes.song1}>
              <div className={classes.song_left}>
                <div style={{ border: "12px solid #94BBE9" }}>
                  <img src={trackInfo.image} />
                </div>
              </div>
              <div className={classes.song_center}>
                <div className={classes.labelss}>
                  <p>Name</p>
                  <p>Art Description</p>
                  <p>Artist Name</p>
                  <p>Price</p>
                  <p>Satus</p>
                  <p>Owner</p>
                </div>
                <div className={classes.details}>
                  <p>: {trackInfo.name}</p>
                  <p>: {trackInfo.description}</p>
                  <p>: {trackInfo.artist}</p>
                  <p>: {trackInfo.price}</p>
                  <p>: {trackInfo.sold ? `For Sale` : `Sold`}</p>
                  <p>: {trackInfo.owner}</p>
                </div>
              </div>
            </div>
            <div className={classes.fans_list}>
              <div className={classes.artist_fans}>
                <h1>Top Collectors</h1>
                <div className={classes.songs_table}>
                  {fans?.map((d, index) => (
                    <FansList key={index} fanData={d} index={index} />
                  ))}
                  {fans.length == 0 ? (
                    <h5
                      style={{
                        textAlign: "center",
                        width: "100%",
                        color: "grey",
                      }}
                    >
                      This Art piece does not have any collectors yet.....
                    </h5>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongPage;
