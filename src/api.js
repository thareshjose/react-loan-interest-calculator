import Axios from "axios";

const baseUrl = "https://ftl-frontend-test.herokuapp.com/";

export const fetchInterest = (amount, numOfMonths) => {
  const interestUrl = `interest?amount=${amount}&numMonths=${numOfMonths}`;
  var encodedURI = window.encodeURI(baseUrl + interestUrl);
  return Axios.get(encodedURI);
};
