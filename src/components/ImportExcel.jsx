import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import axios from "axios";

const ImportExcel = ({fetchEmpData, fetchEmpLeaveData}) => {
  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Import Excel file
  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      if (file != null) {
        await axios.post("http://localhost:8080/uploadFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setOpenModal(false);
        fetchEmpData();
        fetchEmpLeaveData();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <Link to="/importExcelFile">
        <Button className="btn bg-blue-500" onClick={() => setOpenModal(true)}>Import</Button>
      </Link>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <div className="flex justify-between mx-6">
          <span className="text-xl pt-5 ms-1 font-medium text-gray-900 dark:text-white">
            Leave Form
          </span>
          <Link to="/empList">
            <Modal.Header className="w-12" />
          </Link>
        </div>
        <hr />
        <Modal.Body>
          <input
            className="border bg-slate-200 w-76 me-4 rounded-lg"
            type="file"
            onChange={handleFileChange}
          />
        </Modal.Body>
        <Modal.Footer className="flex justify-around">
          <Button type="button" className="btn bg-blue-500 w-20" onClick={handleFileUpload}>
            <Link to="/empList">Add</Link>
          </Button>

          <Button
            className="btn bg-red-500"
            onClick={() => setOpenModal(false)}
          >
            <Link to="/empList">Cancel</Link>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImportExcel;
