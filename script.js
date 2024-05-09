document.addEventListener('DOMContentLoaded', function () {
    let labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    let selectedCompany = 'XYZ'; // Default company
    let data = generateRandomData();

    const companies = {
        'XYZ': {
            name: 'XYZ Corporation',
            avatar: 'https://via.placeholder.com/100',
            description: 'XYZ Corporation is a multinational conglomerate corporation.'
        },
        'ABC': {
            name: 'ABC Inc.',
            avatar: 'https://via.placeholder.com/100',
            description: 'ABC Inc. is a leading technology company specializing in artificial intelligence.'
        },
        'DEF': {
            name: 'DEF Industries',
            avatar: 'https://via.placeholder.com/100',
            description: 'DEF Industries is a manufacturing company focused on sustainable energy solutions.'
        }
    };

    const totalCompaniesElement = document.getElementById('totalCompanies');
    totalCompaniesElement.textContent = `Total Companies: ${Object.keys(companies).length}`;

    const companyListElement = document.getElementById('companyList');
    for (let company in companies) {
        const li = document.createElement('li');
        li.textContent = companies[company].name;
        li.setAttribute('data-company', company);
        companyListElement.appendChild(li);
    }
    const addCompanyForm = document.getElementById('addCompanyForm');
    addCompanyForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const companyName = document.getElementById('companyName').value.trim();
        const companySymbol = document.getElementById('companySymbol').value.trim().toUpperCase();
        const companyDescription = document.getElementById('companyDescription').value.trim();
        if (companyName && companySymbol && companyDescription && !companies.hasOwnProperty(companySymbol)) {
            companies[companySymbol] = {
                name: companyName,
                description: companyDescription
            };
            const newCompanyLi = document.createElement('li');
            newCompanyLi.textContent = `${companyName} - ${companyDescription}`;
            newCompanyLi.setAttribute('data-company', companySymbol);
            companyListElement.appendChild(newCompanyLi);
            totalCompaniesElement.textContent = `Total Companies: ${Object.keys(companies).length}`;
            addCompanyForm.reset();
        } else {
            alert('Please provide valid company details or the company already exists!');
        }
    });
    

    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${selectedCompany} Stock Price`,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: data,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Stock Price Chart',
                    color: '#333',
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month',
                        color: '#333',
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price ($)',
                        color: '#333',
                    }
                }
            }
        },
    };

    const ctx = document.getElementById('stockChart').getContext('2d');
    const myChart = new Chart(ctx, config);

    const detailsElement = document.getElementById('stockDetails');
    const avatarElement = document.getElementById('companyAvatar');
    const descriptionElement = document.getElementById('companyDescription');

    updateStockDetails(detailsElement);
    updateCompanyDetails(selectedCompany);

    companyListElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            selectedCompany = event.target.getAttribute('data-company');
            updateChartData();
            updateStockDetails(detailsElement);
            updateCompanyDetails(selectedCompany);
            // Remove 'active' class from all list items
            const allListItems = document.querySelectorAll('#companyList li');
            allListItems.forEach(item => item.classList.remove('active'));
            // Add 'active' class to clicked list item
            event.target.classList.add('active');
        }
    });

    document.getElementById('searchButton').addEventListener('click', function () {
        const searchText = document.getElementById('companySearch').value.trim().toUpperCase();
        const filteredCompany = Object.keys(companies).find(company => companies[company].name.toUpperCase().includes(searchText));
        if (filteredCompany) {
            selectedCompany = filteredCompany;
            updateChartData();
            updateStockDetails(detailsElement);
            updateCompanyDetails(selectedCompany);
            // Remove 'active' class from all list items
            const allListItems = document.querySelectorAll('#companyList li');
            allListItems.forEach(item => item.classList.remove('active'));
            // Add 'active' class to list item corresponding to filtered company
            const listItem = document.querySelector(`#companyList li[data-company="${filteredCompany}"]`);
            if (listItem) {
                listItem.classList.add('active');
            }
        }
    });

    const nightModeButton = document.getElementById('nightModeButton');
    nightModeButton.addEventListener('click', function () {
        document.body.classList.toggle('night-mode');
        document.getElementById('container').classList.toggle('night-mode');
        if (document.body.classList.contains('night-mode')) {
            myChart.options.plugins.title.color = '#fff';
            myChart.options.scales.x.title.color = '#fff';
            myChart.options.scales.y.title.color = '#fff';
            myChart.data.datasets[0].backgroundColor = 'rgba(0, 0, 0, 0.2)';
            myChart.data.datasets[0].borderColor = '#fff';
        } else {
            myChart.options.plugins.title.color = '#333';
            myChart.options.scales.x.title.color = '#333';
            myChart.options.scales.y.title.color = '#333';
            myChart.data.datasets[0].backgroundColor = 'rgba(54, 162, 235, 0.2)';
            myChart.data.datasets[0].borderColor = 'rgba(54, 162, 235, 1)';
        }
        myChart.update();
    });

    function updateChartData() {
        data = generateRandomData();
        myChart.data.datasets[0].data = data;
        myChart.data.datasets[0].label = `${selectedCompany} Stock Price`;
        myChart.update();
    }

    function updateStockDetails(element) {
        element.innerHTML = `
            <h2>Stock Details</h2>
            <p>Company: ${companies[selectedCompany].name}</p>
            <p>Symbol: ${selectedCompany}</p>
            <p>Current Price: $${data[data.length - 1]}</p>
            <p>Change: ${getRandomChange()} (${getRandomPercentage()}%)</p>
            <p>Volume: ${getRandomVolume()}</p>
            <p>Market Cap: $${getRandomMarketCap()}</p>
        `;
    }

    function updateCompanyDetails(company) {
        avatarElement.src = companies[company].avatar;
        descriptionElement.textContent = companies[company].description;
    }

    function generateRandomData() {
        let newData = [];
        for (let i = 0; i < labels.length; i++) {
            newData.push(Math.floor(Math.random() * 100) + 50);
        }
        return newData;
    }

    function getRandomChange() {
        return (Math.random() * 20 - 10).toFixed(2);
    }

    function getRandomPercentage() {
        return (Math.random() * 5).toFixed(2);
    }

    function getRandomVolume() {
        return Math.floor(Math.random() * 1000000) + 500000;
    }

    function getRandomMarketCap() {
        return Math.floor(Math.random() * 1000000000) + 100000000;
    }
});
