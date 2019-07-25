import React, { useContext, useEffect } from "react";
import { Store } from "./Store";
import Calendar from "react-calendar";
import moment from "moment";
import localization from "moment/locale/de";
const { ipcRenderer } = window;

const { entries } = require("../lowdb/db.json");

moment.locale("de", localization);
let newdate;
const MyCalendar = () => {
  const { state, dispatch } = useContext(Store);

  let datesWithEntries = [];
  for (let entry of entries) {
    const dateWithEntry = new Date(entry.date).toDateString();
    if (!datesWithEntries.includes(dateWithEntry)) {
      datesWithEntries.push(dateWithEntry);
    }
  }

  const getEntries = () => {
    ipcRenderer.send("get-all-entries");
    return new Promise((resolve, reject) => {
      ipcRenderer.once("get-all-entries-reply", (event, entry) => {
        resolve(entry);
        dispatch({
          type: "GET_ALL_ENTRIES",
          payload: {
            date: newdate === undefined ? state.date : newdate,
            allEntries: [...entry]
          }
        });
      });
      ipcRenderer.once("get-all-entries-error", (event, args) => {
        reject(args);
      });
    });
  };

  useEffect(() => {
    getEntries();
    // eslint-disable-next-line
  }, []);

  const tileClassName = ({ date, view }) => {
    return view === "month" && datesWithEntries.includes(date.toDateString())
      ? "highlight"
      : "circle";
  };

  return (
    <div>
      <Calendar
        onChange={date => {
          newdate = date;
          getEntries(date.toDateString());
          dispatch({
            type: "SET_DATE",
            payload: { date: date }
          });
        }}
        value={state.date}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default MyCalendar;

// class myCalendar extends Component {
//   state = {
//     date: new Date(),
//     convertedDate: null
//   };

//   componentDidMount() {
//     let date = moment(this.state.date).format("L");
//     this.setState({
//       convertedDate: date
//     });
//     this.props.myDate(date);
//   }

//   onChange = date => {
//     this.setState({ date });
//     const newdate = moment(date).format("L");
//     this.setState({ convertedDate: newdate });
//     this.props.myDate(newdate);
//   };

//   render() {
//     return (
//       <div>
//         <Calendar onChange={this.onChange} value={this.state.date} />
//       </div>
//     );
//   }
// }

// export default myCalendar;
