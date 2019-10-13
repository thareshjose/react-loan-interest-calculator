import React from "react";
import "./Footer.css";
import githubIcon from "../../images/github-icon.png";

const Footer = () => {
  return (
    <div className="container-footer">
      <a href="https://github.com/thareshjose">
        <img src={githubIcon} alt="github" />
      </a>
    </div>
  );
};

export default Footer;
