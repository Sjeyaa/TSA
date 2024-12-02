import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import axios from "axios";

function ProjectHours() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [error, setError] = useState(null);
    const [totalActualHours, setTotalActualHours] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState('');
    const [filterParams, setFilterParams] = useState({});
    const itemsPerPage = 10;

    

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admindash/projects', {
                withCredentials: true,
                
            });
            setProjects(response.data);
            setFilteredProjects(response.data);
            setError("");
        } catch (error) {
            alert("Error fetching projects!");
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const total = filteredProjects.reduce((sum, project) => sum + (project.actualHours || 0), 0);
        setTotalActualHours(total);
    }, [filteredProjects]);

    const applyFilters = () => {
        if (!filterType) {
            setFilteredProjects(projects);
            setCurrentPage(1);
            return;
        }

        let filtered = [...projects];

        switch (filterType) {
            case 'day': {
                const { selectedDate } = filterParams;
                if (selectedDate) {
                    filtered = filtered.filter(project =>
                        new Date(project.updated_at).toDateString() === new Date(selectedDate).toDateString()
                    );
                }
                break;
            }
            case 'week': {
                const { fromDate, toDate } = filterParams;
                if (fromDate && toDate) {
                    filtered = filtered.filter(project => {
                        const projectDate = new Date(project.updated_at);
                        return projectDate >= new Date(fromDate) && projectDate <= new Date(toDate);
                    });
                }
                break;
            }
            case 'month': {
                const { month, year } = filterParams;
                if (month && year) {
                    filtered = filtered.filter(project => {
                        const projectDate = new Date(project.updated_at);
                        return projectDate.getMonth() + 1 === parseInt(month) && 
                               projectDate.getFullYear() === parseInt(year);
                    });
                }
                break;
            }
            case 'year': {
                const { year } = filterParams;
                if (year) {
                    filtered = filtered.filter(project => 
                        new Date(project.updated_at).getFullYear() === parseInt(year)
                    );
                }
                break;
            }
        }

        setFilteredProjects(filtered);
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

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const paginatedProjects = filteredProjects.slice(
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
            <div className="container-fluid" style={{ display: 'flex', margin: '0', padding: '0', height: '100vh' }}>
                <NavBar />
                <div className="content" style={{ marginLeft: '30px', width: 'calc(100% - 250px)', overflowY: 'auto' }}>
                    <div className="container mt-3">
                        <h2>Project Overview</h2>

                        <div className="mb-3">
                            <select
                                className="form-select"
                                value={filterType}
                                onChange={handleFilterChange}
                            >
                                <option value="">Filter Projects</option>
                                <option value="day">View Projects by Day</option>
                                <option value="week">View Projects by Week</option>
                                <option value="month">View Projects by Month</option>
                                <option value="year">View Projects by Year</option>
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
                            <h5>Total Actual Hours: {totalActualHours.toFixed(2)}</h5>
                        </div>

                        <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Project Name</th>
                                        <th scope="col">Department</th>
                                        <th scope="col">Business Unit</th>
                                        <th scope="col">Planned Hours</th>
                                        <th scope="col">Actual Hours</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProjects.length > 0 ? (
                                        paginatedProjects.map((project, index) => (
                                            <tr key={project.projectName}>
                                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                <td>{project.projectName}</td>
                                                <td>{project.departmentName}</td>
                                                <td>{project.businessUnitName}</td>
                                                <td>{project.plannedHours}</td>
                                                <td>{project.actualHours}</td>
                                                <td>{project.status}</td>
                                                <td>{new Date(project.updated_at).toLocaleString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                No Projects found.
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

export default ProjectHours;