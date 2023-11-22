import React from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import _ from "lodash";

const AddFriendModal = ({ handleClose = () => {} }) => {
  const onSearch = _.debounce((searchText = "") => {
    console.log(searchText);
  }, 500);

  return (
    <>
      <Modal show style={{ marginTop: "50px" }} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Friends</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="friends-search-input"
            placeholder="Search your friends by username"
            onChange={e => onSearch(e.target.value)}
          />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

AddFriendModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
};

export default AddFriendModal;
