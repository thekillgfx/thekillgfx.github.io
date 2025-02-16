// Function to fetch JSON data from a URL and display it in the HTML
function fetchData() {
    // Define the URL from which to fetch JSON data (replace with your link)
    const url = 'https://thekillgfx.github.io/';  // Example link
  
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
        const dataContainer = document.getElementById('json-data');
        dataContainer.textContent = JSON.stringify(data, null, 2); // Pretty print JSON
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        const dataContainer = document.getElementById('json-data');
        dataContainer.textContent = 'Failed to fetch data.';
      });
  }
  