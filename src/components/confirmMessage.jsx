export default function ConfirmMessage({ onClose,onConfirm,message }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-3/5 items-center bg-white p-2 rounded shadow-lg">
        <h2 className="text-2xl font-bold">Confirm Page</h2>

        <p className="mt-5 text-center text-xl font-semibold">{message}</p>
       <div className="w-full flex justify-center items-center  mb-2 mt-1">
        <button
          onClick={onConfirm}
          className="mt-4 bg-green-400  px-4 py-2 rounded-xl"
        >
          Confirm
        </button>
        
        <button
          onClick={onClose}
          className="ml-10 mt-4 bg-red-500 px-4 py-2 rounded-xl"
        >
          Abort
        </button>
        </div>
      </div>
    </div>
  );
}