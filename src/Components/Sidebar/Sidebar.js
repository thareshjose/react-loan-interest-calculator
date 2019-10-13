import React from "react";
import "./Sidebar.css";
import arrowIcon from "../../images/arrow.png";

const Sidebar = props => {
  const getInterest = (event, amount, months) => {
    event.preventDefault();
    props.getInterest(amount, months);
  };
  let currency = props.currency === "USD" ? "$" : "₹";

  return (
    <div className="container-sidebar">
      <div className="title-sidebar">
        <img src={arrowIcon} alt="arrow" className="img-arrow" />
        <span className="sidebar-text">Recent Checks</span>
      </div>
      <ul className="history-items">
        {props.history.map((item, index) => {
          return (
            <li
              key={index}
              onClick={event => getInterest(event, item.amount, item.months)}
              className="history-item"
            >
              <span className="align-left">
                {currency}
                {item.amount}
              </span>
              -<span className="align-right">{item.months} months</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default React.memo(Sidebar);
