import React, { useContext } from "react";
import { Store } from "./Store";

const EntriesByDate = () => {
  const { state, dispatch } = useContext(Store);

  let result = state.allEntries.filter(entry => {
    const existing = new Date(entry.date).toDateString();
    const requested = new Date(state.date).toDateString();
    return existing === requested;
  });

  return (
    <div>
      {result.length === 0 ? (
        <p>No Entry for that date</p>
      ) : (
        <ul>
          {result.map(entry => (
            <li
              key={entry.id}
              onClick={e => {
                dispatch({
                  type: "GET_ENTRY",
                  payload: {
                    entry
                  }
                });
              }}
            >
              {entry.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// class EntriesByDate extends Component {
//   state = { entry: [] };

//   getEntriesFromDatabase() {
//     const { entries } = require("../lowdb/db.json");

//     //Create a Array with all unique Dates of the Entries
//     let uniqueDate = new Set();
//     for (let entry of entries) {
//       uniqueDate.add(entry.date);
//     }

//     //Th Array with the Dates
//     uniqueDate = Array.from(uniqueDate);
//     this.setState({
//       entries,
//       uniqueDate
//     });
//   }

//   componentDidMount() {
//     this.getEntriesFromDatabase();
//   }
//   componentDidUpdate(prevProps) {
//     if (this.props.date !== prevProps.date) {
//       this.getEntriesFromDatabase();
//       const filterdate = this.state.entries.filter(
//         x => x.date === this.props.date
//       );

//       this.setState({
//         entry: filterdate
//       });
//     }
//   }
//   render() {
//     return (
//       <div>
//         {this.state.entry.length === 0 ? (
//           <p>No Entries for this day</p>
//         ) : (
//           <ul>
//             {this.state.entry.map(x => (
//               <li key={x.id}>{x.title}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     );
//   }
// }

export default EntriesByDate;
