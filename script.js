const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('planetSearch');
let allPlanets = [];
async function fetchPlanets() {
    const nasaUrl = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+top+100+pl_name,hostname,disc_year,discoverymethod,pl_bmassj,sy_dist+from+pscomppars+where+pl_bmassj+is+not+null+and+sy_dist+is+not+null&format=json";
    const proxy = "https://corsproxy.io/?url=";
    try {
        const response = await fetch(proxy + encodeURIComponent(nasaUrl));
        
        if (!response.ok) throw new Error("Network error");

        allPlanets = await response.json();
        renderTable(allPlanets);
    } catch (error) {
        console.error("Fetch failed:", error);
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Data Fetch Error. Please refresh.</td></tr>';
    }
}
function renderTable(data) {
    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No matching planets found.</td></tr>';
        return;
    }
    tableBody.innerHTML = data.map(planet => `
        <tr>
            <td>${planet.pl_name}</td>
            <td>${planet.hostname}</td>
            <td>${planet.disc_year}</td>
            <td>${planet.discoverymethod}</td>
            <td>${planet.pl_bmassj ? planet.pl_bmassj.toFixed(2) : 'N/A'}</td>
            <td>${planet.sy_dist ? planet.sy_dist.toFixed(2) : 'N/A'}</td>
        </tr>
    `).join('');
}
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPlanets.filter(planet => {
        const name = planet.pl_name.toLowerCase();
        const host = planet.hostname.toLowerCase();
        return name.includes(term) || host.includes(term);
    });
    renderTable(filtered);
});
fetchPlanets();
