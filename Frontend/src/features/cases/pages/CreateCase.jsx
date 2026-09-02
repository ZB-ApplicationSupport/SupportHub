import React from "react";
import { useNavigate } from "react-router-dom";

import CreateCaseModal from "../components/CreateCaseModal";


const CreateCase = () => {

  const navigate =
      useNavigate();


  const handleClose = () => {
    navigate("/cases");
  };


  const handleSuccess = () => {
    navigate("/cases");
  };


  return (

      <CreateCaseModal
          isOpen
          onClose={handleClose}
          onSuccess={handleSuccess}
      />

  );
};


export default CreateCase;