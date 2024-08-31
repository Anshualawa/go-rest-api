import React, { useState, useEffect } from "react";
import axios from "axios";

const User = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    title: "",
    role: "",
    status: "Active",
  });

  // Fetch employee data
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/cms-user");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Handle input changes for the new employee form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Add new employee
  const handleAddEmployee = async () => {
    try {
      await axios.post("http://localhost:8080/cms-user", newEmployee);
      setNewEmployee({ name: "", email: "", title: "", role: "", status: "Active" });
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-lg font-semibold">Employees</h2>
          <p className="mt-1 text-sm text-gray-700">
            This is a list of all employees. You can add new employees, edit or delete existing ones.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={handleAddEmployee}
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Add new employee
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Employee</th>
                    <th className="px-12 py-3.5 text-left text-sm font-normal text-gray-700">Title</th>
                    <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Status</th>
                    <th className="px-4 py-3.5 text-left text-sm font-normal text-gray-700">Role</th>
                    <th className="relative px-4 py-3.5">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={employee.avatar || "https://via.placeholder.com/40"}
                              alt={employee.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-700">{employee.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-12 py-4">
                        <div className="text-sm text-gray-900">{employee.title}</div>
                        <div className="text-sm text-gray-700">Engineering</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${employee.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">{employee.role}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                        <a href="#" className="text-gray-700">Edit</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Form */}
      <div className="mt-8 max-w-md">
        <h3 className="text-lg font-medium">Add Employee</h3>
        <form className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            value={newEmployee.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <input
            type="email"
            name="email"
            value={newEmployee.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <input
            type="text"
            name="title"
            value={newEmployee.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <input
            type="text"
            name="role"
            value={newEmployee.role}
            onChange={handleChange}
            placeholder="Role"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default User;
