
const countriesContainer = document.getElementById("countries");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const searchInput = document.getElementById("search");

let countriesData = [];

async function fetchCountries() {
    loading.textContent = "Loading countries...";
    loading.style.display = "block";
    error.textContent = "";
    countriesContainer.innerHTML = "";

    try {
        const response = await fetch(
            "https://api.worldbank.org/v2/country?format=json&per_page=300"
        );

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        if (!data[1] || data[1].length === 0) {
            throw new Error("No data available");
        }

        countriesData = data[1].filter(
            country => country.region.value !== "Aggregates"
        );

        loading.style.display = "none";
        displayCountries(countriesData);

    } catch (err) {
        loading.style.display = "none";
        error.textContent =
            "Unable to load countries. Please try again.";
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

        const name = document.createElement("h2");
        name.textContent = country.name;

        const flag = document.createElement("h1");
        const code = country.iso2Code;

        flag.textContent = code
            ? String.fromCodePoint(
                ...[...code].map(
                    char => 127397 + char.charCodeAt(0)
                )
              )
            : "🌍";

        const capital = document.createElement("p");
        capital.textContent =
            "Capital: " + (country.capitalCity || "N/A");

        const region = document.createElement("p");
        region.textContent =
            "Region: " + country.region.value;

        card.append(flag, name, capital, region);
        countriesContainer.appendChild(card);
    });
}

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = countriesData.filter(country =>
        country.name.toLowerCase().includes(value)
    );

    displayCountries(filtered);
});

fetchCountries();

