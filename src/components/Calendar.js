import React, { useContext } from "react";
import { Store } from "./Store";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

const Calendar = () => {
  const { state, dispatch } = useContext(Store);
  const dates = state.allEntries.map(entry => new Date(entry.date));

  const modifiers = {
    highlighted: dates.concat(new Date(state.date))
  };

  const handleClick = date => {
    dispatch({
      type: "SET_DATE",
      payload: { date }
    });
  };

  const handleMonthChange = date => {
    dispatch({
      type: "SET_DATE",
      payload: { date }
    });
  };

  return (
    <DayPicker
      month={state.date}
      modifiers={modifiers}
      onDayClick={handleClick}
      onMonthChange={handleMonthChange}
    />
  );
};

export default Calendar;
