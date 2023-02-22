import React, { useState } from "react";
import classes from "../../../styles/addmusic.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
// import { marketplaceAddress } from "../../../../backend/config";
import { marketplaceAddress } from "./../../../config";

// import NFTMarketplace from "../../../../backend/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.json";
import NFTMarketplace from "./../../../public/artifacts/contracts/NFTMarketPlace.sol/NFTMarketplace.json";
// import { PROJECTID, PROJECTSECRET } from "../../../api_key";

const PROJECTID = process.env.REPLICATE_API_TOKEN;
const PROJECTSECRET = process.env.REPLICATE_API_TOKEN;
import { create as ipfsHttpClient } from "ipfs-http-client";
const projectId = PROJECTID;
const projectSecret = PROJECTSECRET;
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

import {
  TextArea,
  Button,
  Input,
  Loading,
  BannerStrip,
  useNotification,
} from "web3uikit";

const ipfs = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function AddThoughtsForm({ setLoadingState }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [royalty, setRoyalty] = useState();
  const [price, setPrice] = useState(null);
  const [cover, setCover] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [finalImage, setFinalImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function MyImageComponent() {
    return (
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          justifyContent: "center",
          border: "12px solid #94BBE9",
          width: 528,
          height: 528,
        }}
      >
        <Image
          src={cover ? cover : "/images/placeholder.jpeg"}
          alt="Cartoon unicorn head"
          width={528}
          height={528}
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
    // console.log("find image on ipfs at", coverUrl);

    const nftUrl = await uploadToIPFS(coverUrl);

    // console.log("nft url is ", nftUrl);

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
    let transaction = await contract.createToken(nftUrl, price_, royalty, {
      value: listingPrice,
    });
    await transaction.wait();
    setLoadingState(false);
    router.push("/");
  }
  const dispatch = useNotification();
  const handleNewNotification = (type) => {
    dispatch({
      type: "error",
      message: "Please reach out to support",
      title: "Error Generating Image",
      position: "topR",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFinalImage(false);
    setLoading(true);
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
      // console.log("error detected");
      handleNewNotification("error");
      setLoading(false);
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
        // console.log("prediction output", prediction.output[0]);
        setCover(prediction.output[0]);
        setFinalImage(true);
        setLoading(false);
      }
      setPrediction(prediction);
    }
  };

  return (
    <>
      <div className={classes.addMusic}>
        {MyImageComponent()}
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "600px",
              justifyContent: "space-evenly",
            }}
          >
            <TextArea
              label="Description"
              name="desc"
              onChange={handleChange}
              placeholder="Describe your image"
              value={desc}
            />
            {/* {finalImage && ( */}
            <>
              <Input
                label="Asset Name"
                name="name"
                placeholder="Enter name of your Asset"
                onChange={handleChange}
                onBlur={function noRefCheck() {}}
                type="text"
              />

              <Input
                label="Asset Price"
                name="price"
                placeholder="Enter price for your Asset"
                onChange={handleChange}
                onBlur={function noRefCheck() {}}
                type="number"
              />

              <Input
                label="Royalty"
                name="royalty"
                placeholder="Enter royalty %"
                onChange={handleChange}
                onBlur={function noRefCheck() {}}
                type="number"
              />
            </>
            {/* // )} */}
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  {loading && (
                    <div
                      style={{
                        backgroundColor: "#ECECFE",
                        borderRadius: "8px",
                        padding: "20px",
                      }}
                    >
                      <Loading
                        size={12}
                        spinnerColor="#2E7DAF"
                        spinnerType="wave"
                      />
                    </div>
                  )}
                </div>
                {!loading && (
                  <div style={{ display: "flex", paddingBottom: "100px" }}>
                    <Button
                      onClick={handleSubmit}
                      text="Generate Art"
                      theme="secondary"
                      size="large"
                      disabled={!desc}
                    />
                    {/* {finalImage && ( */}
                    <Button
                      onClick={listNFTForSale}
                      text="Mint this Art"
                      theme="secondary"
                      size="large"
                      disabled={!name || !price || !royalty}
                    />

                    {/* )} */}
                  </div>
                )}
                <div
                  key="1"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    transform: "scale(1)",
                  }}
                >
                  <BannerStrip
                    onCloseBtnClick={function noRefCheck() {}}
                    text="404 not the droids you are looking for"
                    type="error"
                  />
                  {/* <Button
                    onClick={function noRefCheck() {}}
                    style={{
                      marginTop: "60px",
                    }}
                    text="Click to Show Banner(if hidden)"
                    theme="outline"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default AddThoughtsForm;
