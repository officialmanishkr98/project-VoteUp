import "regenerator-runtime/runtime";
import React from "react";
import { isAdmin, login, logout } from "./utils";
import "./global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// components
import Home from "./Components/Home";
import NewPoll from "./Components/NewPoll";
import PollingStation from "./Components/PollingStation";
import CountdownTimer from "./Components/CountdownTimer";

// images
import voteUpLogo from "./assets/MainLogo.svg";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");
export default function App() {
  const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

  const changeCandidatesFunction = async (prompt) => {
    if (window?.accountId === "") {
      alert("Please login to vote");
      return;
    }
    let namePair = await window.contract.getCandidatePair({ prompt: prompt });
    localStorage.setItem("Candidate1", namePair[0]);
    localStorage.setItem("Candidate2", namePair[1]);
    localStorage.setItem("prompt", prompt);
    window.location.replace(window.location.href + "PollingStation");
  };

  return (
    <Router>
      <Navbar collapseOnSelect expand='lg' bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href='/'>
            <img src={voteUpLogo} style={{ maxWidth: "15vmin" }}></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='mx-auto'></Nav>
            <Nav>
              <Nav.Link href='/' >Home</Nav.Link>
              {isAdmin() ? (<Nav.Link href='/NewPoll'>New Poll</Nav.Link>) : null}
              {window.accountId !== "" ? (
                <><NavDropdown title={window.accountId}>
                  <Nav.Link onClick={logout} className="black-text">Logout</Nav.Link>
                </NavDropdown></>
              ) : <Nav.Link onClick={login}>Login</Nav.Link>}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Switch>
        <Route exact path='/'>
          <Home changeCandidates={changeCandidatesFunction} />
        </Route>
        <Route exact path='/PollingStation'>
          <PollingStation />
        </Route>
        <Route exact path='/NewPoll'>
          <NewPoll />
        </Route>
      </Switch>
    </Router>
  );
}
