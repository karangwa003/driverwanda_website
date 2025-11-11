document.addEventListener('DOMContentLoaded', () => {
    // Get modal and button elements
    const bookingModal = document.getElementById('booking-form');
    const driverModal = document.getElementById('driver-form');
    const requestModal = document.getElementById('request-form');
    const postCarModal = document.getElementById('post-car-form');
    const sellCarModal = document.getElementById('sell-car-form');
    const bookButtons = document.querySelectorAll('.book-btn');
    const applyButton = document.querySelector('.apply-btn');
    const requestButton = document.querySelector('.request-driver-btn');
    const postCarButton = document.querySelector('.post-car-btn');
    const sellCarButton = document.querySelector('.sell-car-btn');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Get form elements
    const bookingForm = document.getElementById('booking-form');
    const driverForm = document.getElementById('driver-form');
    const requestForm = document.getElementById('request-form');
    const postCarForm = document.getElementById('post-car-form');
    const sellCarForm = document.getElementById('sell-car-form');

    // Modal open handlers
    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const carName = button.getAttribute('data-car');
            const carInput = bookingForm.querySelector('#car');
            const selectedCarSpan = bookingForm.querySelector('#selected-car');
            carInput.value = carName;
            selectedCarSpan.textContent = carName;
            bookingModal.style.display = 'block';
        });
    });

    if (applyButton) {
        applyButton.addEventListener('click', () => {
            driverModal.style.display = 'block';
        });
    }

    if (requestButton) {
        requestButton.addEventListener('click', () => {
            requestModal.style.display = 'block';
        });
    }

    if (postCarButton) {
        postCarButton.addEventListener('click', () => {
            postCarModal.style.display = 'block';
        });
    }

    if (sellCarButton) {
        sellCarButton.addEventListener('click', () => {
            sellCarModal.style.display = 'block';
        });
    }

    // Modal close handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    // Booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            const formData = new FormData(bookingForm);
            try {
                const response = await fetch('http://localhost:3000/api/book', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    alert('Booking submitted successfully! You will receive a confirmation soon.');
                    bookingModal.style.display = 'none';
                    bookingForm.reset();
                } else {
                    alert(result.message || 'Error submitting booking. Please try again.');
                }
            } catch (error) {
                console.error('Booking error:', error);
                alert('Error submitting booking. Please check your connection.');
            } finally {
                submitBtn.classList.remove('submitting');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Booking';
            }
        });
    }

    // Driver form submission
    if (driverForm) {
        driverForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = driverForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            const formData = new FormData(driverForm);
            try {
                const response = await fetch('http://localhost:3000/api/driver', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    alert('Your driver application has been submitted successfully! Please check your email for confirmation.');
                    driverModal.style.display = 'none';
                    driverForm.reset();
                } else {
                    alert(result.message || 'Error submitting application. Please try again.');
                }
            } catch (error) {
                console.error('Driver submission error:', error);
                alert('Error submitting application. Please check your connection.');
            } finally {
                submitBtn.classList.remove('submitting');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            }
        });
    }

    // Driver request form submission
    if (requestForm) {
        requestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = requestForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            const formData = new FormData(requestForm);
            try {
                const response = await fetch('http://localhost:3000/api/driver-request', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    alert('Driver request submitted successfully! You will receive a response soon.');
                    requestModal.style.display = 'none';
                    requestForm.reset();
                } else {
                    alert(result.message || 'Error submitting request. Please try again.');
                }
            } catch (error) {
                console.error('Request error:', error);
                alert('Error submitting request. Please check your connection.');
            } finally {
                submitBtn.classList.remove('submitting');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Request';
            }
        });
    }

    // Post car form submission
    if (postCarForm) {
        postCarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = postCarForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            const formData = new FormData(postCarForm);
            try {
                const response = await fetch('http://localhost:3000/api/post-car', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    alert('Car posting submitted successfully! It will be reviewed soon.');
                    postCarModal.style.display = 'none';
                    postCarForm.reset();
                } else {
                    alert(result.message || 'Error submitting car posting. Please try again.');
                }
            } catch (error) {
                console.error('Post car error:', error);
                alert('Error submitting car posting. Please check your connection.');
            } finally {
                submitBtn.classList.remove('submitting');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Posting';
            }
        });
    }

    // Sell car form submission
    if (sellCarForm) {
        sellCarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = sellCarForm.querySelector('button[type="submit"]');
            submitBtn.classList.add('submitting');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            const formData = new FormData(sellCarForm);
            try {
                const response = await fetch('http://localhost:3000/api/sell-car', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    alert('Car sale listing submitted successfully! It will be reviewed soon.');
                    sellCarModal.style.display = 'none';
                    sellCarForm.reset();
                } else {
                    alert(result.message || 'Error submitting sale listing. Please try again.');
                }
            } catch (error) {
                console.error('Sell car error:', error);
                alert('Error submitting sale listing. Please check your connection.');
            } finally {
                submitBtn.classList.remove('submitting');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Listing';
            }
        });
    }
});