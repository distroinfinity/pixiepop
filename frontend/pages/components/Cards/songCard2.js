import React, { useState } from "react";
import { useRouter } from "next/router";
import classes from "./../../../styles/songCard.module.css";
import Link from "next/link";
// import { marketplaceAddress } from "./../../../../backend/config";
import { marketplaceAddress } from "./../../../config";

// import NFTMarketplace from "./../../../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
// import NFTMarketplace from "./../../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import NFTMarketplace from "./../../../public/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.dbg.json";

import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Modal, Form } from "react-bootstrap";

function SongCard({ songData, setSongLink }) {
  const [show, setShow] = useState(false);
  const [resellAmount, setResellAmount] = useState();
  const router = useRouter();
  function handleShow() {
    setShow(true);
  }
  function handleClose() {
    setShow(false);
  }
  function handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "resell") {
      setResellAmount(value);
    }
  }

  async function resell(e) {
    e.preventDefault();
    // console.log("reselling...");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(resellAmount, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(
      songData?.tokenId,
      priceFormatted,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();

    // console.log("re listed");
    router.push("/");
  }

  return (
    <div className={classes.card_main}>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>ReSell NFT</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="resell"
              value={resellAmount}
              onChange={handleChange}
            ></Form.Control>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <button onClick={(e) => resell(e)} className={classes.resell_btn}>
                Relist
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Link href={`/songs/${songData?.tokenId}`}>
        <img src={songData?.image} alt="cover" />
      </Link>{" "}
      <div className={classes.song_data}>
        <Link href={`/songs/${songData?.tokenId}`}>
          <h3>{songData?.name}</h3>
        </Link>

        <p className={classes.artistName}>
          Artist: &nbsp; {/* <Link href={`/artist/${songData.artist}`}> */}
          <span className={classes.price}>
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

        <button onClick={handleShow} className={classes.buy_nft}>
          Resell
        </button>
      </div>
    </div>
  );
}

export default SongCard;
