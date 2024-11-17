import React from "react";

const EmpTablePagination = ({ postPerPage, totalPost, paginate }) => {
  const pageNumbers = Math.ceil(totalPost / postPerPage);

  return (
      <nav className="mt-4">
        <ul className="flex justify-row justify-center">
          {Array.from({ length: pageNumbers }).map((_, index) => (
            <li
              key={index}
              className='m-1'
            >
              <a
                href="#"
                className="px-3 py-2 bg-slate-200 hover:bg-slate-500 hover:text-white hover:rounded"
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
  );
};

export default EmpTablePagination;
