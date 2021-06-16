// import { Link } from "react-router-dom";
import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faReact } from "@fortawesome/free-brands-svg-icons";
// import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { ReactComponent as GitHubIcon } from "../assets/icons/footer/gitHub.svg";
import { ReactComponent as ReactIcon } from "../assets/icons/footer/react.svg";
import { ReactComponent as MongoDBIcon } from "../assets/icons/footer/mongoDB.svg";
import { ReactComponent as SocketIOIcon } from "../assets/icons/footer/socketIO.svg";
import { ReactComponent as NodeIcon } from "../assets/icons/footer/nodeJS.svg";
import { ReactComponent as TypescriptIcon } from "../assets/icons/footer/typescript.svg";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const Wrapper = styled.footer`
  /* background: black; */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 30px;
`;

const Creator = styled.a`
  display: flex;
  border: 1px solid var(--text-color-secondary);
  border-radius: 5px;
  padding: 15px 20px;
  align-items: center;
  margin-right: 25px;
  min-width: 190px;
  width: 150px;
  svg {
    width: 35px;
    margin-right: 10px;
    fill: var(--text-color-secondary);
  }
`;
const CreatorInfo = styled.div`
  color: var(--text-color-secondary);
`;

const CreatorName = styled.div`
  color: var(--text-color-secondary);
`;

const ReactIconWrapper = styled.a`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: var(--text-color-secondary);
  margin-right: 25px;
  :hover {
    font-size: 18px;
    color: var(--text-color-secondary);
  }
  svg {
    width: 35px;
    margin-right: 7px;
    fill: var(--text-color-secondary);
  }
`;

const NodeJsWrapper = styled.a`
  margin-right: 25px;
  svg {
    width: 65px;
    /* margin-right: 7px; */
    fill: var(--text-color-secondary);
  }
`;

const MongoDBWrapper = styled.a`
  margin-right: 15px;
  svg {
    width: 95px;
    /* margin-right: 7px; */
    fill: var(--text-color-secondary);
  }
`;

const SocketIOWrapper = styled.a`
  margin-right: 15px;
  svg {
    min-width: 65px;
    width: 120px;
    height: 60px;
    /* margin-right: 7px; */
    fill: var(--text-color-secondary);
  }
`;

const TypescriptWrapper = styled.a`
  margin-right: 20px;
  svg {
    width: 90px;
    /* margin-right: 7px; */
    fill: var(--text-color-secondary);
  }
`;

const Footer = () => {
  const location = useLocation();
  console.log("location", location.pathname.includes("conversation"));
  if (location.pathname.includes("conversation")) {
    return <></>;
  }

  return (
    <Wrapper translate="no" className="footer notranslate">
      <Creator
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/antonlavrinov/social-media"
      >
        <GitHubIcon />
        <CreatorInfo>
          Created by
          <CreatorName>Anton Lavrinov</CreatorName>
        </CreatorInfo>
      </Creator>
      <ReactIconWrapper
        target="_blank"
        rel="noopener noreferrer"
        href="https://reactjs.org/"
      >
        <ReactIcon />
        React
      </ReactIconWrapper>
      <NodeJsWrapper
        target="_blank"
        rel="noopener noreferrer"
        href="https://nodejs.org/en/"
      >
        <NodeIcon />
      </NodeJsWrapper>
      <MongoDBWrapper
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.mongodb.com/"
      >
        <MongoDBIcon />
      </MongoDBWrapper>
      <SocketIOWrapper
        target="_blank"
        rel="noopener noreferrer"
        href="https://socket.io/"
      >
        <SocketIOIcon />
      </SocketIOWrapper>
      <TypescriptWrapper
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.typescriptlang.org/"
      >
        <TypescriptIcon />
      </TypescriptWrapper>
    </Wrapper>
  );
};

export default Footer;
