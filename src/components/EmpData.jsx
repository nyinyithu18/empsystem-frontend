import React, { useEffect, useRef, useState } from "react";
import {
  Label,
  TextInput,
  Select,
  Textarea,
  Button,
  Table,
  Checkbox,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { api } from "../api/ApiResources";
import { empInterestsDataPost } from "../service/EmpService";
import { leaveDataPost } from "../service/LeaveService";
import axios from "axios";

const EmpData = () => {
  // For Rank , Department and EmpInterests Fetch
  const [rankData, setRankData] = useState([]);
  const [depData, setDepData] = useState([]);

  // For Employee Data Form
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [nrc, setNrc] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [rankdata, setRank] = useState("");
  const [dep, setDep] = useState("");
  const [address, setAddress] = useState("");

  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // For Emp image upload
  const inputRef = useRef(null);
  const [image, setImages] = useState("");

  // For Validation
  const [empIdError, setEmpIDError] = useState("");
  const [nameError, setNameError] = useState("");
  const [nrcError, setNrcError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // For Leave Form
  const [leaveEntries, setLeaveEntries] = useState([]);

  // Emp Id validation
  const handleEmpIdChange = (event) => {
    const { value } = event.target;
    setEmpId(value);
    if (!value.trim()) {
      setEmpIDError("EmpId is required");
    } else {
      setEmpIDError(""); // Clear error if validation passes
    }
  };

  // Name validation
  const handleNameChange = (event) => {
    const { value } = event.target;
    setEmpName(value);
    if (!value.trim()) {
      setNameError("EmpName is required");
    } else {
      setNameError("");
    }
  };

  // Email Validation
  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
    if (!value.trim()) {
      setEmailError("Email is required");
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError(""); // Clear error if validation passes
    }
  };

  // NRC validation
  const handleNrcChange = (event) => {
    const { value } = event.target;
    setNrc(value);
    if (!value.trim()) {
      setNrcError("NRC is required");
    } else if (
      !/^[0-9]{1,14}\/[a-zA-Z]{2}[a-zA-Z]{2}[a-zA-Z]{2}\([NTRD]\)[0-9]{6}$/.test(
        value
      )
    ) {
      setNrcError("Invalid NRC format");
    } else {
      setNrcError(""); // Clear error if validation passes
    }
  };

  // Phone Validation
  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setPhone(value);
    if (!value.trim()) {
      setPhoneError("Phone number is required");
    } else if (!/^(\+?95[\-\s]?)?((?!0)[0-9]{1,9})$/.test(value)) {
      setPhoneError("Invalid phone number");
    } else {
      setPhoneError(""); // Clear error if validation passes
    }
  };

  // Emp Data and Leave Data Post
  const EmpDataPost = async () => {
    if (!empId || !empName || !nrc || !phone || !email) {
      // If any required field is empty, set error messages
      setEmpIDError(!empId ? "EmpId is required" : "");
      setNameError(!empName ? "EmpName is required" : "");
      setNrcError(!nrc ? "NRC is required" : "");
      setPhoneError(!phone ? "Phone number is required" : "");
      setEmailError(!email ? "Email is required" : "");
      return; // Stop submission if validation fails
    }

    {
      const formData = new FormData();
      formData.append("emp_id", empId);
      formData.append("emp_name", empName);
      formData.append("nrc", nrc);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("dob", dob);
      formData.append("rank", rankdata);
      formData.append("dep", dep);
      formData.append("address", address);
      formData.append("checkdelete", false);
      formData.append("image", image);

      try {
        // post emp data
        const response = await axios.post(
          "http://localhost:8080/addEmp",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        //console.log("Response:", response);
        alert("Employee Data saved successfully");
      } catch (error) {
        console.log("Error posting emp data: ", error);
      }

      for (const entry of leaveEntries) {
        const postLeaveData = {
          emp_id: empId,
          leave_type: entry.leave_type,
          from_date: entry.from_date,
          to_date: entry.to_date,
          days: entry.days,
        };

        // post leave data
        const leaveResponse = await leaveDataPost(postLeaveData);
        //console.log("leave successfully",leaveResponse);
      }

      for (const empInterest of selectedInterests) {
        const postEmpInterest = {
          emp_id: empId,
          interest_id: empInterest,
        };

        // post interests data
        const interestRes = await empInterestsDataPost(postEmpInterest);
        //console.log("Interests Data Successfully", interestRes);
        //console.log(postEmpInterest);
      }

      setEmpId("");
      setEmpName("");
      setNrc("");
      setPhone("");
      setEmail("");
      setDob("");
      setRank("");
      setDep("");
      setAddress("");
      setImages("");
      setLeaveEntries([]);
      setSelectedInterests([]);

      window.location.reload();
    }
  };

  // Fetch Rank and Department
  useEffect(() => {
    const fetchData = async () => {
      const rankResponse = await api.get("/rankList");
      setRankData(rankResponse.data);

      const depResponse = await api.get("/depList");
      setDepData(depResponse.data);

      const interestRes = await api.get("/interestList");
      setInterests(interestRes.data);
    };
    fetchData();
  }, []);

  // Handle Leave Input
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = [...leaveEntries];
    updatedEntries[index][name] = value !== undefined ? value : "";

    if (name === "from_date" || name === "to_date") {
      const startDate = new Date(updatedEntries[index].from_date);
      const endDate = new Date(updatedEntries[index].to_date);

      // Check if both dates are valid
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = Math.ceil(
          differenceInTime / (1000 * 3600 * 24)
        );
        updatedEntries[index]["days"] = differenceInDays;
      } else {
        // If either date is invalid, set days to empty string or handle the error accordingly
        updatedEntries[index]["days"] = "";
      }
    }

    setLeaveEntries(updatedEntries);
  };

  // Filter the EmpId
  useEffect(() => {
    setLeaveEntries((prevEntries) => {
      return prevEntries.map((entry) => {
        return { ...entry, emp_id: empId !== undefined ? empId : "" };
      });
    });
  }, [empId]);

  const handleLeaveTypeChange = (index, value) => {
    const updatedEntries = [...leaveEntries];
    updatedEntries[index]["leave_type"] = value;
    setLeaveEntries(updatedEntries);
  };

  // Add Leave Form
  const handleAddEntry = () => {
    setLeaveEntries([
      ...leaveEntries,
      {
        emp_id: empId,
        leave_type: "",
        from_date: "",
        to_date: "",
        days: "",
      },
    ]);
  };

  // Remove Leave Form
  const handleRemoveEntry = (index) => {
    const updatedEntries = [...leaveEntries];
    updatedEntries.splice(index, 1);
    setLeaveEntries(updatedEntries);
  };

  // Leave Types
  const leaveTypeDatas = [
    { value: "Medical Leave", text: "Medical Leave" },
    { value: "Casual Leave", text: "Casual Leave" },
    { value: "Annual Leave", text: "Annual Leave" },
    { value: "Earned Leave", text: "Earned Leave" },
  ];

  const handleInterestChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedInterests([...selectedInterests, value]);
    } else {
      setSelectedInterests(
        selectedInterests.filter((interest) => interest !== value)
      );
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const onImageChange = (event) => {
    setImages(event.target.files[0]);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="lg:flex lg:justify-around lg:w-full">
          <div className="flex justify-center justify-items-center mt-3 lg:mt-12 lg:pt-4">
            <div>
              <div onClick={handleImageClick} className="cursor-pointer w-56">
                {image ? (
                  <img
                    className="rounded-full h-56 w-56 object-cover"
                    src={URL.createObjectURL(image)}
                    alt=""
                  />
                ) : (
                  <img src="./photo/image-upload.png" alt="" />
                )}
                <input
                  type="file"
                  ref={inputRef}
                  onChange={onImageChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className="flex justify-center"></div>
            </div>
          </div>

          <div className="flex max-w-md mt-3 flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="id">
                  Emp ID<span className="ms-1 text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                id="id"
                value={empId}
                onChange={handleEmpIdChange}
                type="number"
                sizing="md"
                className="w-96"
              />
              {empIdError && <div className="text-red-500">{empIdError}</div>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name">
                  Name<span className="ms-1 text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                id="name"
                value={empName}
                onChange={handleNameChange}
                type="text"
                sizing="md"
                className="w-96"
              />
              {nameError && <div className="text-red-500">{nameError}</div>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nrc">
                  NRC <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                id="nrc"
                value={nrc}
                onChange={handleNrcChange}
                type="text"
                sizing="md"
                className="w-96"
              />
              {nrcError && <div className="text-red-500">{nrcError}</div>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                type="text"
                sizing="md"
                className="w-96"
              />
              {phoneError && <div className="text-red-500">{phoneError}</div>}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                id="email"
                value={email}
                onChange={handleEmailChange}
                type="text"
                sizing="md"
                className="w-96"
              />
              {emailError && <div className="text-red-500">{emailError}</div>}
            </div>
          </div>
          <div></div>
          <div className="flex max-w-md flex-col mt-3 gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="dob" value="Date Of Birth" />
              </div>
              <TextInput
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                type="date"
                sizing="md"
                max={new Date().toISOString().split("T")[0]}
                className="w-96"
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="rank">Rank</Label>
              </div>
              <Select
                id="rank"
                required
                onChange={(e) => setRank(e.target.value)}
                className="w-96"
              >
                {rankData.length > 0 ? (
                  rankData.map((rank) => {
                    return (
                      <option value={rank.rank_name} key={rank.rank_id}>
                        {rank.rank_name}
                      </option>
                    );
                  })
                ) : (
                  <option>No Data</option>
                )}
              </Select>
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="dep" value="Department" />
              </div>
              <Select
                id="dep"
                required
                onChange={(e) => setDep(e.target.value)}
                className="w-96"
              >
                {depData.length > 0 ? (
                  depData.map((department) => {
                    return (
                      <option
                        value={department.dep_name}
                        key={department.dep_id}
                      >
                        {department.dep_name}
                      </option>
                    );
                  })
                ) : (
                  <option>No Data</option>
                )}
              </Select>
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="address" value="Address" />
              </div>
              <Textarea
                id="address"
                placeholder="Address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={2}
              />
            </div>
            <div className="max-w-md">
              <div className="mb-2 mt-2 block">
                <Label
                  className="font-medium text-lg"
                  htmlFor="interests"
                  value="Interests"
                />
              </div>
              <div className="grid grid-rows-2 grid-flow-col">
                {interests.map((interest) => (
                  <div
                    key={interest.interest_id}
                    className="flex items-center gap-2 mb-2"
                  >
                    <Label
                      htmlFor={`interest_${interest.interest_id}`}
                      value={interest.interest_name}
                    />
                    <Checkbox
                      typeof="checkbox"
                      id={`interest_${interest.interest_id}`}
                      name={`interest_${interest.interest_id}`}
                      value={interest.interest_id}
                      onChange={handleInterestChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 mb-2 flex justify-center lg:justify-around">
        <h1 className="text-xl ms-2 font-bold">Leave List</h1>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="overflow-x-auto lg:px-12 lg:mx-12">
        <div className="lg:mx-8">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>No.</Table.HeadCell>
              <Table.HeadCell>Leave Type</Table.HeadCell>
              <Table.HeadCell>From Date</Table.HeadCell>
              <Table.HeadCell>To Date</Table.HeadCell>
              <Table.HeadCell>Days</Table.HeadCell>
              <Table.HeadCell>
                <Button
                  type="button"
                  onClick={handleAddEntry}
                  className="btn bg-blue-500 w-20"
                >
                  Add
                </Button>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {leaveEntries.map((entry, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>
                    <Select
                      id={`leave_type_${index}`}
                      value={entry.leave_type}
                      onChange={(e) =>
                        handleLeaveTypeChange(index, e.target.value)
                      }
                      required
                    >
                      {leaveTypeDatas.map((leave, index) => (
                        <option key={index} value={leave.value}>
                          {leave.text}
                        </option>
                      ))}
                    </Select>
                  </Table.Cell>
                  <Table.Cell>
                    <TextInput
                      type="date"
                      id={`from_date_${index}`}
                      name="from_date"
                      value={entry.from_date}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextInput
                      type="date"
                      id={`to_date_${index}`}
                      name="to_date"
                      value={entry.to_date}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <TextInput
                      type="text"
                      id={`days_${index}`}
                      name="days"
                      value={entry.days}
                      readOnly // Make it read-only
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      type="button"
                      className="btn bg-red-500 w-20"
                      onClick={() => handleRemoveEntry(index)}
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <div className="mt-3 mb-3 flex justify-around">
        <span></span>
        <span></span>
        <span></span>
        <div className="flex flex-row gap-4">
          <Button
            type="button"
            onClick={() => EmpDataPost()}
            className="btn bg-blue-500 w-20"
          >
            Save
          </Button>
          <Link to="/empList">
            <Button className="btn bg-blue-500 w-20">List</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default EmpData;
