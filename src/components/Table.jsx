import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import TableCell from "./TableCell"
import ConfirmMessage from "./confirmMessage"
import { downloadFile } from "../api";
import Pagination from "./Pagination";
import NoDataFound from "./NoDataFound";
export default function Table({ mode="view",data=[], columns=[] ,
  SelectName="Select",Edit=false,
  rootpath,refreshParent,loading=false,
  setSelectedRow,removeRow,saveRow,addRow,
  TableName,options={}
  ,setPage,pages=1,page=1,
  search, setSearch,
  sortColumn, setSortColumn,
  sortOrder, setSortOrder,
  actions=[]
  }) {
  const navigate=useNavigate();
  const [showConfirm,setShowConfirm]=useState(false);
  const [editingRow,setEditingRow]=useState(null);
  const [deleteRow,setDeleteRow]=useState(null);
  const [pendingEdits, setPendingEdits] = useState({});
  const [newRows, setNewRows] = useState([]);  
  const [error, setError] = useState("");
  const getRowValue = (row, accessor) => {
      return pendingEdits[row.id]?.[accessor] ?? row[accessor];
  };

  // Sort handler
  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortOrder("asc");
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!deleteRow) return;
      try{    
        const path=rootpath+"/"+deleteRow.id
        const result = await removeRow(path);
        console.log(result.message);
        setDeleteRow(null);
        refreshParent();
        setShowConfirm(false);
      }catch(err){
        setError(err.message);
        setShowConfirm(false);
        setDeleteRow(null);   
      }
};
const handleChange = (e, row) => {
    const { name, value } = e.target;
    setPendingEdits(prev => ({
        ...prev,
        [row.id]: { ...prev[row.id], [name]: value }
    }));
};

const handleSelect = (e,row) => {
  if(setSelectedRow){
    setSelectedRow(row);
  }
}

const handleSave = async (e,row) => {
    setEditingRow(null);
    const editedRow = { ...row, ...pendingEdits[row.id] };
    setPendingEdits(prev => {
        const copy = { ...prev };
        delete copy[row.id];
        return copy;
    });          
    if(!row.id) {
      if(addRow){
        try {
          const result = await addRow(editedRow);
          setNewRows(prev => prev.filter(r => r.id !== row.id));
          refreshParent();
        } catch (err) {
          setError(err.message);
        }
      }
    }else if (saveRow){
      try {
          const result = await saveRow(editedRow);
          refreshParent();
        } catch (err) {
          setError(err.message);
        }
    }

}



const handleRemove = (e,row) => {
    if(removeRow){
        setShowConfirm(true);
        setDeleteRow(row);
    }
}

const handleAction =(e,row,action) => {
  if(action.path){
    let state={}
    for(let col of action.keys){
      state[col]=row[col];
    }
    navigate(action.path,{
      state:state
    });
  }
}

const addEmptyRow = () => {
    if (addRow && !editingRow) {
        const emptyRow = { id: `new-${Date.now()}` };
        columns.forEach(col => { emptyRow[col.accessor] = ""; });
        setNewRows(prev => [...prev, emptyRow]);
        setEditingRow(emptyRow.id);
    }
};
  return (
    <div className=" flex flex-col justify-center items-center w-auto p-3">
      {showConfirm &&
      <ConfirmMessage message="Confirm Delete?" onConfirm={handleConfirmDelete} onClose={() => {setShowConfirm(false);}}/>
      }
      <div className="w-fit min-w-full">
        <div className="flex flex-col">
            {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
                    {error}
                    <button type="button"  onClick={() => setError("")} className="ml-3 font-bold">✕</button>
                </div>
            )}
            <div className="flex w-full justify-end mb-2 ml-5">
              <button type="button" 
                      className="p-2 mr-5 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                      onClick={(e) => downloadFile(`${rootpath}/export/excel`,"report.xlsx",{...options,search:search,sort_column:sortColumn,sort_direction:sortOrder})}
                    >
                    Export Excel
                </button>
                <button type="button" 
                      className="p-2 mr-2 rounded-xl shadow-lg text-white bg-green-600 text-center text-lg font-medium hover:bg-green-700"
                      onClick={(e) => downloadFile(`${rootpath}/export/pdf`,"report.pdf",{...options,search:search,sort_column:sortColumn,sort_direction:sortOrder})}
                    >
                    Export Pdf
                </button>          
            </div>
            <div className="flex justify-start mb-2">
              {/*Table Name*/}
              <h1 className="text-4xl font-bold " >{TableName}</h1>
            </div>            
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded mb-3 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="text-center p-6 text-gray-700 font-bold">Loading...</div> 
        ): data.length === 0 && newRows.length === 0 ? (
          <>
            <NoDataFound message="No records found." />
            {addRow && mode==="view" && (
              <div  className="p-1 border">
                <button type="button"   onClick={addEmptyRow} className="py-1 px-2 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">➕ add line</button>
              </div>
            )}               
          </>
        ) : (
          <>
          {/* Table */}
          <table className="border-collapse shadow-md">
            <thead>
              <tr className="bg-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    className="p-3 cursor-pointer border"
                    onClick={() => handleSort(col.accessor)}
                  >
                    {col.label}
                    {sortColumn === col.accessor &&
                      (sortOrder === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...data, ...newRows].map((row, i) => (
                <tr key={row.id} className="odd:bg-white even:bg-gray-100">
                  {columns.map((col) => (
                    <TableCell key={`${row.id}-${col.accessor}`}  Editable={editingRow === row.id && col.edit && Edit} val={getRowValue(row, col.accessor)} type="text" name={col.accessor} onChanged={(e) => handleChange(e,row)}/>
                  ))}
                  {actions.map((action,index) => (
                    <td  key={`${row.id}-action-${index}`} className="p-2 border">
                      <button type="button"  onClick={(e) => handleAction(e,row,action)} id={row.id}  className={`p-1 font-semibold rounded-xl shadow-lg ${action?.color || "bg-blue-400 hover:bg-blue-500" }`}>{action.label}</button>
                    </td>                    
                  ))}
                  {mode==="view" ? (
                    editingRow === row.id ? 
                    ( 
                        <td  key={`${row.id}-save`} className="p-2 border">
                          <button type="button"  onClick={(e) => handleSave(e,row)} id={row.id} data-key="save" className="p-1 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">Save</button>
                        </td>     
                    )
                    :
                    (
                      <>
                        <td  key={`${row.id}-edit`} className="p-2 border">
                          <button type="button"  onClick={(e) => setEditingRow(row.id)} id={row.id} data-key="update" className="p-1 font-semibold rounded-xl shadow-lg  bg-orange-400 hover:bg-orange-500">Edit</button>
                        </td>
                        
                        <td key={`${row.id}-remove`} className="p-2 border">
                          <button type="button"  onClick={(e) => handleRemove(e,row)} id={row.id} data-key="remove" className="p-1 font-semibold rounded-xl shadow-lg  bg-red-400 hover:bg-red-500">Remove</button>
                        </td>
                      </>
                    )
                  ):(
                        <td  key={`${row.id}-select`} className="p-2 border">
                          <button type="button"  onClick={(e) => handleSelect(e,row)} id={row.id} data-key="select" className="p-1 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">{SelectName}</button>
                        </td>        
                  )
                  }
                    
                </tr>
              ))}
            </tbody>
          </table>
          {addRow && mode==="view" && (
            <div  className="p-1 border">
              <button type="button"    onClick={addEmptyRow} className="py-1 px-2 font-semibold rounded-xl shadow-lg  bg-blue-400 hover:bg-blue-500">➕ add line</button>
            </div>
          )}        
          <Pagination page={page} setPage={setPage} pages={pages}/>
          </>
        )}
      </div>

    </div>
  );
}