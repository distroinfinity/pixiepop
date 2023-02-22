import React from "react";
import classes from "./../../../styles/songs.module.css";
import Card from "../Cards/songCard";

function Songs(props) {
  return (
    <div className={classes.songs_div}>
      {props?.nfts?.map((d, index) => (
        <Card newBuy={props.newBuy} setNewBuy={props.setNewBuy} setSongLink={props.setSongLink} songData={d} key={index} />
      ))}
    </div>
  );
}

export default Songs;
