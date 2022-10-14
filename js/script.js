/* Me quedé en la linea 73, makeString() */

loadBtnEvents();

function loadBtnEvents(){
    let addBtn = document.getElementById("add-button");
    addBtn.onclick = addOneRow;
    
    let copyBtn = document.getElementById("copy-button");
    copyBtn.onclick = copyToClipboard;
}

function addOneRow() {
    let mainSection = document.getElementById("main-section")
    mainSection.removeChild(mainSection.lastElementChild);
    mainSection.append(createElementFromHTML(getHTMLRow()))
    mainSection.append(createElementFromHTML(getHTMLBtn()))
    loadBtnEvents();
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function getHTMLRow(unit=1,section="",icon="URL") {
    return `
    <section class="table-row">
        <datalist id="sections">
            <option> Prácticas </option>
            <option> Apuntes </option>
            <option> Videos </option>
        </datalist>
        <input class="table-item unit" type="number" value="${unit}"/>
        <input class="table-item section" type="text" list="sections" value="${section}"/>
        <input class="table-item url" type="text"/>
        <input class="table-item title" type="text"/>
        <select class="table-item icon">
            <option value="URL">URL</option>
            <option value="YouTube">YouTube</option>
            <option value="PDF">PDF</option>
            <option value="Geogebra">Geogebra</option>
            <option value="Vibby">Vibby</option>
            <option value="Pagina">Página</option>
            <option value="Gdocs">Gdocs</option>
            <option value="Busqueda">Búsqueda</option>
        </select> 
    </section>
    `
}

function getHTMLBtn(){
    return `
    <section class="button-section">
        <button class="action-button" id="add-button">+</button>
        <button class="action-button" id="copy-button">Copiar</button>
    </section>
    `
}

function copyToClipboard() {
    let string = makeString();
    navigator.clipboard.writeText(string)
    .then(() => {
        let btn = document.getElementById("copy-button");
        btn.style.backgroundColor = "rgb(125, 255, 132)";
        btn.innerHTML = "Copiado!";

        setInterval(()=>{
            btn.style.backgroundColor = null;
            btn.innerHTML = "Copiar";
        }
        ,2000)

    });
}
  
function makeString(){
    const rowCollect = document.getElementsByClassName("table-row");
    const sectionArray = []
    let unit = rowCollect[0].children[1].value
    let finalString = `<div id="accordion">`

    Object.values(rowCollect).forEach((elem) => {
        let section = elem.children[2].value
        sectionArray.includes(section) || sectionArray.push(section) 
    })

    let sectionCounter = 0;
    sectionArray.forEach((section)=>{
        sectionCounter ++;
        sectionString = `
        <div>
            <a href="#collapse-${unit}-${sectionCounter}" data-toggle="collapse" class="collapsed">
                <div class="alert alert-secondary rounded">
                    <h6 class="text-dark m-0">${section} ▼</h6>
                </div>
            </a>
            <div id="collapse-${unit}-${sectionCounter}" class="mt-1 ml-2 mb-3 pl-1 collapse">
        `
        let itemString = "";
        Object.values(rowCollect).map((thisRow) => {
            let values= Object.values(thisRow.children).map((it) => it.value);
            values.shift();
            let url=values[2];
            let title=values[3];
            let icon=urlIcon(values[4]);
            if (section === values[1]){
                itemString += `<div class="mb-1"><a href="${url}"><img width="24" height="24" src="${icon}"> ${title}</a></div>`
            }
        });
        sectionString += itemString
        sectionString += `
            </div>
        </div>
        `
        finalString += sectionString
    })
    finalString += `</div>`
    return finalString;
}

function urlIcon (type) {
    switch (type){
        case 'YouTube':
            return "https://icons.iconarchive.com/icons/dakirby309/simply-styled/24/YouTube-icon.png";
        case 'Pagina':
            return "https://qoodle.uvq.edu.ar/theme/image.php/unq/page/1650257090/icon";
        case 'URL':
            return "https://qoodle.uvq.edu.ar/theme/image.php/unq/url/1650257090/icon";
        case 'PDF':
            return "https://qoodle.uvq.edu.ar/theme/image.php/unq/core/1650257090/f/pdf-24";
        case 'Busqueda':
            return "https://img.icons8.com/external-bearicons-flat-bearicons/24/FA5252/external-find-call-to-action-bearicons-flat-bearicons.png";
        case 'Gdocs':
            return "https://icons.iconarchive.com/icons/papirus-team/papirus-apps/24/google-docs-icon.png";
        case 'Geogebra':
            return "https://icons.iconarchive.com/icons/papirus-team/papirus-apps/24/geogebra-icon.png";
        case 'Vibby':
            return "https://www.vibby.com/vibby/img/favicon.ico";
    };
}