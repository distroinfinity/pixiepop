import React, { useState } from "react";
import classes from "../../../styles/addmusic.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Configuration, OpenAIApi } from "openai";
const axios = require("axios").default;

import { PROJECTID, PROJECTSECRET } from "../../../api_key";
import { create as ipfsHttpClient } from "ipfs-http-client";

const projectId = PROJECTID;
const projectSecret = PROJECTSECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const configuration = new Configuration({
  apiKey: `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`,
});
const openai = new OpenAIApi(configuration);

import { marketplaceAddress } from "../../../../backend/config";
import NFTMarketplace from "./../../../../backend/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.json";

function AddmusicForm({ setLoadingState }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [royalty, setRoyalty] = useState();
  const [price, setPrice] = useState(null);
  // const [fileUrl, setFileUrl] = useState(null);
  const [mp3, setMp3] = useState(null);
  const [cover, setCover] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  function MyImageComponent() {
    return (
      <div>
        {console.log("Image cover", cover)}
        <Image
          src={cover ? cover : "/images/placeholder.jpeg"}
          alt="Cartoon unicorn head"
          width={500}
          height={500}
        />
      </div>
    );
  }

  function handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "name") {
      setName(value);
    }
    if (name === "desc") {
      setDesc(value);
    }
    if (name === "price") {
      setPrice(value);
    }
    if (name === "royalty") {
      setRoyalty(value);
    }
  }
  async function onChange(e) {
    const file = e.target.files[0];
    setMp3(file);
  }
  async function selectCover(e) {
    const file = e.target.files[0];
    console.log("selected image file is", e);

    setCover(file);
  }

  async function uploadToIPFS(mp3Url) {
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      desc,
      image: mp3Url,
    });
    let nftUrl;
    try {
      const added = await ipfs.add(data);
      //https://pixie2.infura-ipfs.io
      nftUrl = `https://pixie2.infura-ipfs.io/ipfs/${added.path}`;
    } catch (error) {
      console.log("Error uploading nft json: ", error);
    }
    return nftUrl;
  }

  async function listNFTForSale() {
    console.log("reaced here", cover);
    let file;
    let coverUrl;
    try {
      const response = await fetch(cover);
      const buffer = await response.arrayBuffer();
      const ipfsResponse = await ipfs.add(buffer);
      console.log(
        "File uploaded to IPFS with hash ",
        ipfsResponse.cid.toString()
      );
      coverUrl = `https://pixie2.infura-ipfs.io/ipfs/${ipfsResponse.cid.toString()}`;
    } catch (error) {
      console.log("Error downloading and uploading image to IPFS:", error);
    }
    console.log("find image on ipfs at", coverUrl);

    // try {
    //   const result = await ipfs.add(file);
    //   console.log("infura result for cover", result);
    //   console.log(`File uploaded to IPFS with hash ${result.cid.toString()}`);
    //   coverUrl = `https://pixie2.infura-ipfs.io/ipfs/${result.path}`;
    // } catch (error) {
    //   console.log("Error uploading cover photo: ", error);
    // }
    // console.log("ipfs cover url is ", coverUrl);
 

    // const nftUrl = await uploadToIPFS(mp3Url);
    const nftUrl = await uploadToIPFS(coverUrl);

    console.log("nft url is ", nftUrl);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    const price_ = ethers.utils.parseUnits(price.toString(), "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(
      nftUrl,
      price_,
      royalty,
      // coverUrl,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
    setLoadingState(false);
    router.push("/");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: desc,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      if (prediction.output) {
        console.log("prediction output", prediction.output[0]);
        setCover(prediction.output[0]);
        // const url = prediction.output[0];
        // await fetch(url)
        //   .then((response) => {
        //     return response.blob();
        //   })
        //   .then((blob) => {
        //     const url = window.URL.createObjectURL(new Blob([blob]));
        //     const link = document.createElement("a");
        //     link.href = url;
        //     link.setAttribute("download", "image.jpg");
        //     document.body.appendChild(link);
        //     link.click();
        //     link.parentNode.removeChild(link);
        //   });
      }
      setPrediction(prediction);
    }
  };

  return (
    <div className={classes.addMusic}>
      {MyImageComponent()}
      <div className={classes.input_div}>
        <label>Description</label>
        <textarea
          onChange={handleChange}
          name="desc"
          row={3}
          rows="10"
          cols="40"
          className={classes.inputt}
        />
        {/* <textarea
          className="app-input"
          placeholder="Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh.."
          onChange={(e) => setPrompt(e.target.value)}
          rows="10"
          cols="40"
        /> */}
      </div>
      <div className={classes.input_div}>
        <label>Name</label>
        <input
          onChange={handleChange}
          name="name"
          type="text"
          className={classes.inputt}
        />
      </div>
      <div className={classes.input_div}>
        <label>Asset Price</label>
        <input
          onChange={handleChange}
          name="price"
          type="text"
          className={classes.inputt}
        />
      </div>
      <div className={classes.input_div}>
        <label>Royalty (in %)</label>
        <input
          onChange={handleChange}
          name="royalty"
          type="text"
          className={classes.inputt}
        />
      </div>
      {/* <div className={classes.input_div}>
        <label>Select cover photo</label>
        <input
          onChange={selectCover}
          type="file"
          accept=".jpeg,.jpg"
          className={classes.inputt}ra
        />
      </div> */}
      <button onClick={listNFTForSale} className={classes.createBtn}>
        Create NFT
      </button>
      <button onClick={handleSubmit} className={classes.createBtn}>
        Generate NFT
      </button>
    </div>
  );
}

export default AddmusicForm;
