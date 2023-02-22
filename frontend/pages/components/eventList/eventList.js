import React from "react";
import classes from "../../../styles/eventList.module.css";
function EventList({ eventData, index }) {
  // console.log(eventData);
  return (
    <div className={classes.eventList}>
      <p>{index + 1}</p>
      <p>{eventData.name}</p>
      <p>{eventData.description}</p>
      <p>{eventData.schedule}</p>
      <p>{eventData.meetlink}</p>
      {/* <a href={eventData.meetlink}>Link</a> */}
    </div>
  );
}

export default EventList;
