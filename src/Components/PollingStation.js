import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import candidateImage from "../assets/candidate.png";
import { isAdmin } from "../utils";
import CountdownTimer from "./CountdownTimer"

const getTwoDigitNumber = (number) => number < 10 ? `0${number}` : number;
const showDate = (date) => {
  let dateObj = new Date(date);
  let month = getTwoDigitNumber(dateObj.getUTCMonth() + 1); //months from 1-12
  let day = getTwoDigitNumber(dateObj.getUTCDate());
  let year = dateObj.getUTCFullYear();
  let hour = getTwoDigitNumber(dateObj.getUTCHours());
  let minute = getTwoDigitNumber(dateObj.getUTCMinutes());
  let dateString  = `${day}/${month}/${year}   ${hour}:${minute}`;
  return (
    <h3>{dateString}</h3>
  );
};

const PollingStation = () => {
  const [candidate1URL, changeCandidate1Url] = useState(candidateImage);
  const [candidate2URL, changeCandidate2Url] = useState(candidateImage);
  const [buttonStatus, changeButtonStatus] = useState(false);
  const [candidate1Votes, changeVote1] = useState("--");
  const [candidate2Votes, changeVote2] = useState("--");
  const [prompt, changePrompt] = useState("--");
  const [remainingTime, setRemainingTime] = useState(0);
  const [submitSpinner, setSubmitSpinner] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  function isTimerEnd(actualDate){
    return new Date(actualDate).getTime() <= new Date().getTime()
  }
  const columnComponent = (candidateURL, voteIndex) => {
    return (
      <Col className='jutify-content-center d-flex'>
        <Container>
          <Row style={{ marginTop: "5vh", backgroundColor: "#c4c4c4", borderRadius:"5px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2vmin",
              }}
            >
              <img
                style={{
                  height: "25vmin",
                  width: "25vmin",
                }}
                src={candidateURL}
              ></img>
            </div>
          </Row>
          <Row
            style={{ marginTop: "3vh", textAlign: "center", textTransform: "capitalize" }}
            className='justify-content-center d-flex'
          >
            <h2>{localStorage.getItem("Candidate"+(voteIndex+1))}</h2>
          </Row>
          {isAdmin() ? (
            <Row
              className='justify-content-center d-flex'
              style={{ marginTop: "5vh" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "8vw",
                  padding: "10px",
                  backgroundColor: (Math.max(candidate1Votes,candidate2Votes))==((voteIndex == 0)?candidate1Votes:candidate2Votes)?"#a4dea6":"#ffc0cb",
                  borderRadius: "10px",
                }}
              >
                {(voteIndex == 0)?candidate1Votes:candidate2Votes}
                {(Math.max(candidate1Votes,candidate2Votes))==((voteIndex == 0)?candidate1Votes:candidate2Votes)?(<h2 style={{color:"green"}}>↑</h2>):(<h2 style={{color:"red"}}>↓</h2>)}
              </div>
            </Row>
          ) : null}
          {!isAdmin() ? (<Row
            style={{ marginTop: "5vh" }}
            className='justify-content-center d-flex'
          >
            <Button disabled={buttonStatus} onClick={() => addVote(voteIndex)}>
              Vote
              {submitSpinner === voteIndex ? <Spinner
                style={{ marginLeft: "10px" }}
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />:null}
            </Button></Row>) : null}

        </Container>
      </Col>
    );
  }
  useEffect(async () => {
    // vote count stuff
    let voteCount = await window.contract.getVotes({
      prompt: localStorage.getItem("prompt"),
    });
    changeVote1(voteCount[0]);
    changeVote2(voteCount[1]);

    // image stuff
    let timeLeft = await window.contract.getDateOfPoll({
      prompt: localStorage.getItem("prompt")
    });
    setRemainingTime(timeLeft);
    changeCandidate1Url(
      await window.contract.getUrl({
        name: localStorage.getItem("Candidate1"),
      })
    );
    changeCandidate2Url(
      await window.contract.getUrl({
        name: localStorage.getItem("Candidate2"),
      })
    );

    changePrompt(localStorage.getItem("prompt"));

    // vote checking stuff
    let didUserVote = await window.contract.didParticipate({
      prompt: localStorage.getItem("prompt"),
      user: window.accountId,
    });
    changeButtonStatus(didUserVote || isTimerEnd(timeLeft)); // if user voted or timer ended
    setShow(didUserVote);
  }, []);

  const addVote = async (index) => {
    setSubmitSpinner(index);
    changeButtonStatus(true);
    await window.contract.addVote({
      prompt: localStorage.getItem("prompt"),
      index: index,
    });

    await window.contract.recordUser({
      prompt: localStorage.getItem("prompt"),
      user: window.accountId,
    });

    setSubmitSpinner(null);
    alert("Vote added");
    window.location = "/";
  };

  return (
    <Container>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have already voted!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        {columnComponent(candidate1URL, 0)}
        <Col className='justify-content-center d-flex align-items-center'>
          <div
            style={{
              display: "flex",
              flexFlow: "column nowrap",
              gap: "10px",
              justifyContent: "center",
              backgroundColor: "#c4c4c4",
              alignItems: "center",
              padding: "2vw",
              textAlign: "center",
              borderRadius: "15px",
              textTransform: "capitalize",
              fontWeight: "bold",
              marginTop: "5vh",
              width: "100%",
              height: "calc(100% - 5vh)",
            }}
          >
            <h1>{prompt}</h1>
            <h4>End Date</h4>
            {showDate(remainingTime)}
            {!isTimerEnd() ? (<CountdownTimer targetDate={remainingTime} />):(<h3 style={{"color":"red"}}>Voting has ended!</h3>)}
          </div>
        </Col>
        {columnComponent(candidate2URL,1)}
      </Row>
    </Container>
  );
};

export default PollingStation;
