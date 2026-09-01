import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import CaseForm from "../../modules/cases/CaseForm";

import {
  createCase,
  getAssignees,
  getSystems,
} from "../../API/cases.api";


const CreateCaseModal = ({
                           isOpen,
                           onClose,
                           onSuccess,
                         }) => {

  const toast = useToast();

  const [submitting, setSubmitting] =
      useState(false);

  const [systems, setSystems] =
      useState([]);

  const [assignees, setAssignees] =
      useState([]);

  const [loadingSystems, setLoadingSystems] =
      useState(false);

  const [loadingAssignees, setLoadingAssignees] =
      useState(false);


  // =========================================================
  // LOAD SYSTEMS
  // =========================================================

  const loadSystems = useCallback(
      async () => {

        setLoadingSystems(true);

        try {

          const data =
              await getSystems();

          setSystems(
              Array.isArray(data)
                  ? data
                  : []
          );

        } catch (err) {

          console.error(
              "Failed to load systems:",
              err
          );

          setSystems([]);

          toast({
            title: "Failed to load systems",
            description:
                err.response?.data?.message ||
                "Unable to load support systems.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });

        } finally {

          setLoadingSystems(false);

        }

      },
      [toast]
  );


  // =========================================================
  // LOAD ASSIGNEES
  // =========================================================

  const loadAssignees = useCallback(
      async () => {

        setLoadingAssignees(true);

        try {

          const data =
              await getAssignees();

          setAssignees(
              Array.isArray(data)
                  ? data
                  : []
          );

        } catch (err) {

          console.error(
              "Failed to load assignees:",
              err
          );

          setAssignees([]);

          toast({
            title: "Failed to load assignees",
            description:
                err.response?.data?.message ||
                "Unable to load available assignees.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });

        } finally {

          setLoadingAssignees(false);

        }

      },
      [toast]
  );


  // =========================================================
  // LOAD DATA WHEN MODAL OPENS
  // =========================================================

  useEffect(() => {

    if (!isOpen) {
      return;
    }

    loadSystems();
    loadAssignees();

  }, [
    isOpen,
    loadSystems,
    loadAssignees,
  ]);


  // =========================================================
  // CREATE CASE
  // =========================================================

  const handleSubmit = async (
      values
  ) => {

    setSubmitting(true);

    try {

      await createCase(values);

      toast({
        title: "Case created",
        description:
            "The case has been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onSuccess?.();

      onClose();

    } catch (err) {

      console.error(
          "Failed to create case:",
          err
      );

      toast({
        title: "Failed to create case",
        description:
            err.response?.data?.message ||
            "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });

    } finally {

      setSubmitting(false);

    }
  };


  return (

      <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="2xl"
          scrollBehavior="inside"
      >

        <ModalOverlay />

        <ModalContent>

          <ModalHeader>

            <Stack spacing={1}>

              <Text
                  fontWeight="700"
                  fontSize="lg"
              >
                Create Case
              </Text>

              <Text
                  fontSize="sm"
                  color="text.muted"
                  fontWeight="400"
              >
                Capture a new support case with
                structured details.
              </Text>

            </Stack>

          </ModalHeader>

          <ModalCloseButton />

          <ModalBody pb={6}>

            <CaseForm
                initialValues={{
                  summary: "",
                  description: "",
                  supportSystemId: "",
                  priority: "Medium",
                  status: "IN_PROGRESS",
                  assignedToId: "",
                }}

                systems={systems}

                assignees={assignees}

                isLoadingSystems={
                  loadingSystems
                }

                isLoadingAssignees={
                  loadingAssignees
                }

                onSubmit={handleSubmit}

                submitLabel="Create Case"

                isSubmitting={submitting}
            />

          </ModalBody>

        </ModalContent>

      </Modal>
  );
};


export default CreateCaseModal;