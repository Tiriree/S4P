document.addEventListener('DOMContentLoaded', function() {
    const syllabusLink = document.getElementById('syllabus-link');
    const symposiumLink = document.getElementById('symposium-link');
    const peopleToggle = document.getElementById('people-toggle');
    const peopleGrid = document.getElementById('people-grid');
    const interactiveToggle = document.getElementById('interactive-toggle');
    const marquee = document.getElementById('marquee');
    const marqueeContent = document.querySelector('.marquee-content');
    
    const syllabusData = links.find(link => link.title === 'Syllabus');
    const symposiumData = links.find(link => link.title === 'Symposium');
    
    let livePeopleData = [];
    const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRQzUET79RrIF13U7zjfHrvfJbkiQieZAxYnLJoJzPkQWnEByvqitaJjkghPoAPYNPpTjPV9rens_xs/pub?output=tsv';
    
    if (syllabusData) {
        syllabusLink.addEventListener('click', function() {
            window.open(syllabusData.url, '_blank');
        });
    }
    
    if (symposiumData) {
        symposiumLink.addEventListener('click', function() {
            window.open(symposiumData.url, '_blank');
        });
    }
    
    // Fetch people data from Google Sheets
    async function fetchPeopleData() {
        try {
            const response = await fetch(SHEETS_URL);
            const tsvData = await response.text();
            
            // Parse TSV data
            const lines = tsvData.trim().split('\n');
            const peopleData = [];
            
            // Skip header row and process data
            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split('\t');
                if (columns.length >= 2 && columns[0].trim() && columns[1].trim()) {
                    peopleData.push({
                        name: columns[0].trim(),
                        url: columns[1].trim()
                    });
                }
            }
            
            livePeopleData = peopleData;
            console.log('Successfully loaded', peopleData.length, 'people from Google Sheets:', livePeopleData);
            
        } catch (error) {
            console.error('Failed to fetch people data from Google Sheets:', error);
            livePeopleData = people; // Fallback to sample data
        }
    }
    
    // People grid functionality
    peopleToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        peopleGrid.classList.toggle('hidden');
        if (!peopleGrid.classList.contains('hidden')) {
            renderPeopleGrid(); // Always re-render to get latest data
        }
    });
    
    // Interactive marquee functionality
    interactiveToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        marqueeContent.textContent = window.marquee || "Welcome to the class!!!";
        marquee.classList.remove('hidden');
    });
    
    // Hide marquee when clicking anywhere
    document.addEventListener('click', function(e) {
        if (!marquee.classList.contains('hidden')) {
            marquee.classList.add('hidden');
        }
    });
    
    // Hide people grid when clicking outside
    document.addEventListener('click', function(e) {
        if (!peopleGrid.contains(e.target) && e.target !== peopleToggle) {
            peopleGrid.classList.add('hidden');
        }
    });
    
    // Prevent clicks inside the grid from closing it
    peopleGrid.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    function renderPeopleGrid() {
        peopleGrid.innerHTML = '';
        const dataToUse = livePeopleData.length > 0 ? livePeopleData : people;
        
        dataToUse.forEach(person => {
            const personBox = document.createElement('div');
            personBox.className = 'person-box';
            personBox.textContent = person.name;
            personBox.addEventListener('click', function() {
                window.open(person.url, '_blank');
            });
            peopleGrid.appendChild(personBox);
        });
    }
    
    // Semester links functionality
    const semesterLinkElements = document.querySelectorAll('.semester-link');
    semesterLinkElements.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const semester = this.dataset.semester;
            const url = semesterLinks[semester];
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        });
    });
    
    // Load people data on page load
    fetchPeopleData();
});