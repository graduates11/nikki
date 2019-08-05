import React, { useContext, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DatePicker from "react-date-picker";
import { Store } from "./Store";

const DateChanger = () => {
  const { state, dispatch } = useContext(Store);
  const [isOpen, setIsOpen] = useState(false);

  const date = new Date(state.entry.date);
  let changedDate;

  const month = date.toLocaleString("default", {
    month: "long"
  });
  const year = date.getFullYear();
  const day = date.getDate();

  const submitChangedDate = e => {
    if (e.target.id === "changeDate") {
      const changedEntry = { ...state.entry };
      changedEntry.date = changedDate;
      dispatch({
        type: "CHANGE_DATE",
        payload: {
          entry: changedEntry,
          date: changedDate
        }
      });
    }
    toggleCalendar();
  };

  const toggleCalendar = e => {
    e && e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleChange = date => {
    changedDate = date;
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
      <Modal isOpen={isOpen}>
        <ModalBody>
          <DatePicker
            onChange={handleChange}
            value={date}
            tileClassName="circle"
            format="MM.dd.y"
          ></DatePicker>
        </ModalBody>
        <ModalFooter>
          <Button id="cancel" onClick={toggleCalendar}>
            Cancel
          </Button>{" "}
          <Button id="changeDate" onClick={submitChangedDate}>
            Change Date
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DateChanger;
