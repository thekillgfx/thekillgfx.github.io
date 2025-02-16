
// https://thekillgfx.github.io/


function fetchData() {
    // Define the URL from which to fetch JSON data (replace with your link)
    const url = 'https://thekillgfx.github.io/'
  
    // Get the container where the JSON data will be displayed
    const dataContainer = document.getElementById('json-data');
    dataContainer.textContent = 'Loading...';  // Show loading text while fetching
  
    // Use fetch to get the data
    fetch(url)
      .then(response => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
      })
      .then(data => {
        // Display the JSON data inside the <pre> element
        dataContainer.textContent = JSON.stringify(data, null, 2); // Pretty print JSON
      })
      .catch(error => {
        // Handle the error and display a user-friendly message
        console.error('There was a problem with the fetch operation:', error);
        dataContainer.textContent = 'Failed to fetch data. Please try again later.';
      });
  }
  
  // Call fetchData when the page loads to show data by default
  window.onload = fetchData;
  