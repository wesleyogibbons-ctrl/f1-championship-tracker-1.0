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

function renderTrack(layerId, data, mode) {
    const layer = document.getElementById(layerId);
    if (!layer) return;
    
    const trackHeight = layer.parentElement.offsetHeight - 100;
    const maxPoints = Math.max(...data.map(d => parseFloat(d.points)));
    const sortedData = [...data].sort((a, b) => b.points - a.points);
    let laneMemory = Array(LANE_OFFSETS.length).fill(-200);

    sortedData.forEach((entry, index) => {
        const points = parseFloat(entry.points);
        
        // --- ADDED: ZERO POINTS SPECIAL HANDLING ---
        let yPos;
        let chosenLane;

        if (maxPoints === 0 || points === 0) {
            // If points are 0, stick them to the bottom
            yPos = trackHeight;
            // Spread them across lanes using the index to ensure even distribution
            chosenLane = index % LANE_OFFSETS.length;
        } else {
            // Standard Proportional Y calculation
            yPos = ((maxPoints - points) / maxPoints) * trackHeight;

            // Middle-out logic for non-zero points
            chosenLane = 0; 
            for (let l = 0; l < LANE_OFFSETS.length; l++) {
                if (yPos > laneMemory[l] + VERTICAL_BUFFER) {
                    chosenLane = l;
                    break;
                }
            }
        }
        // --------------------------------------------

        laneMemory[chosenLane] = yPos;

        // ... rest of your DOM creation logic remains the same ...
        const teamId = mode === 'driver' ? entry.Constructors[0].constructorId : entry.Constructor.constructorId;
        // etc...
    });
}

// Initial update and set interval for every 1 minute
updateLiveStandings();
setInterval(updateLiveStandings, 60000);
