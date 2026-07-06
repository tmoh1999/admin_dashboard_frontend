export default function NoDataFound({ message }) {
    return (
        <div className="w-full flex items-center justify-center bg-gray-100 p-6 rounded-xl shadow-md">
            <div className="flex flex-col items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-700 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>

                <p className="text-gray-700 text-lg">
                    {message || "No data found."}
                </p>
            </div>
        </div>
    );
}