import { Tab } from "bootstrap";
import React, { useEffect, useState } from "react";
import { Table, Container, Button, Spinner } from "react-bootstrap";
import { isAdmin } from "../utils";

const Home = (props) => {
  const [promptList, changePromptList] = useState([]);

  const [submitSpinner, setSubmitSpinner] = useState(null);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    const getPrompts = async () => {
      changePromptList(await window.contract.getAllPrompts());
    }
    getPrompts();
  }, []);

  return (
    <Container>
      <Table style={{ marginTop: "5vh" }} striped bordered hover>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>List of Polls</th>
            <th>Go to Poll</th>
            {isAdmin() ? (
              <th>End Poll</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {promptList.map((el, index) => {
            return (
              <tr key={index}>
                {/* Serial Number */}
                <td>{index + 1}</td>

                {/* Promt */}
                <td>{el}</td>

                {/* Button */}
                <td>
                  {" "}
                  <Button onClick={() => props.changeCandidates(el)} style={{ width: "100%" }}>
                    Go to Poll
                  </Button>
                </td>

                {isAdmin() ? (
                  <td>
                    {" "}
                    <Button variant='danger' disabled={disableButton} onClick={async () => {
                      setDisableButton(true);
                      setSubmitSpinner(index);
                      await window.contract.removeFromPromptArray({ prompt: el });
                      changePromptList(await window.contract.getAllPrompts())
                      setSubmitSpinner(null);
                      setDisableButton(false);
                    }}
                      style={{ width: "100%" }}
                    >
                      Delete Poll
                      {submitSpinner === index ?
                        <Spinner
                          style={{ marginLeft: "10px" }}
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> : null}
                    </Button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;
