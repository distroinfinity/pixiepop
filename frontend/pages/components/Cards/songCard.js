import React, { useState } from "react";
import classes from "./../../../styles/songCard.module.css";
import Link from "next/link";
// import { marketplaceAddress } from "./../../../../backend/config";
import { marketplaceAddress } from "./../../../config";
import NFTMarketplace from "./../../../public/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.json";

import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Skeleton } from "web3uikit";

function SongCard({ songData, setSongLink, newBuy, setNewBuy }) {
  async function buyNFT() {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    // console.log("Buying this", songData);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(
      marketplaceAddress,
      "next2",
      NFTMarketplace.abi,
      "next2",
      provider
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    /* user will be prompted to pay the asking proces to complete the transaction */

    const price = ethers.utils.parseUnits(songData.price.toString(), "ether");
    // console.log("fghchfgcgh", price, typeof price);

    const transaction = await contract.createMarketSale(songData?.tokenId, {
      value: price,
    });
    await transaction.wait();
    setNewBuy(!newBuy);
    // loadNFTs();
  }
  const [loaded, setLoaded] = useState(false);

  function handleImageLoaded() {
    setLoaded(true);
  }

  return (
    <div className={classes.card_main}>
      {songData?.sold ? (
        <div className={classes.sold_div}>
          <h1>Sold</h1>
        </div>
      ) : null}
      <Link href={`/songs/${songData?.tokenId}`}>
        <>
          {!loaded && (
            <Skeleton
              animationColor="#0F7FFF"
              backgroundColor="#003470"
              // height="400px"
              theme="image"
              width="250px"
              height="400px"
            />
          )}

          <img src={songData?.image} alt="cover" onLoad={handleImageLoaded} />
        </>
      </Link>{" "}
      {loaded && (
        <div className={classes.song_data}>
          {" "}
          <Link href={`/songs/${songData?.tokenId}`}>
            <h3>{songData?.name}</h3>
          </Link>
          <p className={classes.artistName}>
            Artist: &nbsp; {/* <Link href={`/artist/${songData.artist}`}> */}
            <span style={{ cursor: "pointer" }} className={classes.price}>
              {"0x...." + songData?.artist?.substr(songData.artist.length - 5)}
            </span>
            {/* </Link> */}
          </p>
          <div className={classes.price_div}>
            <p>
              Price: &nbsp;{" "}
              <span className={classes.price}>{songData?.price} BIT</span>
            </p>
          </div>
          {songData?.sold == false ? (
            <button onClick={buyNFT} className={classes.buy_nft}>
              Buy
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default SongCard;
