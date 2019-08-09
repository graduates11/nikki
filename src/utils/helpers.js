// export const defaultTitle = () => {
//   const date = new Date();
//   const day = date.getUTCDate();
//   const month = date.toLocaleString("default", { month: "long" });
//   const hours = date.getHours();
//   let minutes = date.getUTCMinutes();
//   minutes = minutes < 10 ? `0${minutes}` : minutes;
//   return `${day}. ${month} at ${hours}:${minutes}`;
// };

// function debounce(a, b, c) {
//   var d, e;
//   return function() {
//     function h() {
//       (d = null), c || (e = a.apply(f, g));
//     }
//     var f = this,
//       g = arguments;
//     return (
//       clearTimeout(d), (d = setTimeout(h, b)), c && !d && (e = a.apply(f, g)), e
//     );
//   };
// }
