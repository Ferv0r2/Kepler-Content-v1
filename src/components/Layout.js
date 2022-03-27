import React from "react";
import Footer from "components/Footer";

const Layout = (props) => {
  const { children } = props;
  return (
    <div>
      <main>{children}</main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
