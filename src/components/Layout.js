import React from "react";

const Layout = (props) => {
  const { children } = props;
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
