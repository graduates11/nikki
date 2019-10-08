import React, { useContext, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import DatePicker from "react-date-picker";
import { Store } from "./Store";

const DateChanger = () => {
  const { state, dispatch } = useContext(Store);
  const [isOpen, setIsOpen] = useState(false);
  const [changedDate, setChangedDate] = useState();

  const date = new Date(state.entry.date);

  const month = date.toLocaleString("default", {
    month: "long"
  });
  const year = date.getFullYear();
  const day = date.getDate();

  const submitChangedDate = e => {
    if (e.target.id === "changeDate") {
      if (changedDate === undefined) {
        return toggleCalendar();
      }
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
    setChangedDate(date);
  };

  return (
    <div id="entryDate datePickerfullWidth">
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
      <Modal isOpen={isOpen} toggle={toggleCalendar}>
        <ModalBody className="openDatePicker">
          <DatePicker
            onChange={handleChange}
            value={changedDate === undefined ? date : changedDate}
            tileClassName="circle"
            format="dd MMM y"
          ></DatePicker>
        </ModalBody>
        <ModalFooter className="openDatePicker">
          <Button
            color="white"
            className="button button--antiman button--round-l button--text-medium"
            id="cancel"
            onClick={toggleCalendar}
          >
            Cancel
          </Button>{" "}
          <Button
            color="white"
            className="button button--antiman button--round-l button--text-medium"
            id="changeDate"
            onClick={submitChangedDate}
          >
            Change Date
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DateChanger;
