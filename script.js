const url = 'https://storage.googleapis.com/coc-store/trophies/GYLG9J9QR.json'; // Example URL

// Extract profile tag from the URL
const profileTag = url.split('/').pop().split('.')[0]; // Extract the profile tag from the URL

// Update the <h1> element with the profile tag
document.getElementById('profileTitle').textContent = `#${profileTag} - stats`;

// Fetch and display data
fetch(url)
  .then(response => response.json())
  .then(data => {
    // Metrics data
    const trophiesData = [
      {
        date: data.execution_date,
        trophies: data.trophies,
        gainLoss: 0
      }
    ];

    // Create a date object for filtering data
    const today = new Date();
    const recentData = trophiesData.filter(item => {
      const itemDate = new Date(item.date);
      return (today - itemDate) / (1000 * 3600 * 24) <= 30; // Filter data for the last 30 days
    });

    // Calculate the total trophies collected/lost in the last 7, 14, 30 days
    const trophiesLast7d = recentData.slice(-7).reduce((sum, item) => sum + item.trophies, 0);
    const trophiesLast14d = recentData.slice(-14).reduce((sum, item) => sum + item.trophies, 0);
    const trophiesLast30d = recentData.slice(-30).reduce((sum, item) => sum + item.trophies, 0);

    document.getElementById('trophies7d').textContent = trophiesLast7d;
    document.getElementById('trophies14d').textContent = trophiesLast14d;
    document.getElementById('trophies30d').textContent = trophiesLast30d;

    // Calculate the average daily gain/loss
    const dailyDifferences = calculateTrophyDifference(recentData);
    const avgDailyGain = dailyDifferences.reduce((sum, diff) => sum + diff, 0) / dailyDifferences.length;
    document.getElementById('avgDailyGain').textContent = avgDailyGain.toFixed(2);

    // Prepare data for the chart (show only the latest record)
    const chartLabels = [new Date(recentData[recentData.length - 1].date).toLocaleDateString()];
    const chartData = [recentData[recentData.length - 1].trophies];

    const ctx = document.getElementById('trophyChart').getContext('2d');
    const trophyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Trophies',
          data: chartData,
          borderColor: '#9b59b6', // Dark violet line color
          fill: false,
          tension: 0.1
        }]
      }
    });

    // Create the table view
    const tableBody = document.getElementById('tableBody');
    recentData.forEach(item => {
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

// Helper function to calculate trophy differences between days
function calculateTrophyDifference(data) {
  const differences = [];
  for (let i = 1; i < data.length; i++) {
    differences.push(data[i].trophies - data[i - 1].trophies);
  }
  return differences;
}
