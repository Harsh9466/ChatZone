import React from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const AddFriendModal = ({ handleClose = () => {} }) => {
  return (
    <>
      <Modal show style={{ marginTop: "50px" }} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddFriendModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
};

export default AddFriendModal;
