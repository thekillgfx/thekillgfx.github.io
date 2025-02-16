const url = 'https://storage.googleapis.com/coc-store/trophies/GYLG9J9QR.json'; // Your JSON file URL

// Fetch and display data
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Display metrics
    document.getElementById('attackWins').textContent = data.attackWins;
    document.getElementById('defenseWins').textContent = data.defenseWins;
    document.getElementById('trophies').textContent = data.trophies;

    // Prepare data for the chart and table
    const trophiesData = [
      {
        date: data.execution_date,
        trophies: data.trophies,
        gainLoss: 0
      }
    ];

    // For simplicity, assuming you have more data points in the future (this is for illustration)
    // Prepare chart labels and data for display
    const chartLabels = trophiesData.map(item => new Date(item.date).toLocaleDateString());
    const chartData = trophiesData.map(item => item.trophies);
    const chartChange = trophiesData.map((item, index) => {
      return index === 0 ? 0 : item.trophies - trophiesData[index - 1].trophies;
    });

    // Create the graph using Chart.js
    const ctx = document.getElementById('trophyChart').getContext('2d');
    const trophyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Trophies',
          data: chartData,
          borderColor: '#8e44ad',
          fill: false,
          tension: 0.1
        }, {
          label: 'Change in Trophies',
          data: chartChange,
          borderColor: '#e74c3c',
          fill: false,
          tension: 0.1,
          borderDash: [5, 5]
        }]
      }
    });

    // Create the table view
    const tableBody = document.getElementById('tableBody');
    trophiesData.forEach(item => {
      const row = document.createElement('tr');
      const dateCell = document.createElement('td');
      const trophiesCell = document.createElement('td');
      const changeCell = document.createElement('td');

      dateCell.textContent = new Date(item.date).toLocaleDateString();
      trophiesCell.textContent = item.trophies;
      changeCell.textContent = item.gainLoss === 0 ? 'No Change' : (item.gainLoss > 0 ? `+${item.gainLoss}` : `${item.gainLoss}`);
      changeCell.className = item.gainLoss > 0 ? 'gain' : (item.gainLoss < 0 ? 'loss' : '');

      row.appendChild(dateCell);
      row.appendChild(trophiesCell);
      row.appendChild(changeCell);
      tableBody.appendChild(row);
    });

    // Switch between views
    const viewGraphBtn = document.getElementById('viewGraphBtn');
    const viewTableBtn = document.getElementById('viewTableBtn');
    const table = document.getElementById('trophyTable');
    const graph = document.getElementById('trophyChart');

    viewGraphBtn.addEventListener('click', () => {
      table.style.display = 'none';
      graph.style.display = 'block';
    });

    viewTableBtn.addEventListener('click', () => {
      graph.style.display = 'none';
      table.style.display = 'block';
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
