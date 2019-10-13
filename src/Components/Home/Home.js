import React, { Component } from "react";
import Sidebar from "../Sidebar/Sidebar";
import InputRange from "react-input-range";
import { fetchInterest } from "../../api";
import "./Home.css";
import "react-input-range/lib/css/index.css";
import { debounce } from "debounce";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minAmount: 500,
      maxAmount: 5000,
      minMonth: 6,
      maxMonth: 24,
      principalAmount: 500,
      numOfMonths: 6,
      interestRate: "",
      numOfPayments: "",
      monthlyPayment: "",
      currency: "",
      history: [],
      toggleSidebarClass: "history-items"
    };
    this.getInterest = debounce(this.getInterest, 100);
  }
  componentDidMount() {
    let { principalAmount, numOfMonths } = this.state;
    let history = JSON.parse(localStorage.getItem("history"));
    history = history || [];
    this.setState({ history });
    fetchInterest(principalAmount, numOfMonths).then(response => {
      this.updateInterestDetails(response.data, principalAmount, numOfMonths);
    });
  }

  updateInterestDetails = (interestData, principalAmount, numOfMonths) => {
    this.setState({
      principalAmount,
      numOfMonths,
      interestRate: interestData.interestRate,
      monthlyPayment: interestData.monthlyPayment.amount,
      numOfPayments: interestData.numPayments,
      currency: interestData.monthlyPayment.currency
    });
  };

  setPrincipalAmount = (principalAmount, numOfMonths) => {
    this.setState({ principalAmount });
    this.getInterest(principalAmount, numOfMonths);
  };

  setNoOfMonths = (principalAmount, numOfMonths) => {
    this.setState({ numOfMonths });
    this.getInterest(principalAmount, numOfMonths);
  };

  getInterest = (principalAmount, numOfMonths) => {
    fetchInterest(principalAmount, numOfMonths).then(response => {
      this.updateInterestDetails(response.data, principalAmount, numOfMonths);
    });

    let history = [...this.state.history];
    history.unshift({
      amount: principalAmount,
      months: numOfMonths
    });
    history = history.reduce((unique, o) => {
      if (
        !unique.some(obj => obj.amount === o.amount && obj.months === o.months)
      ) {
        unique.push(o);
      }
      return unique;
    }, []);

    history.length = history.length > 5 ? 5 : history.length;
    localStorage.setItem("history", JSON.stringify(history));
    this.setState({ history });
  };

  formatCurrency = value => {
    if (this.state.currency === "USD") {
      return `$${value}`;
    } else {
      return `₹${value}`;
    }
  };
  render() {
    let {
      principalAmount,
      numOfMonths,
      minAmount,
      maxAmount,
      minMonth,
      maxMonth,
      interestRate,
      monthlyPayment,
      numOfPayments,
      history
    } = this.state;
    return (
      <>
        <div className="container-home">
          <ul>
            <li>Loan Amount:</li>
            <li className="slider-amount">
              <InputRange
                maxValue={maxAmount}
                minValue={minAmount}
                value={principalAmount}
                formatLabel={this.formatCurrency}
                onChange={principalAmount =>
                  this.setPrincipalAmount(principalAmount, numOfMonths)
                }
              />
            </li>
            <li>Loan Duration (Months):</li>
            <li className="slider-months">
              <InputRange
                maxValue={maxMonth}
                minValue={minMonth}
                value={numOfMonths}
                onChange={numOfMonths =>
                  this.setNoOfMonths(principalAmount, numOfMonths)
                }
              />
            </li>
          </ul>
          <hr className="line" />
          <ul className="container-interest-details">
            <li>
              <p className="result">{interestRate}%</p>
              <p>Interest Rate</p>
            </li>
            <li>
              <p className="result">{this.formatCurrency(monthlyPayment)}</p>
              <p>Monthly Payment</p>
            </li>
            <li>
              <p className="result">{numOfPayments}</p>
              <p>No. of Payments</p>
            </li>
          </ul>
          <hr className="line" />
        </div>
        {history.length > 0 && (
          <Sidebar
            history={history}
            getInterest={this.getInterest}
            currency={this.state.currency}
          />
        )}
      </>
    );
  }
}

export default Home;
