import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Store } from "./Store";

const DateChanger = () => {
  const { state, dispatch } = useContext(Store);
  // const [pickedDate, setPickedDate] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const date = new Date(state.entry.date);

  const month = date.toLocaleString("default", {
    month: "long"
  });
  const year = date.getFullYear();
  const day = date.getDate();

  const toggleCalendar = e => {
    e && e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleChange = date => {
    // setPickedDate(date);
    const changedEntry = state.entry;
    changedEntry.date = date.toDateString();
    dispatch({
      type: "CHANGE_DATE",
      payload: {
        entry: changedEntry,
        date: date
      }
    });
    toggleCalendar();
  };

  return (
    <div>
      <span className="entry-date mt-2" onClick={toggleCalendar}>
        <span>
          <p className="month-year">
            {month}
            <br></br>
            {year}
          </p>
        </span>
        <span>
          <p className="day">{day}</p>
        </span>
      </span>
      {isOpen && (
        <DatePicker selected={date} onChange={handleChange} withPortal inline />
      )}
    </div>
  );
};

export default DateChanger;
