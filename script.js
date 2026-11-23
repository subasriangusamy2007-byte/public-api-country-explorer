
const countriesContainer = document.getElementById("countries");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const searchInput = document.getElementById("search");

let countriesData = [];

async function fetchCountries() {
    loading.textContent = "Loading countries...";
    loading.style.display = "block";
    error.textContent = "";

    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,flags,capital,population"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch country data");
        }

        countriesData = await response.json();

        loading.style.display = "none";
        displayCountries(countriesData);

    } catch (err) {
        loading.style.display = "none";
        error.textContent = "Unable to load countries. Please try again.";
    }
}

function displayCountries(countries) {
    countriesContainer.innerHTML = "";

    if (countries.length === 0) {
        countriesContainer.textContent = "No countries found.";
        return;
    }

    countries.forEach(country => {
        const card = document.createElement("div");
        card.className = "country-card";

        card.innerHTML = `
            <img src="${country.flags.png}" alt="Country flag">
            <h2>${country.name.common}</h2>
            <p>Capital: ${country.capital?.[0] || "N/A"}</p>
            <p>Population: ${country.population.toLocaleString()}</p>
        `;

        countriesContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();

    const filteredCountries = countriesData.filter(country =>
        country.name.common.toLowerCase().includes(searchValue)
    );

    displayCountries(filteredCountries);
});

fetchCountries();
