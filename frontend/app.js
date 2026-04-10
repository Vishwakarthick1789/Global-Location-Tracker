const API_BASE_URL = 'http://127.0.0.1:8000';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize standard Leaflet map
    const map = L.map('map').setView([20, 0], 2); // Default global view

    // Add CartoDB Dark Matter base map for a beautiful dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    const trackBtn = document.getElementById('trackBtn');
    const statusMsg = document.getElementById('statusMsg');
    const locationList = document.getElementById('locationList');
    
    // Store markers to manage them
    let markers = [];

    // Load initial locations
    fetchLocations();

    trackBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            statusMsg.textContent = 'Geolocation is not supported by your browser.';
            return;
        }

        statusMsg.textContent = 'Locating...';
        trackBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                saveLocation(lat, lng);
            },
            (error) => {
                console.error(error);
                statusMsg.textContent = 'Unable to extract location. Error: ' + error.message;
                trackBtn.disabled = false;
            }
        );
    });

    async function saveLocation(lat, lng) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ latitude: lat, longitude: lng })
            });

            if (!response.ok) {
                throw new Error('Failed to save location on server.');
            }

            statusMsg.textContent = 'Location tracked successfully!';
            statusMsg.style.color = '#4ade80'; // Success green
            
            setTimeout(() => {
                statusMsg.textContent = 'Ready to log your current coordinates.';
                statusMsg.style.color = '';
            }, 3000);

            // Give the map time to render & fetch updated pins
            fetchLocations();
            
            // Fly to new location
            map.flyTo([lat, lng], 13, { duration: 2 });
            
        } catch (error) {
            console.error('API Error:', error);
            statusMsg.textContent = 'Error connecting to the server. Is it running?';
            statusMsg.style.color = '#f87171'; // Error red
        } finally {
            trackBtn.disabled = false;
        }
    }

    async function fetchLocations() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/locations`);
            if (!response.ok) return;

            const locations = await response.json();
            renderLocations(locations);
            
            // If we have locations and map is still at default view (no zoom done manually just now)
            if (locations.length > 0 && markers.length === 0) {
                map.setView([locations[0].latitude, locations[0].longitude], 10);
            }
        } catch (error) {
            console.error('Could not fetch locations:', error);
        }
    }

    function renderLocations(locations) {
        // Clear existing list
        locationList.innerHTML = '';
        
        // Clear existing markers
        markers.forEach(m => map.removeLayer(m));
        markers = [];
        
        // Custom marker icon to match theme
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #0f172a; box-shadow: 0 0 10px rgba(59, 130, 246, 0.8);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        locations.forEach(loc => {
            // Render list item
            const li = document.createElement('li');
            li.className = 'location-item';
            
            const dateStr = new Date(loc.timestamp).toLocaleString();
            const latStr = parseFloat(loc.latitude).toFixed(4);
            const lngStr = parseFloat(loc.longitude).toFixed(4);
            
            li.innerHTML = `
                <div>
                    <div class="loc-coords">Lat: ${latStr}, Lng: ${lngStr}</div>
                    <div class="loc-time">${dateStr}</div>
                </div>
            `;
            
            // Map pin click handler
            li.addEventListener('click', () => {
                map.flyTo([loc.latitude, loc.longitude], 15, { duration: 1.5 });
            });
            
            locationList.appendChild(li);

            // Add marker to map
            const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon })
                .bindPopup(`<b>Logged At:</b><br>${dateStr}<br>[${latStr}, ${lngStr}]`);
            
            marker.addTo(map);
            markers.push(marker);
        });
    }
});
