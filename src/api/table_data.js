export const api = {
    users: {
        add: null,
        update: null,
        remove: null,
        profilePath:"/user/profile",
        profileKeys:["id"],
        rootpath:"/api/users",
    },
};
export const columns= {
    users:[
        { label: "ID", accessor: "id",edit:false },
        { label: "Username", accessor: "username",edit:false },
        { label: "Email", accessor: "email",edit:false },
        { label: "Role", accessor: "role",edit:false },
    ],
};
