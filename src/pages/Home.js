import React from "react";

require('dotenv').config()

export const Home = () => {
   const goto = (loc) => {
      window.location.href = "./" + loc;
   };
   React.useEffect(() => {
      console.log(process.env.REACT_APP_AK);
   })
   return (
      <div style={{ padding: 50 }}>
         <button onClick={() => goto("ex1")}>Example 1</button>
         <div style={{ padding: 20 }} />
         <button onClick={() => goto("ex2")}>Example 2</button>
      </div >
   );
};
