// Mapping team colors for 2026
const teamColors = {
    'mercedes': '#27F4D2', 'ferrari': '#E80020', 'red_bull': '#3671C6',
    'mclaren': '#FF8000', 'alpine': '#0093CC', 'haas': '#B6BABD',
    'aston_martin': '#229971', 'racing_bulls': '#6692FF', 'sauber': '#52E252',
    'williams': '#64C4FF', 'audi': '#F50537', 'cadillac': '#FFD700'
};

async function updateLiveStandings() {
    try {
        const response = await fetch('https://api.jolpi.ca/ergast/f1/2026/driverStandings.json');
        const data = await response.json();
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        
        renderDrivers(standings);
        document.getElementById('update-time').innerText = `Live Updates: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error("API error, check connection:", error);
    }
}

function renderDrivers(standings) {
    const container = document.getElementById('drivers-container');
    const trackHeight = document.getElementById('track').offsetHeight - 60;
    
    // Math constants
    const maxPts = Math.max(...standings.map(d => parseFloat(d.points)));
    // P1 is at 0px from top, P20 is at trackHeight
    
    standings.forEach((entry, index) => {
        const driver = entry.Driver;
        const constructor = entry.Constructors[0];
        const pts = parseFloat(entry.points);
        const driverId = driver.driverId;

        let card = document.getElementById(driverId);
        if (!card) {
            card = document.createElement('div');
            card.id = driverId;
            card.className = 'driver-card';
            container.appendChild(card);
        }

        // Calculate Y-Position
        const ratio = maxPts > 0 ? (maxPts - pts) / maxPts : 0;
        const yPos = ratio * trackHeight;

        // Apply team color and text
        card.style.setProperty('--team-color', teamColors[constructor.constructorId] || '#fff');
        card.innerHTML = `
            <div class="driver-name">${driver.familyName}</div>
            <div class="driver-pts">${pts} PTS | ${constructor.name}</div>
        `;

        // Horizontal Spacing: Stagger drivers so they don't overlap
        const xPos = index % 2 === 0 ? "10%" : "45%";
        card.style.transform = `translate(${xPos}, ${yPos}px)`;
    });
}

// Initial update and set interval for every 1 minute
updateLiveStandings();
setInterval(updateLiveStandings, 60000);
