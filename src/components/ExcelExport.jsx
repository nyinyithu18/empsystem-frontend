import React from "react";
import { Button } from "flowbite-react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExcelExport = ({ excelData, fileName }) => {
  const chunkSize = 1000;
  const totalRows = excelData.length;

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = () => {
    let start = 0;
    let end = Math.min(chunkSize, totalRows);

    while (start < totalRows) {
      const chunk = excelData.slice(start, end);

      // Truncate long text in cells to fit within the limit
      const truncatedChunk = chunk.map((row) => {
        Object.keys(row).forEach((key) => {
          if (typeof row[key] === "string" && row[key].length > 32767) {
            row[key] = row[key].substring(0, 32767);
          }
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(truncatedChunk);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      const chunkFileName = `${fileName}_${start + 1}-${end}${fileExtension}`;
      FileSaver.saveAs(data, chunkFileName);

      start = end;
      end = Math.min(start + chunkSize, totalRows);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={exportToExcel}
      className="cursor-pointer btn bg-blue-500"
    >
      Export
    </Button>
  );
};

export default ExcelExport;
