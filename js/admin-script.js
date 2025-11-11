document.addEventListener('DOMContentLoaded', () => {
    const password = prompt('Enter admin password:');
    if (password !== 'admin123') {
        alert('Incorrect password');
        window.location.href = 'index.html';
        return;
    }

    async function fetchAdminData() {
        console.log('Fetching admin data from /api/admin-data...');
        try {
            const response = await fetch('/api/admin-data');
            console.log('Response status:', response.status);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log('Admin data received:', data);
            displayData(data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            alert('Error fetching admin data. Check console.');
        }
    }

    function displayData(data) {
        // Bookings
        const bookingsTable = document.querySelector('#bookings-table tbody');
        bookingsTable.innerHTML = '';
        console.log('Displaying bookings:', data.bookings);
        data.bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.name || 'N/A'}</td>
                <td>${booking.email || 'N/A'}</td>
                <td>${booking.phone || 'N/A'}</td>
                <td>${booking.car || 'N/A'}</td>
                <td>${booking.date || 'N/A'}</td>
                <td>${booking.duration || 'N/A'}</td>
                <td>${booking.event || 'N/A'}</td>
                <td>${new Date(booking.timestamp).toLocaleString()}</td>
                <td><button class="delete-btn" data-id="${booking._id}" data-type="bookings">Delete</button></td>
            `;
            bookingsTable.appendChild(row);
        });

        // Drivers
        const driversTable = document.querySelector('#drivers-table tbody');
        driversTable.innerHTML = '';
        console.log('Displaying drivers:', data.drivers);
        data.drivers.forEach(driver => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${driver.name || 'N/A'}</td>
                <td>${driver.email || 'N/A'}</td>
                <td>${driver.phone || 'N/A'}</td>
                <td>${driver.experience || 'N/A'}</td>
                <td>${driver.languages || 'N/A'}</td>
                <td>${driver.licenseCategory || 'N/A'}</td>
                <td><a href="/Uploads/${driver.licensePath}" target="_blank">View</a></td>
                <td><a href="/Uploads/${driver.photoPath}" target="_blank">View</a></td>
                <td>${new Date(driver.timestamp).toLocaleString()}</td>
                <td><button class="delete-btn" data-id="${driver._id}" data-type="drivers">Delete</button></td>
            `;
            driversTable.appendChild(row);
        });

        // Driver Requests
        const requestsTable = document.querySelector('#driver-requests-table tbody');
        requestsTable.innerHTML = '';
        console.log('Displaying driver requests:', data.driverRequests);
        data.driverRequests.forEach(request => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${request['request-name'] || 'N/A'}</td>
                <td>${request['request-email'] || 'N/A'}</td>
                <td>${request['request-phone'] || 'N/A'}</td>
                <td>${request['request-event'] || 'N/A'}</td>
                <td>${request['request-date'] || 'N/A'}</td>
                <td>${request['request-duration'] || 'N/A'}</td>
                <td>${request['request-car-needed'] || 'N/A'}</td>
                <td>${new Date(request.timestamp).toLocaleString()}</td>
                <td><button class="delete-btn" data-id="${request._id}" data-type="driver-requests">Delete</button></td>
            `;
            requestsTable.appendChild(row);
        });

        // Car Postings
        const carPostingsTable = document.querySelector('#car-postings-table tbody');
        carPostingsTable.innerHTML = '';
        console.log('Displaying car postings:', data.carPostings);
        data.carPostings.forEach(posting => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${posting.name || 'N/A'}</td>
                <td>${posting.email || 'N/A'}</td>
                <td>${posting.phone || 'N/A'}</td>
                <td>${posting.model || 'N/A'}</td>
                <td>${posting.price || 'N/A'}</td>
                <td>${posting.availability || 'N/A'}</td>
                <td>${posting.location || 'N/A'}</td>
                <td><a href="/Uploads/${posting.photoPath}" target="_blank">View</a></td>
                <td>${new Date(posting.timestamp).toLocaleString()}</td>
                <td><button class="delete-btn" data-id="${posting._id}" data-type="car-postings">Delete</button></td>
            `;
            carPostingsTable.appendChild(row);
        });

        // Car Sales
        const carSalesTable = document.querySelector('#car-sales-table tbody');
        carSalesTable.innerHTML = '';
        console.log('Displaying car sales:', data.carSales);
        data.carSales.forEach(sale => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${sale.name || 'N/A'}</td>
                <td>${sale.email || 'N/A'}</td>
                <td>${sale.phone || 'N/A'}</td>
                <td>${sale.model || 'N/A'}</td>
                <td>${sale.year || 'N/A'}</td>
                <td>${sale.price || 'N/A'}</td>
                <td>${sale.location || 'N/A'}</td>
                <td>${sale.photoPaths ? sale.photoPaths.map(path => `<a href="/Uploads/${path}" target="_blank">View</a>`).join(', ') : 'N/A'}</td>
                <td>${new Date(sale.timestamp).toLocaleString()}</td>
                <td><button class="delete-btn" data-id="${sale._id}" data-type="car-sales">Delete</button></td>
            `;
            carSalesTable.appendChild(row);
        });

        // Add delete button listeners
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                const type = button.getAttribute('data-type');
                if (confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
                    try {
                        const response = await fetch(`/api/admin/${type}/${id}`, {
                            method: 'DELETE'
                        });
                        const result = await response.json();
                        if (result.success) {
                            alert(result.message);
                            fetchAdminData();
                        } else {
                            alert(result.message || 'Error deleting item.');
                        }
                    } catch (error) {
                        console.error(`Error deleting ${type}:`, error);
                        alert('Error deleting item. Check console.');
                    }
                }
            });
        });
    }

    fetchAdminData();
});