import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import your CSS file for styling

const Input = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    age: '',
    phone: '',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://localhost:8000/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers', error);
      });
  };

  const handleInputChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value,


    });
  };

  const addCustomer = () => {
    axios.post('http://localhost:8000/customers', newCustomer)
      .then(response => {
        setCustomers([...customers, response.data]);
        setNewCustomer({ name: '', age: '', phone: '', location: '' });
      })
      .catch(error => {
        console.error('Error adding customer', error);
      });
  };
  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/customers/${customerId}`);

      // Optimistic UI update (remove customer from state immediately)
      setCustomers(customers.filter((customer) => customer.id !== customerId));

      // Confirm deletion with server response (optional)
      if (response.status === 200) {
        console.log('Customer deleted successfully!');
      } else {
        console.error('Error deleting customer:', response.data);
        // Revert UI changes if necessary based on server response
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      // Handle potential errors and display appropriate messages to the user
    }
  };

  // Logic to calculate index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = customers.slice(indexOfFirstItem, indexOfLastItem);

  // Logic to paginate
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Customer Table</h1>
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="input-fields">

        <input
          type="text"
          placeholder="Name"
          name="name"
          value={newCustomer.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Age"
          name="age"
          value={newCustomer.age}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Phone"
          name="phone"
          value={newCustomer.phone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={newCustomer.location}
          onChange={handleInputChange}
        />
        <button onClick={addCustomer}>Add Customer</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>S_No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Created_At</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
        {currentItems.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.location.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{customer.created_at}</td>
              <td>
                <button className="btn" onClick={() => handleDeleteCustomer(customer.id)}>
                <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(customers.length / itemsPerPage) }, (_, i) => i + 1).map(number => (
          <button className="button" key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Input;
