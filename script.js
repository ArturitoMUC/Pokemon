let currentPokemon = [];
index = 0;

let colors = {
    fire: 'rgba(255, 102, 0)',
    water: 'rgba(0, 102, 204)',
    grass: 'rgba(51, 153, 102)',
    bug: 'rgba(153, 204, 0)',
    normal: 'rgba(153, 102, 102)',
    poison: 'rgba(204, 0, 204)',
    electric: 'rgba(255, 204, 0)',
    ground: 'rgba(204, 102, 0)',
    fairy: 'rgba(255, 153, 153)',
    fighting: 'rgba(204, 51, 0)',
    psychic: 'rgba(255, 0, 255)',
    steel: 'rgba(102, 102, 102)',
    dragon: 'rgba(102, 0, 102)',
    dark: 'rgba(51, 51, 51)',
    ice: 'rgba(0, 153, 204)',
    rock: 'rgba(153, 102, 0)',
    ghost: 'rgba(204, 153, 204)',
    unknown: 'rgba(153, 102, 102)',
    flying: 'rgba(102, 0, 102)',
};


async function init() {
    for (i = 1; i < 21; i++) {
        await loadPokemonArray(i);
    }
    document.querySelector('.loader').style.display = 'none';
    showPokemonOverview();
}

async function loadPokemonArray(i) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    pokemon = await response.json();
    currentPokemon.push(pokemon);
}

function searchPokemon() {
    let search = document.getElementById('pokemon-input').value.toLowerCase();
    document.getElementById('overviewContainer').innerHTML = '';

    for (let i = 0; i < currentPokemon.length; i++) {
        let name = currentPokemon[i]['name'];
        let image = currentPokemon[i]['sprites']['other']['home']['front_default'];
        let type = currentPokemon[i]["types"][0]["type"]["name"];
        let bgColor = colors[type];

        if (name.toLowerCase().includes(search) || type.toLowerCase().includes(search)) {
            document.getElementById('overviewContainer').innerHTML += showPokemon(i, name, image, type);
            document.getElementById(`small_card_${i}`).style.backgroundColor = bgColor;
            document.getElementById('button').hidden = true;
        }
    }
}

function showPokemonOverview() {

    document.getElementById('overviewContainer').innerHTML = '';

    for (i = 0; i < currentPokemon.length; i++) {
        let name = currentPokemon[i]['name'];
        let image = currentPokemon[i]['sprites']['other']['home']['front_default'];
        let type = currentPokemon[i]["types"][0]["type"]["name"];
        let bgColor = colors[type];
        document.getElementById('overviewContainer').innerHTML += showPokemon(i, name, image, type);
        document.getElementById(`small_card_${i}`).style.backgroundColor = bgColor;
    }
}

function showPokemon(i, name, image, type) {
    return /*HTML*/ `      
        <div id="small_card_${i}" class="small-card" onclick="openCard(${i})">
            <div>
                <div class="name">${name}</div>
                <div class="type">${type}</div>
            </div>
             <div>
                <img src="${image}" class="image-small-card">
            </div>
        </div>`;
}

function openCard(i) {
    document.getElementById('card').classList.remove('hideCard');
    document.getElementById('cardInside').classList.remove('hideCardInside');
    document.getElementById('button').hidden = true;

    let name = currentPokemon[i]['name'];
    let id = currentPokemon[i]['id'];
    let image = currentPokemon[i]['sprites']['other']['home']['front_default'];
    let types = currentPokemon[i]["types"][0]["type"]["name"];
    let specie = currentPokemon[i]['species']['name'];
    let height = currentPokemon[i]['height'];
    let cmHeight = height * 10;
    let weight = currentPokemon[i]['weight'];
    let kgWeight = weight / 10;
    let bgColor = colors[types];

    document.getElementById('cardInside').style.backgroundColor = bgColor;
    document.getElementById('pokedex').innerHTML = openCardDetails(name, id, image, specie, cmHeight, kgWeight);
    showBaseStats(bgColor, i);
}

function openCardDetails(name, id, image, specie, cmHeight, kgWeight) {
    return /*HTML*/ `
        <div class="closeButton"><img src="./img/close.png" class="imageCloseButton" onclick="closeCard()"></div>
        <div class="switchButtons"><img src="./img/left.png" class="imageswitchButtons" onclick="prevCard()"><img src="./img/right.png" class="imageswitchButtons" onclick="nextCard()"></div>
        <h1 id="pokemonName"><div>${name}</div><div>#${id}</div></h1>             
        <img id="pokemonImage" class="pokemonImage" src="${image}">    
        <div class="declarations">
                <table>
                    <tr>
                        <td>Species</td>
                        <td id="infoContName">${specie}</td>
                    </tr>
                    <tr>
                        <td>Height</td>
                        <td id="pokemonHeight">${cmHeight} cm</td>
                    </tr>
                    <tr>
                        <td>Weight</td>
                        <td id="pokemonWeight">${kgWeight} kg</td>
                    </tr>
                </table>
            <table id="stats"></table>
        </div> `;
}

function showBaseStats(bgColor, i) {
    index = i;
    document.getElementById('stats').innerHTML = '';
    for (let i = 0; i < currentPokemon[index]['stats'].length; i++) {
        let statName = currentPokemon[index]['stats'][i]['stat']['name'];
        let stat = currentPokemon[index]['stats'][i]['base_stat'];
        document.getElementById('stats').innerHTML += statBar(statName, stat, bgColor);
    }
}

function statBar(statName, stat, bgColor) {
    return /*HTML*/ `
        <tr>
            <td>${statName}</td>
            <td>
                 <svg width="140" height="30">
                    <rect x="0" y="10" width="140" height="15" rx="4" ry="4" fill="#ccc"/>
                    <rect x="0" y="10" width="140" height="15" rx="4" ry="4" fill="${bgColor}">
                        <animate attributeName="width" from="0" to="${stat}" dur="1s" fill="freeze"/>
                    </rect>
                </svg>
            </td>
        </tr> `
}

function prevCard() {
    index -= 1;
    if (index < 0) {
        index = currentPokemon.length - 1;
    }
    openCard(index);
}

function nextCard() {
    index += 1;
    if (index >= currentPokemon.length) {
        index = 0;
    }
    openCard(index);
}

async function showMore() {

    document.querySelector('.loader').style.display = '';

    let currentIndex = currentPokemon.length + 1;
    for (let i = currentIndex; i < currentIndex + 20; i++) {
        await loadPokemonArray(i);
    }
    document.querySelector('.loader').style.display = 'none';
    showPokemonOverview();
}

function closeCard() {
    document.getElementById('card').classList.add('hideCard');
    document.getElementById('cardInside').classList.add('hideCardInside');
    document.getElementById('button').hidden = false;
}

function resetOverview() {
    document.getElementById('pokemon-input').value = '';
    document.getElementById('overviewContainer').innerHTML = '';
    currentPokemon.length = 0;
    init();
    document.getElementById('button').hidden = false;
}