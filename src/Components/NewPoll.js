import React, { useEffect, useRef, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { isAdmin } from "../utils";
import candidateImage from "../assets/candidate.png";

const NewPoll = (props) => {
  const candidateName1 = useRef();
  const candidateName2 = useRef();

  const candidateName1URL = useRef();
  const candidateName2URL = useRef();

  const promptRef = useRef();
  const dateRef = useRef();
  const timeRef = useRef();

  const [disableButton, changeDisable] = useState(false);

  const [submitSpinner, setSubmitSpinner] = useState(false);

  const sendToBlockChain = async () => {

    if (!isAdmin()) {
      alert("You are not an admin!");
      window.location = "/";
      return;
    }

    if(!candidateName1.current.value || !candidateName2.current.value || !promptRef.current.value || !dateRef.current.value || !timeRef.current.value){
      alert("Please fill all the required fields!");
      return;
    }
        // It enables the spin to show
    setSubmitSpinner(true);
    // Disabling the submit button
    changeDisable(true);
    if(!candidateName1URL.current.value){
      candidateName1URL.current.value = candidateImage;
    }
    if(!candidateName2URL.current.value){
      candidateName2URL.current.value = candidateImage;
    }

    // Add candidates
    await window.contract.addUrl({
      name: candidateName1.current.value,
      url: candidateName1URL.current.value,
    });

    await window.contract.addUrl({
      name: candidateName2.current.value,
      url: candidateName2URL.current.value,
    });

    // Add Poll
    await window.contract.addCandidatePair({
      prompt: promptRef.current.value,
      name1: candidateName1.current.value,
      name2: candidateName2.current.value,
    });

    await window.contract.addDate({
      prompt: promptRef.current.value,
      date: dateRef.current.value + " " + timeRef.current.value,
    })

    await window.contract.addToPromptArray({ prompt: promptRef.current.value });
    setSubmitSpinner(false);
    alert("Poll is added");
    window.location = "/";
  };

  return (
    <Container style={{ marginTop: "10px" }}>
      <Form>
        <div style={{ textAlign: 'center', fontSize:"18px"}}>Candidate 1</div>
        <Form.Group className='mb-3'>
          <Form.Label>Name <span style={{color:"red"}}>*</span></Form.Label>
          <Form.Control
            ref={candidateName1}
            placeholder='Enter Candidate Name'
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Image Link</Form.Label>
          <Form.Control
            ref={candidateName1URL}
            placeholder='Enter Image URL'
            required
          ></Form.Control>
        </Form.Group>

        <div style={{ textAlign: 'center', fontSize:"18px"}}>Candidate 2</div>
        <Form.Group className='mb-3'>
          <Form.Label>Name <span style={{color:"red"}}>*</span></Form.Label>
          <Form.Control
            ref={candidateName2}
            placeholder='Enter Candidate Name'
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Image Link</Form.Label>
          <Form.Control
            ref={candidateName2URL}
            placeholder='Enter Image URL'
            required
          ></Form.Control>
        </Form.Group>

        <div style={{ textAlign: 'center', fontSize:"18px"}}>Poll Details</div>
        <Form.Group className='mb-3'>
          <Form.Label>Poll Name <span style={{color:"red"}}>*</span></Form.Label>
          <Form.Control ref={promptRef} placeholder='Add Prompt' required></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>End Date and Time <span style={{color:"red"}}>*</span></Form.Label>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <Form.Control ref={dateRef} type="date" placeholder='End Date' className="col-4" style={{flexShrink:"1"}}>
            </Form.Control>
            <Form.Control ref={timeRef} type="time" placeholder='End Time' className="col-4" style={{flexShrink:"1"}}>
            </Form.Control>
          </div>
        </Form.Group>
      </Form>
      <Button
        disabled={disableButton}
        onClick={sendToBlockChain}
        variant='primary'
        type="submit"
        style={{ marginBottom: "15px" }}
      >
        Submit
        {submitSpinner ? <Spinner
          style={{ marginLeft: "10px" }}
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        /> : null}
      </Button>
    </Container>
  );
};

export default NewPoll;
