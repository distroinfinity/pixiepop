import React from 'react'
import classes from "../../styles/loader.module.css";
function loader() {
  return (
    <div className={classes.loader_main}>
      <div className={classes.center}>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
        <div className={classes.wave}></div>
      </div>
    </div>
  );
}

export default loader