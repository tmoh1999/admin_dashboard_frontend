
import { useState ,useEffect} from "react";
import Table from "./Table";
import { api , columns} from "../api/table_data";
import { apiGet } from "../api";
import NoDataFound from "./NoDataFound";
export default function DTable({ 
    mode="view",tableMode="users",
    SelectName="Select",Edit=false,
    refreshParent,setSelectedRow,
    TableName,options={},refreshKey=0
}) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");    


    const [page,setPage]=useState(1);
    const [totalPages,setTotalPages]=useState(1);
    const [search, setSearch] = useState("");
    const [sortColumn, setSortColumn] = useState("__default__");
    const [sortOrder, setSortOrder] = useState("desc");
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError("");
        apiGet(
            api[tableMode].rootpath,
            { page, sort_column: sortColumn, sort_direction: sortOrder, search }
        )
        .then((result) => {
            setTableData(Array.isArray(result?.results) ? result.results : []);
            setTotalPages(result?.total_pages || 1);
            })
        .catch((err) => setError(err.message || "Failed to load table data"))
        .finally(() => setLoading(false));
    }, [refreshKey, search, sortColumn, sortOrder]);
    return (
        <>
          {tableData.length === 0 ? (
            <NoDataFound message="No data found." />
          ) : (
          <Table
            mode={mode}
            TableName={TableName}
            SelectName={SelectName}
            data={tableData}
            columns={columns[tableMode]}
            addRow={api[tableMode].add}
            removeRow={api[tableMode].remove}
            saveRow={api[tableMode].update}
            actions={api[tableMode].actions}
            rootpath={api[tableMode].rootpath}
            setSelectedRow={setSelectedRow}
            setPage={setPage}
            page={page}
            pages={totalPages}
            search={search} setSearch={setSearch}
            sortColumn={sortColumn} setSortColumn={setSortColumn}
            sortOrder={sortOrder} setSortOrder={setSortOrder}
            options={options}
            refreshParent={refreshParent}
            Edit={Edit}
        />
        )}
        </>
    )        

}    