import { Button, Select, Table, TextInput } from "flowbite-react";
import React, { useState } from "react";

const LeaveTableData = () => {
  const [leaveEntries, setLeaveEntries] = useState([
    {
      leave_type: "",
      from_date: "",
      to_date: "",
      days: "",
    },
  ]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = [...leaveEntries];
    updatedEntries[index][name] = value;

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

  const handleLeaveTypeChange = (index, value) => {
    const updatedEntries = [...leaveEntries];
    updatedEntries[index]["leave_type"] = value;
    setLeaveEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    setLeaveEntries([
      ...leaveEntries,
      {
        leave_type: "",
        from_date: "",
        to_date: "",
        days: "",
      },
    ]);
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = [...leaveEntries];
    updatedEntries.splice(index, 1);
    setLeaveEntries(updatedEntries);
  };

  const leaveTypeDatas = [
    { value: "Medical Leave", text: "Medical Leave" },
    { value: "Casual Leave", text: "Casual Leave" },
    { value: "Annual Leave", text: "Annual Leave" },
    { value: "Earned Leave", text: "Earned Leave" },
  ];

  const handleSave = () => {
    console.log(leaveEntries);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Leave Type</Table.HeadCell>
            <Table.HeadCell>From Date</Table.HeadCell>
            <Table.HeadCell>To Date</Table.HeadCell>
            <Table.HeadCell>Days</Table.HeadCell>
            <Table.HeadCell>
              <Button
                type="button"
                onClick={handleAddEntry}
                className="btn bg-blue-500"
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
                    className="btn bg-red-500"
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
      <Button type="button" onClick={() => handleSave()}>
        Save
      </Button>
    </>
  );
};

export default LeaveTableData;
