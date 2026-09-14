import api from "../services/axios";

const FILES_PATH = "/files";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.files)) return data.files;
  return [];
};

export const getJobFiles = async (jobId) => {
  const res = await api.get(`${FILES_PATH}/job/${jobId}`);
  return unwrapList(res.data);
};

export const uploadFile = async (file, { jobId } = {}) => {
  const formData = new FormData();
  formData.append("file", file, file.name);
  if (jobId != null && jobId !== "") {
    formData.append("jobId", String(jobId));
  }
  const res = await api.post(FILES_PATH, formData);
  return res.data;
};

export const downloadFile = async (fileId) => {
  const res = await api.get(`${FILES_PATH}/${fileId}`, {
    responseType: "blob",
  });
  return res;
};

export const deleteFile = async (fileId) => {
  await api.delete(`${FILES_PATH}/${fileId}`);
};
