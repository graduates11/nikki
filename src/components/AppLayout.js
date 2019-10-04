import React, { useContext } from "react";
// import LayoutContext from "./Store"
import { TextEditor } from "./index";
// import "rc-calendar/assets/index.css";
// import Calendar from "react-calendar";
// import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

const modifiers = {
  highlighted: [new Date(2019, 9, 19), new Date(2019, 9, 21)]
};

const AppLayout = props => {
  const handleClick = day => console.log(day);
  return (
    <div>
      <DayPicker modifiers={modifiers} onDayClick={handleClick} />
      <TextEditor />
    </div>
  );
};

export default AppLayout;
