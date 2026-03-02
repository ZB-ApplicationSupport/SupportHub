import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Text } from "@chakra-ui/react";
import EditCaseModal from "../../components/modals/EditCaseModal";
import { getCaseById } from "../../API/cases.api";

const EditCase = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [currentCase, setCurrentCase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }
    getCaseById(caseId)
      .then(setCurrentCase)
      .catch(() => setCurrentCase(null))
      .finally(() => setLoading(false));
  }, [caseId]);

  if (loading) return <Spinner size="lg" />;
  if (!currentCase) return <Text>Case not found.</Text>;

  return (
    <EditCaseModal
      isOpen
      onClose={() => navigate("/cases")}
      item={currentCase}
      onSuccess={() => navigate("/cases")}
    />
  );
};

export default EditCase;
