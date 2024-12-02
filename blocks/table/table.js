import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
const placeholders = await fetchPlaceholders(getMetadata("locale"));

console.log("=====placeholders=====> {} ", placeholders);

const { allCountries, africa, america, asia, australia, europe } = placeholders;


async function createTableHeader(table) {
    // 假設我們知道第一筆資料一定存在
    const headerKeys = ['Country', 'Capital', 'Continent', 'Abbreviation'];
    
    const tr = document.createElement("tr");
    // 加入序號欄位
    const sno = document.createElement("th"); 
    sno.appendChild(document.createTextNode('No.'));
    tr.appendChild(sno);
    
    // 使用 JSON 的屬性名建立表頭
    headerKeys.forEach(key => {
        const th = document.createElement("th");
        th.appendChild(document.createTextNode(key));
        tr.appendChild(th);
    });
    
    table.appendChild(tr);
}

async function createTableRow(table, row, i) {
    let tr = document.createElement("tr");
    let sno = document.createElement("td"); sno.appendChild(document.createTextNode(i));
    let conuntry = document.createElement("td"); conuntry.appendChild(document.createTextNode(row.Country));
    let continent = document.createElement("td"); continent.appendChild(document.createTextNode(row.Capital));
    let capital = document.createElement("td"); capital.appendChild(document.createTextNode(row.Continent));
    let abbr = document.createElement("td"); abbr.appendChild(document.createTextNode(row.Abbreviation));
    tr.append(sno); tr.append(conuntry); tr.append(continent); tr.append(capital); tr.append(abbr);
    table.append(tr);
}

async function createSelectMap(jsonURL) {
    const optionsMap = new Map();
    const { pathname } = new URL(jsonURL);

    const resp = await fetch(pathname);
    optionsMap.set("all", allCountries); optionsMap.set("asia", asia); optionsMap.set("europe", europe); optionsMap.set("africa", africa); optionsMap.set("america", america); optionsMap.set("australia", australia);
    const select = document.createElement('select');
    select.id = "region";
    select.name = "region";
    optionsMap.forEach((val, key) => {
        const option = document.createElement('option');
        option.textContent = val;
        option.value = key;
        select.append(option);
    });

    const div = document.createElement('div');
    div.classList.add("region-select");
    div.append(select);
    return div;
}

async function createTable(jsonURL, val) {

    let pathname = null;
    if (val) {
        pathname = jsonURL;
    } else {
        pathname = new URL(jsonURL);
    }

    const resp = await fetch(pathname);
    const json = await resp.json();
    console.log("=====JSON=====> {} ", json);

    const table = document.createElement('table');
    createTableHeader(table);
    json.data.forEach((row, i) => {

        createTableRow(table, row, (i + 1));


    });

    return table;
}

export default async function decorate(block) {
    const countries = block.querySelector('a[href$=".json"]');
    const parientDiv = document.createElement('div');
    parientDiv.classList.add('contries-block');

    if (countries) {
        parientDiv.append(await createSelectMap(countries.href));
        parientDiv.append(await createTable(countries.href, null));
        countries.replaceWith(parientDiv);

    }
    const dropdown = document.getElementById('region');
    dropdown.addEventListener('change', () => {
        let url = countries.href;
        if (dropdown.value != 'all') {
            url = countries.href + "?sheet=" + dropdown.value;
        }
        const tableE = parientDiv.querySelector(":scope > table");
        let promise = Promise.resolve(createTable(url, dropdown.value));
        promise.then(function (val) {
            tableE.replaceWith(val);
        });
    });
}