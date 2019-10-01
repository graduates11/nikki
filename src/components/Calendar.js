import React, { useContext } from "react";
import { Store } from "./Store";
import { Calendar as ReactCalendar } from "react-calendar";
import moment from "moment";
import localization from "moment/locale/de";

moment.locale("de", localization);

const Calendar = () => {
  //   const { state, dispatch } = useContext(Store);

  //   let datesWithEntries = [];
  //   for (let entry of state.allEntries) {
  //     const dateWithEntry = new Date(entry.date).toDateString();
  //     if (!datesWithEntries.includes(dateWithEntry)) {
  //       datesWithEntries.push(dateWithEntry);
  //     }
  //   }

  //   const tileClassName = ({ date, view }) => {
  //     return view === "month" && datesWithEntries.includes(date.toDateString())
  //       ? "highlight"
  //       : "circle";
  //   };

  return (
    <div>
      <ReactCalendar
      // onChange={date => {
      //   dispatch({
      //     type: "SET_DATE",
      //     payload: { date: date }
      //   });
      // }}
      // value={state.date}
      // className={
      //   state.searchBoolean === true ? "hiddenCalendar" : "fullWidth"
      // }
      // tileClassName={tileClassName}
      />
    </div>
  );
};

export default Calendar;
