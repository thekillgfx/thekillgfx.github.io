fetch(url)
  .then(response => response.json())
  .then(data => {
    if (!Array.isArray(data)) {
      throw new Error("Unexpected data format: Expected an array");
    }

    // Sort data by execution_date (if not already sorted)
    data.sort((a, b) => new Date(a.execution_date) - new Date(b.execution_date));

    // Create a dictionary to store only the latest record for each day
    const dailyData = {};
    data.forEach(record => {
      const dateKey = new Date(record.execution_date).toISOString().split('T')[0]; // YYYY-MM-DD format
      dailyData[dateKey] = record; // Keep only the latest entry for the day
    });

    // Convert dictionary back to an array
    const recentData = Object.values(dailyData);

    // Calculate trophy differences for gain/loss
    const dailyDifferences = calculateTrophyDifference(recentData);

    // Calculate metrics for the last 7, 14, 30 days
    const today = new Date();
    const trophiesLast7d = calculateTotalTrophies(recentData, 7);
    const trophiesLast14d = calculateTotalTrophies(recentData, 14);
    const trophiesLast30d = calculateTotalTrophies(recentData, 30);
    const avgDailyGain = dailyDifferences.length
      ? dailyDifferences.reduce((sum, diff) => sum + diff, 0) / dailyDifferences.length
      : 0;

    // Update UI with calculated values
    document.getElementById('trophies7d').textContent = trophiesLast7d;
    document.getElementById('trophies14d').textContent = trophiesLast14d;
    document.getElementById('trophies30d').textContent = trophiesLast30d;
    document.getElementById('avgDailyGain').textContent = avgDailyGain.toFixed(2);

    // Prepare data for the chart
    const chartLabels = recentData.map(item => new Date(item.execution_date).toLocaleDateString());
    const chartData = recentData.map(item => item.trophies);

    // Render the chart
    const ctx = document.getElementById('trophyChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Trophies',
          data: chartData,
          borderColor: '#9b59b6',
          fill: false,
          tension: 0.1
        }]
      }
    });

    // Create the table view
    const tableBody = document.getElementById('tableBody');
    recentData.forEach((item, index) => {
      const row = document.createElement('tr');
      const dateCell = document.createElement('td');
      const trophiesCell = document.createElement('td');
      const changeCell = document.createElement('td');

      dateCell.textContent = new Date(item.execution_date).toLocaleDateString();
      trophiesCell.textContent = item.trophies;
      const gainLoss = index === 0 ? 0 : item.trophies - recentData[index - 1].trophies;
      changeCell.textContent = gainLoss === 0 ? 'No Change' : (gainLoss > 0 ? `+${gainLoss}` : `${gainLoss}`);
      changeCell.className = gainLoss > 0 ? 'gain' : (gainLoss < 0 ? 'loss' : '');

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

// Function to calculate daily trophy differences
function calculateTrophyDifference(data) {
  const differences = [];
  for (let i = 1; i < data.length; i++) {
    differences.push(data[i].trophies - data[i - 1].trophies);
  }
  return differences;
}

// Function to calculate total trophies in the last N days
function calculateTotalTrophies(data, days) {
  const today = new Date();
  return data
    .filter(item => (today - new Date(item.execution_date)) / (1000 * 3600 * 24) <= days)
    .reduce((sum, item) => sum + item.trophies, 0);
}
