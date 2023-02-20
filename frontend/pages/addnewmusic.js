import React from "react";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { ConnectButton } from "web3uikit";
import { useEffect, useState } from "react";
import { MdLibraryMusic } from "react-icons/md";
import { ethers } from "ethers";
import axios from "axios";
import AddmusicForm from "./components/addmusic/addmusicForm";
import sha256 from "./helperfunctions/hash";
import { marketplaceAddress } from "./../../backend/config";
// import NFTMarketplace from "./../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Song from "./components/songs/songs";
import { useRouter } from "next/router";
import Loader from "./components/loader";
function Addnewmusic() {
  let router = useRouter();
  const [loadingState, setLoadingState] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoadingState(false);
    }, 2000);
  }, []);
  return (
    <div>
      <div className="header_main">
        <div className="header_left">
          <Link href="/">
            <img src="/images/logo2.png" />
          </Link>
          <h1>PixiePop</h1>
        </div>
        <div className="header_center">
          {/* <div className="search_div">
            <input
              className="search_input"
              type="text"
              placeholder="Search..."
            />
            <BiSearch />
          </div> */}
        </div>
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
            <Link href="/addnewmusic">
              <div className="side_mini active">
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
            <h1>Spill your thoughts out...</h1>
            <AddmusicForm setLoadingState={setLoadingState} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Addnewmusic;
