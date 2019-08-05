import React, { useContext, useEffect } from "react";
import { Store } from "./Store";
import Calendar from "react-calendar";
import moment from "moment";
import localization from "moment/locale/de";
const { ipcRenderer } = window;

moment.locale("de", localization);

const MyCalendar = () => {
  const { state, dispatch } = useContext(Store);

  let datesWithEntries = [];
  for (let entry of state.allEntries) {
    const dateWithEntry = new Date(entry.date).toDateString();
    if (!datesWithEntries.includes(dateWithEntry)) {
      datesWithEntries.push(dateWithEntry);
    }
  }

  const getEntries = () => {
    ipcRenderer.send("get-all-entries");

    return new Promise((resolve, reject) => {
      ipcRenderer.once("get-all-entries-reply", (event, data) => {
        resolve(data);
        const jsonData = JSON.parse(data);
        const { entries, files, currentFile } = jsonData;
        dispatch({
          type: "GET_ALL_ENTRIES",
          payload: {
            date: new Date(),
            allEntries: entries.length > 0 ? entries : [],
            allFiles: files ? files : [],
            currentFile: currentFile
          }
        });
      });
      ipcRenderer.once("get-all-entries-error", (event, args) => {
        reject(args);
        console.log(args);
      });
    });
  };

  useEffect(() => {
    getEntries();
    // eslint-disable-next-line
	}, [])

  const tileClassName = ({ date, view }) => {
    return view === "month" && datesWithEntries.includes(date.toDateString())
      ? "highlight"
      : "circle";
  };

  return (
    <div>
      <Calendar
        onChange={date => {
          dispatch({
            type: "SET_DATE",
            payload: { date: date }
          });
        }}
        value={state.date}
        className={state.searchBoolean === true ? "hiddenCalendar" : "null"}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default MyCalendar;
