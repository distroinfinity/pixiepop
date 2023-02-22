import React from "react";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { ConnectButton } from "web3uikit";
import { useEffect, useState } from "react";
import { TfiThought } from "react-icons/tfi";
// import { MdLibraryMusic } from "react-icons/md";
import AddThoughtsForm from "./components/addmusic/addthoughtsForm";
import { useRouter } from "next/router";
import Loader from "./components/loader";

function AddNewThoughts() {
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
              <div className="side_mini active">
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

          <div className="home_right">
            <AddThoughtsForm setLoadingState={setLoadingState} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AddNewThoughts;
