import React, { useContext } from "react";
import { Store } from "./Store";
import Calendar from "react-calendar";
import moment from "moment";
import localization from "moment/locale/de";

moment.locale("de", localization);

const MyCalendar = () => {
  const { state, dispatch } = useContext(Store);
  console.log(state);

  return (
    <div>
      <Calendar
        onChange={date => {
          dispatch({
            type: "SET_DATE",
            payload: { date: date, convertedDate: moment(date).format("L") }
          });
        }}
        value={state.date}
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
