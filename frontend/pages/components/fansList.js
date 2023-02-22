import React from "react";
import classes from "../../styles/fansList.module.css";
function FansList({ fanData, index }) {
  return (
    <div className={classes.songlist_main}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
        }}
      >
        <p>{index + 1}</p>
        <h6>{fanData?.fan}</h6>
        <p>{fanData?.amount} BIT</p>
      </div>
      {fanData?.fanType == 1 ? "VIP" : ""}
    </div>
  );
}

export default FansList;
