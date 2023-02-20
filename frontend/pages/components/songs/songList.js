import React from "react";
// import { BsFillPlayCircleFill } from "react-icons/bs";
import classes from "../../../styles/songList.module.css";
function SongsList({ setSongLink, songdata, index }) {
  console.log("data of song", songdata);

  return (
    <div className={classes.songlist_main}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
        }}
      >
        <p style={{ flex: "0.1" }}>{index + 1}</p>
        <img
          style={{ flex: "0.1" }}
          className={classes.song_img}
          src={songdata.cover}
        />
        <h5 style={{ flex: "0.4" }}>{songdata.name}</h5>
        <p style={{ flex: "0.3" }}>{songdata.price} Matic</p>
      </div>
      {/* <BsFillPlayCircleFill
        onClick={() => setSongLink(songdata.audio)}
        className={classes.play}
      /> */}
    </div>
  );
}

export default SongsList;
