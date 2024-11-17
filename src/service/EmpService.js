import { api } from "../api/ApiResources";

// Employee
export const empDataPost = (empData) =>{
    return api.post("/addEmp", empData);
}

export const searchByEmpId = (emp_id) => {
    return api.get(`/searchEmpId?emp_id=${emp_id}`)
}

export const editEmployeeData = (data) =>{
    return api.put('/editEmp', data)
}

export const editEmployeeImageData = (data) =>{
    return api.put('/editEmpImage', data)
}

// upload excel file
export const uploadExcelFile = (file) =>{
    return api.post('/uploadFile', file);
}

// Interests
export const empInterestsDataPost = (interestData) =>{
    return api.post("/addEmpInterests", interestData);
}

export const editEmpInterestsData = (interestData) =>{
    return api.put('editEmpInterest', interestData);
}