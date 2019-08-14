import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { Store } from "./Store";

const CurrentFileName = () => {
  const { state } = useContext(Store);

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{state.currentFile}</title>
      <link rel="canonical" href="http://mysite.com/example" />
    </Helmet>
  );
};

export default CurrentFileName;
