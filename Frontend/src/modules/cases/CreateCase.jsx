import React from "react";
import { useNavigate } from "react-router-dom";
import CreateCaseModal from "../../components/modals/CreateCaseModal";

const CreateCase = () => {
  const navigate = useNavigate();

  return (
    <CreateCaseModal isOpen onClose={() => navigate("/cases")} />
  );
};

export default CreateCase;
