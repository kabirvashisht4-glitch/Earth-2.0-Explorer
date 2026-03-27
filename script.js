const planetContainer = document.getElementById('planet-container');
const loadingText = document.getElementById('loading');
const errorText = document.getElementById('error');
const NASA_QUERY_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_rade,st_dist,disc_year+from+ps+where+pl_rade+between+0.8+and+1.5&format=json";
async function fetchExoplanets() {
    try {
        const response = await fetch(NASA_QUERY_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        loadingText.classList.add('hidden');
        renderPlanets(data);
    } catch (error) {
        console.error("Fetch error:", error);
        loadingText.classList.add('hidden');
        errorText.classList.remove('hidden');
    }
}
function renderPlanets(planets) {
    planetContainer.innerHTML = "";
    if (planets.length === 0) {
        planetContainer.innerHTML = "<p>No matching worlds found in this sector.</p>";
        return;
    }
    const planetHTML = planets.map(planet => {
        return `
            <div class="planet-card">
                <h3>${planet.pl_name}</h3>
                <p>Radius: <span>${planet.pl_rade.toFixed(2)} Earths</span></p>
                <p>Distance: <span>${planet.st_dist ? planet.st_dist.toFixed(1) + ' pc' : 'Unknown'}</span></p>
                <p>Discovery Year: <span>${planet.disc_year}</span></p>
            </div>
        `;
    }).join('');

    planetContainer.innerHTML = planetHTML;
}
fetchExoplanets();