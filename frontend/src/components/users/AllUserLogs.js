import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import axios from "axios";

function AllUserLogs() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [error, setError] = useState(null);
    const [totalHours, setTotalHours] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState('');
    const [filterParams, setFilterParams] = useState({});
    const itemsPerPage = 10;

    const fetchAllUserLogs = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/users/all-user-logs", {
                withCredentials: true,
            });
            setLogs(response.data);
            setFilteredLogs(response.data);
            setError("");
        } catch (error) {
            alert("Error fetching user logs!");
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchAllUserLogs();
    }, []);

    useEffect(() => {
        const total = filteredLogs.reduce((sum, log) => sum + (log.hours_to_spend || 0), 0);
        setTotalHours(total);
    }, [filteredLogs]);

    const applyFilters = () => {
        if (!filterType) {
            setFilteredLogs(logs);
            setCurrentPage(1);
            return;
        }

        let filtered = [...logs];

        switch (filterType) {
            case 'day': {
                const { selectedDate } = filterParams;
                if (selectedDate) {
                    filtered = filtered.filter(log =>
                        new Date(log.date).toDateString() === new Date(selectedDate).toDateString()
                    );
                }
                break;
            }
            case 'week': {
                const { fromDate, toDate } = filterParams;
                if (fromDate && toDate) {
                    filtered = filtered.filter(log => {
                        const logDate = new Date(log.date);
                        return logDate >= new Date(fromDate) && logDate <= new Date(toDate);
                    });
                }
                break;
            }
            case 'month': {
                const { month, year } = filterParams;
                if (month && year) {
                    filtered = filtered.filter(log => {
                        const logDate = new Date(log.date);
                        return logDate.getMonth() + 1 === parseInt(month) && 
                               logDate.getFullYear() === parseInt(year);
                    });
                }
                break;
            }
            case 'year': {
                const { year } = filterParams;
                if (year) {
                    filtered = filtered.filter(log => 
                        new Date(log.date).getFullYear() === parseInt(year)
                    );
                }
                break;
            }
            default : {
                alert("Invalid Field!");
            }
        }

        setFilteredLogs(filtered);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (filterParams && Object.keys(filterParams).length > 0) {
            applyFilters();
        }
    }, [filterParams]);

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        setFilterParams({});
    };

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="container-fluid" style={{ display: "flex", margin: "0", padding: "0", height: "100vh" }}>
                <NavBar />
                <div className="content" style={{ marginLeft: "30px", width: "calc(100% - 250px)", overflowY: "auto" }}>
                    <div className="container mt-3">
                        <h2>My Logs</h2>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={filterType}
                                onChange={handleFilterChange}
                            >
                                <option value="">Filter Logs</option>
                                <option value="day">View Logs by Day</option>
                                <option value="week">View Logs by Week</option>
                                <option value="month">View Logs by Month</option>
                                <option value="year">View Logs by Year</option>
                            </select>

                            {filterType === 'day' && (
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        onChange={(e) =>
                                            setFilterParams({ selectedDate: e.target.value })
                                        }
                                    />
                                </div>
                            )}

                            {filterType === 'week' && (
                                <div className="d-flex mt-2">
                                    <input
                                        type="date"
                                        className="form-control me-2"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, fromDate: e.target.value }))
                                        }
                                    />
                                    <input
                                        type="date"
                                        className="form-control"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, toDate: e.target.value }))
                                        }
                                    />
                                </div>
                            )}

                            {filterType === 'month' && (
                                <div className="d-flex mt-2">
                                    <select
                                        className="form-select me-2"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, month: e.target.value }))
                                        }
                                    >
                                        <option value="">Select Month</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{`Month ${i + 1}`}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Year"
                                        onChange={(e) =>
                                            setFilterParams((prev) => ({ ...prev, year: e.target.value }))
                                        }
                                    />
                                </div>
                            )}

                            {filterType === 'year' && (
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Year"
                                        onChange={(e) =>
                                            setFilterParams({ year: e.target.value })
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-3">
                            <h5>Total Hours Spent: {totalHours}</h5>
                        </div>

                        <div className="table-responsive" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Project Name</th>
                                        <th scope="col">Posted Date</th>
                                        <th scope="col">Task Name</th>
                                        <th scope="col">Hours Spend</th>
                                        <th scope="col">Task Status</th>
                                        <th scope="col">Posted By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLogs.length > 0 ? (
                                        paginatedLogs.map((log, index) => (
                                            <tr key={log._id}>
                                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td>{log.project_name}</td>
                                                <td>{log.date.substring(0, 10)}</td>
                                                <td>{log.task.name}</td>
                                                <td>{log.hours_to_spend}</td>
                                                <td>{log.task_status}</td>
                                                <td>{log.postedBy.username}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                                No user logs found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-center mt-3">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <li
                                            key={index}
                                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AllUserLogs;