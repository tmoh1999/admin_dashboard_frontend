export default function TableCell({ Editable, val, type = "text", onChanged, name }) {
  return (
    <td className="p-1 border">
      {Editable ? (
        <input
          value={val}
          name={name}
          className="text-center  bg-blue-200 shadow-lg rounded-lg"
          type={type}
          onChange={onChanged}
        />
      ) : (
        <p className="text-center">{val}</p>
      )}
    </td>
  );
}