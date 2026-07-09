import { useLocation } from "react-router-dom";
import { apiGet } from "../api";
import { useEffect, useState } from "react";
import NoDataFound from "../components/NoDataFound";
import UserEditForm from "../components/UserEditForm";
export default function UserProfile(){
const {state}=useLocation();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [userData,setUserData]=useState({
    "id":null,
    "username":"",
    "email":"",
});
const [showEdit, setShowEdit] = useState(false);
useEffect(()=>{
    setError("");
    setLoading(true);
    apiGet("/api/users/me")
    .then(result => {     
        setUserData(prev => ({
            ...prev,
            id:result.id,
            username:result.username,
            email:result.email,
        }));
        
    }).catch(err => {
        setError(err.message);
    }).finally(()=>{
        setLoading(false);
    });
},[state]);
function handleEditToggle(){
    setShowEdit(v => !v);
}

function handleSaved(result){
    if(result){
        setUserData(prev => ({ ...prev, username: result.username, email: result.email }));
    }
    setShowEdit(false);
}
return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gray-100">
        {loading?(
        <div className="flex flex-col  h-screen justify-center items-center p-6 bg-gray-400">  
            <div className="w-3/4">
                <NoDataFound message="Loading..."/>
            </div>
        </div>        
        ):error?(
          <div className="flex flex-col  h-screen justify-center items-center p-6 bg-gray-400">  
            <div className="w-3/4">
                <NoDataFound message={error}/>
            </div>
          </div>
        ):(
            <>    
                <div className="flex justify-start">
                    <div className="flex flex-col w-60 sm:w-fit   rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                        <div className="flex items-center justify-start mb-3">
                            <h1 className="font-semibold text-2xl mr-4">Description Data:</h1>
                            <button onClick={handleEditToggle} className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                {showEdit? 'Close' : 'Edit User'}
                            </button>
                        </div>
                        {!showEdit ? (
                            <>
                                <p className="text-lg wrap-break-word"><span className="text-xl underline  mr-4">Username:</span>{userData.username}</p>
                                <p className="text-lg wrap-break-word"><span className="text-xl underline mr-4 ">Email:</span>{userData.email}</p>
                            </>
                        ) : (
                            <UserEditForm initialData={userData} onSaved={handleSaved} onCancel={() => setShowEdit(false)} />
                        )}
                    </div>
                </div>
            </>
        )
        }
    </div>
);
}