import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditCaseModal from "../../components/modals/EditCaseModal";
import { cases } from "../../data/cases";

const EditCase = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const currentCase = cases.find((item) => item.id === caseId) || cases[0];

  return (
    <EditCaseModal
      isOpen
      onClose={() => navigate("/cases")}
      item={currentCase}
    />
  );
};

export default EditCase;
