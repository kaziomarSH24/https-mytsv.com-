import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex items-center justify-center mt-8">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="sr-only">Previous</span>
                        <FaArrowLeft className="w-5 h-5" />
                    </button>
                </li>
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button onClick={() => onPageChange(number)} className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === number ? "text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700" : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"} border-y border-gray-300`}>
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="sr-only">Next</span>
                        <FaArrowRight className="w-5 h-5" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
