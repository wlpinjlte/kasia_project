const api_url = "https://restcountries.com/v3.1/all";
let subregionDivArray=[];
let currPage=1;
let regionsPerPage=Math.round($(document).height()/60);
async function getapi() {
    try {
        const response = await fetch(api_url)
        const data = await response.json();
        return data;
    } catch(err) {
        console.error(err);
    }
}

let subregionPopulation=(array)=>{
    let populationToReturn=0;
    array.forEach(region=>{
        populationToReturn+=region.population;
    });
    return populationToReturn;
}

let subregionArea=(array)=>{
    let areaToReturn=0;
    array.forEach(region=>{
        areaToReturn+=region.area;
    });
    return areaToReturn;
}

function loadRegionsToSubregions(regionContainer,regionArray){
    regionArray.forEach(region=>{
        regionContainer.innerHTML+=`
        <div class="region">
            <p>${region.name}</p>
            <img src="${region.flag}">
            <p>${region.population}</p>
            <p>${region.area}</p>
        </div>`;
    })
}

function loadSubregions(subregion,mapForSubregions){
    let subregionDiv=document.createElement("div");
    subregionDivArray.push(subregionDiv);
    subregionDiv.classList.add("subregion");
    subregionDiv.innerHTML+=`
    <div class="data">
        <div class="arrow">⮞</div>
        <h1>${subregion}</h1>
        <h1>${subregionPopulation(mapForSubregions.get(subregion))}</h1>
        <h1>${subregionArea(mapForSubregions.get(subregion))}</h1>
    </div>
    <div class="region-container"></div>`;
    let regionContainer=subregionDiv.querySelector(".region-container");
    let openn=false;
    subregionDiv.querySelector(".data").addEventListener("click",()=>{
        let arrow=subregionDiv.querySelector(".data").querySelector("div");
        if(openn){
            regionContainer.style.maxHeight="0";
            arrow.style.transform="rotate(0deg)";
        }else{
            regionContainer.style.maxHeight="270vh";
            arrow.style.transform="rotate(90deg)";
        }
        openn=!openn;
    })
    loadRegionsToSubregions(regionContainer,mapForSubregions.get(subregion));
}

let areaComper=(a,b)=>{
    let areaA=a.querySelector(".data").querySelectorAll("h1")[2].innerText;
    let areaB=b.querySelector(".data").querySelectorAll("h1")[2].innerText;
    return areaB-areaA;
}

let populationComper=(a,b)=>{
    let populationA=a.querySelector(".data").querySelectorAll("h1")[1].innerText;
    let populationB=b.querySelector(".data").querySelectorAll("h1")[1].innerText;
    return populationB-populationA;
}
let nameComper=(a,b)=>{
    let NameA=a.querySelector(".data").querySelectorAll("h1")[0].innerText;
    let NameB=b.querySelector(".data").querySelectorAll("h1")[0].innerText;
    if(NameA>NameB){
        return 1;
    }
    if(NameB>NameA){
        return -1;
    }
    return 0;
}
function displaySubregions(){
    let subregionContainer=document.querySelector("#subregions-container");
    subregionContainer.innerHTML="";
    for(let i=currPage*regionsPerPage;i<Math.min(regionsPerPage*(currPage+1),subregionDivArray.length);i++){
        subregionContainer.appendChild(subregionDivArray[i]);
    }
}

function footerdisplay(){
    let footer=document.querySelector("footer");
    for(let i=0;i<Math.ceil(subregionDivArray.length/regionsPerPage);i++){
        let pageDiv=document.createElement("div");
        pageDiv.classList.add("number");
        pageDiv.innerText=i+1;
        pageDiv.addEventListener("click",()=>{
            changeCurrPage(pageDiv.innerText-1);
            displaySubregions();
        })
        footer.appendChild(pageDiv)
    }
}
function changeCurrPage(pageToChange){
    let footerChild=document.querySelector("footer").querySelectorAll("div");
    console.log(footerChild)
    footerChild.forEach(number=>{
        console.log(number.innerText)
        if(number.innerText-1==currPage){
            number.classList.remove("currPageDown");
        }
        if(number.innerText-1==pageToChange){
            number.classList.add("currPageDown");
        }
    })
    currPage=pageToChange;
}

function sortFunction(){
    let header=document.querySelector("header");
    let h1=header.querySelectorAll("h1");
    console.log(h1)
    let last=h1[0].querySelector("div");
    h1[0].addEventListener("click",()=>{
        last?.classList.remove("sortArrow");
        h1[0].querySelector("div").classList.add("sortArrow");
        subregionDivArray.sort((a,b)=>nameComper(a,b));
        last=h1[0].querySelector("div");
        displaySubregions();
    })
    h1[2].addEventListener("click",()=>{
        last?.classList.remove("sortArrow");
        console.log(subregionDivArray);
        h1[2].querySelector("div").classList.add("sortArrow");
        subregionDivArray.sort((a,b)=>populationComper(a,b));
        console.log(subregionDivArray);
        displaySubregions();
        last=h1[2].querySelector("div");
    })
    h1[3].addEventListener("click",()=>{
        last?.classList.remove("sortArrow");
        h1[3].querySelector("div").classList.add("sortArrow");
        subregionDivArray.sort((a,b)=>areaComper(a,b));
        last=h1[3].querySelector("div");
        displaySubregions();
    })
}
getapi().then(data=>{
    console.log(data);
    const subregions=new Set();
    const mapForSubregions=new Map();
    data.forEach(element => {
        subregions.add(element.subregion);
    });
    subregions.forEach(region=>{
        console.log(region)
        mapForSubregions.set(region,[]);
    });
    data.forEach(element=>{
        mapForSubregions.get(element.subregion).push({
            name:element.name.common,
            population:element.population,
            area:element.area,
            flag:element.flags.png
        })    
    })
    subregions.forEach(region=>{
        loadSubregions(region,mapForSubregions);
    })
    footerdisplay();
    changeCurrPage(0);
    displaySubregions();
    sortFunction();
});