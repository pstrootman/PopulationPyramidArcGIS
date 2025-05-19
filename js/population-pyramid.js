// DOM Elements
const ctx = document.getElementById('populationPyramidChart').getContext('2d');
let pyramidChart;
let allYearsData = []; // To store data for potentially multiple years
let currentYearIndex = 0;
let animationInterval;
let isPlaying = false;
let countryList = [];

const countrySelector = document.getElementById('countrySelector');
const playPauseButton = document.getElementById('playPauseButton');
const yearSlider = document.getElementById('yearSlider');
const currentYearDisplay = document.getElementById('currentYearDisplay');
const dataSourceInfo = document.getElementById('dataSourceInfo');
const messageBox = document.getElementById('messageBox');
const controlsContainer = document.getElementById('controlsContainer');
const sliderComponents = document.getElementById('sliderComponents');
const sliderMinYear = document.getElementById('sliderMinYear');
const sliderMaxYear = document.getElementById('sliderMaxYear');
const loadingIndicator = document.getElementById('loadingIndicator');

// Utility Functions
function showMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700', 'bg-blue-100', 'text-blue-700');
    if (type === 'success') {
        messageBox.classList.add('bg-green-100', 'text-green-700');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-100', 'text-red-700');
    } else { // info
        messageBox.classList.add('bg-blue-100', 'text-blue-700');
    }
    messageBox.classList.remove('hidden');
    setTimeout(() => messageBox.classList.add('hidden'), 3000);
}

function showLoading(show = true) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

function processRawData(rawData) {
    // Assuming rawData is the direct JSON content for one country/year
    // or an array of such objects if you adapt for multiple years in one file.
    
    // Reverse the array to have youngest ages at bottom
    const reversedData = [...rawData.data].reverse();
    
    const yearData = {
        year: rawData.year,
        country: rawData.country,
        ageGroups: reversedData.map(d => d.ageGroup),
        male: reversedData.map(d => d.male),
        female: reversedData.map(d => d.female)
    };
    return [yearData]; // Return as an array for consistency with multi-year potential
}

// Chart Functions
function initializeChart(dataIndex) {
    if (!allYearsData || allYearsData.length === 0 || dataIndex < 0 || dataIndex >= allYearsData.length) {
        showMessage('No data available to display chart.', 'error');
        dataSourceInfo.textContent = "Error: Could not load data.";
        currentYearDisplay.textContent = "Year: ---";
        return;
    }

    const currentData = allYearsData[dataIndex];
    currentYearDisplay.textContent = `Year: ${currentData.year}`;
    dataSourceInfo.textContent = `Data for \"${currentData.country}\"`;
    yearSlider.value = dataIndex;

    const maleDataNegative = currentData.male.map(val => -val);

    if (pyramidChart) {
        pyramidChart.destroy();
    }

    pyramidChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: currentData.ageGroups, // Y-axis labels (age groups)
            datasets: [
                {
                    label: 'Male',
                    data: maleDataNegative, // Negative for left side
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    barPercentage: 0.9,
                    categoryPercentage: 0.9,
                },
                {
                    label: 'Female',
                    data: currentData.female,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)', // Pink
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    barPercentage: 0.9,
                    categoryPercentage: 0.9,
                }
            ]
        },
        options: {
            indexAxis: 'y', // Horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            layout: { // Added this section to extend white background left/right
                padding: {
                    left: 200,
                    right: 200
                }
            },
            scales: {
                x: {
                    stacked: false,
                    ticks: {
                        callback: function(value) { return Math.abs(value); } // Show absolute values
                    },
                    title: {
                        display: true,
                        text: 'Population' // Updated axis title
                    }
                },
                y: {
                    stacked: true, 
                    reverse: false, // Youngest at bottom
                    title: {
                        display: true,
                        text: 'Age Group'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.x !== null) {
                                label += Math.abs(context.parsed.x).toLocaleString(); // Format with commas
                            }
                            return label;
                        }
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            animation: {
                duration: 800,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function updateChartForAnimation(dataIndex) {
    if (dataIndex < 0 || dataIndex >= allYearsData.length) return;
    currentYearIndex = dataIndex;
    const data = allYearsData[currentYearIndex];

    currentYearDisplay.textContent = `Year: ${data.year}`;
    yearSlider.value = currentYearIndex;

    pyramidChart.data.labels = data.ageGroups;
    pyramidChart.data.datasets[0].data = data.male.map(val => -val);
    pyramidChart.data.datasets[1].data = data.female;
    pyramidChart.update();
}

// Animation Controls
function startAnimation() {
    if (isPlaying || allYearsData.length <= 1) return;
    isPlaying = true;
    playPauseButton.textContent = 'Pause';
    playPauseButton.classList.replace('bg-blue-500', 'bg-red-500');
    playPauseButton.classList.replace('hover:bg-blue-600', 'hover:bg-red-600');

    animationInterval = setInterval(() => {
        currentYearIndex = (currentYearIndex + 1) % allYearsData.length;
        updateChartForAnimation(currentYearIndex);
    }, 2000);
    showMessage('Animation started!', 'info');
}

function stopAnimation() {
    if (!isPlaying) return;
    isPlaying = false;
    playPauseButton.textContent = 'Play';
    playPauseButton.classList.replace('bg-red-500', 'bg-blue-500');
    playPauseButton.classList.replace('hover:bg-red-600', 'hover:bg-blue-600');
    clearInterval(animationInterval);
    showMessage('Animation paused.', 'info');
}

function setupControls() {
    if (allYearsData.length <= 1) {
        playPauseButton.classList.add('hidden-controls');
        sliderComponents.classList.add('hidden-controls');
        if (allYearsData.length === 1) {
            currentYearDisplay.textContent = `Year: ${allYearsData[0].year}`;
            dataSourceInfo.textContent = `Data for \"${allYearsData[0].country}\"`;
        }
    } else {
        playPauseButton.classList.remove('hidden-controls');
        sliderComponents.classList.remove('hidden-controls');
        yearSlider.max = allYearsData.length - 1;
        yearSlider.value = currentYearIndex;
        sliderMinYear.textContent = allYearsData[0].year;
        sliderMaxYear.textContent = allYearsData[allYearsData.length - 1].year;

        playPauseButton.addEventListener('click', () => {
            if (isPlaying) stopAnimation();
            else startAnimation();
        });

        yearSlider.addEventListener('input', (event) => {
            stopAnimation();
            const newIndex = parseInt(event.target.value, 10);
            if (newIndex !== currentYearIndex) {
                updateChartForAnimation(newIndex);
            }
        });
    }
}

// Data Loading
async function loadAndDisplayChart(countryName = 'Algeria') {
    showLoading(true);
    try {
        const jsonFilePath = `data/${countryName.replace(/ /g, '_')}_pyramid.json`;
        const response = await fetch(jsonFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not fetch ${jsonFilePath}`);
        }
        const rawData = await response.json();
        allYearsData = processRawData(rawData); 

        const params = new URLSearchParams(window.location.search);
        const yearParam = params.get('year');
        if (yearParam && allYearsData.length > 0) {
            const requestedYear = parseInt(yearParam, 10);
            const foundIndex = allYearsData.findIndex(d => d.year === requestedYear);
            if (foundIndex !== -1) {
                currentYearIndex = foundIndex;
            } else {
                showMessage(`Year ${yearParam} not found in dataset. Defaulting to first available year.`, 'error');
            }
        }
        
        initializeChart(currentYearIndex);
        setupControls();
        showLoading(false);

    } catch (error) {
        console.error("Error loading or processing chart data:", error);
        showMessage(`Error: ${error.message}`, 'error');
        dataSourceInfo.textContent = "Error: Could not load data.";
        currentYearDisplay.textContent = "Year: ---";
        controlsContainer.classList.add('hidden-controls');
        showLoading(false);
    }
}

// Country List Loading
async function loadCountryList() {
    try {
        const response = await fetch('data/country_list.json');
        if (!response.ok) {
            throw new Error('Could not load country list');
        }
        countryList = await response.json();
        
        countrySelector.innerHTML = '<option value=\"\">Select a country</option>';
        countryList.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country.replace(/_/g, ' ');
            countrySelector.appendChild(option);
        });

        const params = new URLSearchParams(window.location.search);
        const countryParam = params.get('country');
        if (countryParam && countryList.includes(countryParam)) {
            countrySelector.value = countryParam;
            loadAndDisplayChart(countryParam);
        } else {
            const defaultCountry = countryList.includes('Algeria') ? 'Algeria' : countryList[0];
            countrySelector.value = defaultCountry;
            loadAndDisplayChart(defaultCountry);
        }
    } catch (error) {
        console.error("Error loading country list:", error);
        showMessage('Could not load country list. Using default country.', 'error');
        loadAndDisplayChart('Algeria'); 
    }
}

// Event Handlers
function setupEventListeners() {
    countrySelector.addEventListener('change', (event) => {
        const selectedCountry = event.target.value;
        if (selectedCountry) {
            const url = new URL(window.location);
            url.searchParams.set('country', selectedCountry);
            window.history.pushState({}, '', url);
            
            loadAndDisplayChart(selectedCountry);
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (pyramidChart) {
                pyramidChart.resize();
            }
        }, 250);
    });
}

// Initialization
window.onload = function() {
    setupEventListeners();
    loadCountryList();
};

