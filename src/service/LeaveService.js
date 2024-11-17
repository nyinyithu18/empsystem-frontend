import { api } from "../api/ApiResources";

export const leaveDataPost = (leaveDate) =>{
    return api.post("/addLeave", leaveDate);
}

export const leaveEditData = (data) => {
    return api.put('/editLeave', data)
}

export const leaveList = () =>{
    return api.get('/leaveList')
}

export const searchByLeaveId = (leave_id) => {
    return api.get(`/searchByLeaveId?leave_id=${leave_id}`)
}


