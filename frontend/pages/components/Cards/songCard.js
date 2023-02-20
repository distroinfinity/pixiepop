import React from "react";
import classes from "./../../../styles/songCard.module.css";
// import { BsPlayCircle } from "react-icons/bs";
import Link from "next/link";
import { marketplaceAddress } from "./../../../../backend/config";
import NFTMarketplace from "./../../../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

function SongCard({ songData, setSongLink, newBuy, setNewBuy }) {
  // function handleSongPlay() {
  //   setSongLink(songData.audio);
  // }

  async function buyNFT() {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    console.log("Buying this", songData);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    /* user will be prompted to pay the asking proces to complete the transaction */

    const price = ethers.utils.parseUnits(songData.price.toString(), "ether");
    console.log("fghchfgcgh", price, typeof price);

    const transaction = await contract.createMarketSale(songData.tokenId, {
      value: price,
    });
    await transaction.wait();
    setNewBuy(!newBuy);
    // loadNFTs();
  }

  // console.log("song data is", songData);
  return (
    <div className={classes.card_main}>
      {songData.sold ? (
        <div className={classes.sold_div}>
          <h1>Sold</h1>
        </div>
      ) : null}
      <Link href={`/songs/${songData.tokenId}`}>
        <img src={songData.image} alt="cover" />
      </Link>{" "}
      {/* <BsPlayCircle onClick={handleSongPlay} className={classes.playIcon} /> */}
      <div className={classes.song_data}>
        {" "}
        <Link href={`/songs/${songData.tokenId}`}>
          <h3>{songData?.name}</h3>
        </Link>
        <p className={classes.artistName}>
          Artist: &nbsp;{" "}
          <Link href={`/artist/${songData.artist}`}>
            <span style={{ cursor: "pointer" }} className={classes.price}>
              {"0x...." + songData?.artist?.substr(songData.artist.length - 5)}
            </span>
          </Link>
        </p>
        <div className={classes.price_div}>
          <p>
            Price: &nbsp;{" "}
            <span className={classes.price}>{songData?.price} Matic</span>
          </p>
        </div>
        {songData.sold == false ? (
          <button onClick={buyNFT} className={classes.buy_nft}>
            Buy
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default SongCard;
