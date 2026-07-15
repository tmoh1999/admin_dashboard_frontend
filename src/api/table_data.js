import { request } from "./http";
import { useNavigate } from "react-router-dom";
export const api = {
    users: {
        add: addUser,
        update: updateUser,
        remove: removeUser,
        rootpath:"/api/users",
        actions:[
          {label:"View/Edit",path:"/user/profile",keys:["id"],color:"bg-green-400 hover:bg-green-500"},
        ],
    },
};
export const columns= {
    users:[
        { label: "ID", accessor: "id",edit:false },
        { label: "Username", accessor: "username",edit:true },
        { label: "Email", accessor: "email",edit:true },
        { label: "IsEmailVerified", accessor: "is_email_verified",edit:false },
        { label: "Role", accessor: "role",edit:true },
        { label: "IsActive", accessor: "is_active",edit:true },
        { label: "Created At", accessor: "created_at",edit:false },
    ],
};

export function updateUser(rowData) {
  const  path=api.users.rootpath+"/"+rowData.id;  
  return request(path, {
    method: "PUT",
    body: JSON.stringify(rowData),
  });
}

export function addUser(rowData) {
  return request(api.users.rootpath, {
    method: "POST",
    body: JSON.stringify(rowData),
  });
}
export function removeUser(path) {
  return request(path, {
    method: "DELETE",
  });
}