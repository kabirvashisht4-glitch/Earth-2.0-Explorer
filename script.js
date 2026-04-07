const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('planetSearch');
const filterSize = document.getElementById('filterSize');
const filterYear = document.getElementById('filterYear');
const filterMethod = document.getElementById('filterMethod');

let allPlanets = [];

fetch("https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,disc_year,discoverymethod,pl_bmassj,sy_dist+from+pscomppars+where+pl_bmassj+is+not+null+and+sy_dist+is+not+null&format=json")
  .then(res => res.json())
  .then(data => {
    allPlanets = data.slice(0, 200)
    renderTable(allPlanets)
  })

function renderTable(data) {
  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No matching planets.</td></tr>';
    return;
  }
  tableBody.innerHTML = data.map(planet => `
    <tr>
      <td>${planet.pl_name}</td>
      <td>${planet.hostname}</td>
      <td>${planet.disc_year}</td>
      <td>${planet.discoverymethod}</td>
      <td>${planet.pl_bmassj.toFixed(3)}</td>
      <td>${planet.sy_dist.toFixed(1)}</td>
    </tr>
  `).join('');
}

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const sizeVal = filterSize.value;
  const yearVal = filterYear.value;
  const methodVal = filterMethod.value;

  const filtered = allPlanets.filter(p => {
    const matchesSearch = p.pl_name.toLowerCase().includes(searchTerm) ||
                          p.hostname.toLowerCase().includes(searchTerm);
    const matchesSize = sizeVal === "all" ||
      (sizeVal === "small" && p.pl_bmassj < 0.01) ||
      (sizeVal === "large" && p.pl_bmassj >= 0.01);
    const matchesYear = yearVal === "all" ||
      (yearVal === "new" && p.disc_year >= 2020) ||
      (yearVal === "old" && p.disc_year < 2020);
    const matchesMethod = methodVal === "all" || p.discoverymethod === methodVal;

    return matchesSearch && matchesSize && matchesYear && matchesMethod;
  });

  renderTable(filtered);
}

searchInput.addEventListener('input', applyFilters);
filterSize.addEventListener('change', applyFilters);
filterYear.addEventListener('change', applyFilters);
filterMethod.addEventListener('change', applyFilters);