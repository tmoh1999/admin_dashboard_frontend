import { useLocation } from "react-router-dom";
import { apiGet} from "../api";
import { useEffect, useState } from "react";
import NoDataFound from "../components/NoDataFound";
export default function UserProfile(){
const {state}=useLocation();
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [userData,setUserData]=useState({
    "id":null,
    "username":"",
    "email":"",
});
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
                    <div className="flex flex-col w-2/5  rounded-lg shadow-lg bg-white p-2 mt-8 ml-8">
                        <div className="flex justify-start mb-3">
                            <h1 className="font-semibold text-2xl">Description Data:</h1>
                        </div>
                        <p className="text-lg"><span className="text-xl underline  mr-4">Username:</span>{userData.username}</p>
                        <p className="text-lg"><span className="text-xl underline mr-4">Email:</span>{userData.email}</p>
                    </div>
                </div>
            </>
        )
        }
    </div>
);
}