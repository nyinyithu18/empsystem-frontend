import { api } from "../api/ApiResources"

export const rankList = () =>{
    return api.get('/rankList')
}