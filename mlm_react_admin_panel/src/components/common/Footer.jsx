import React from "react";
import { format } from 'date-fns';

const FooterSection = () => {
  const currentDate = new Date();
  const currentYear = format(currentDate, 'yyyy');
  return (
    <footer className="footer_copy">
      <div className="container">
        <p>Copyright @ All right reserved. {currentYear}</p>
      </div>
    </footer>
  );
};

export default FooterSection;
