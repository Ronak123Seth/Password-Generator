const slider = document.querySelector("[dataLengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]") 
const passwordDisplay = document.querySelector(".display")
const copyMsg = document.querySelector("[data-copyMsg]")
const copyBtn = document.querySelector("[copy-btn]")
const uppercase = document.querySelector("#uppercase")
const lowercase = document.querySelector("#lowercase")
const number = document.querySelector("#number")
const symbol = document.querySelector("#symbol")
const indicator = document.querySelector("[data-indicator]")
const generate = document.querySelector(".generate")
const allCheckBox = document.querySelectorAll("input[type = checkbox]")

let password = "";
let passwordLength = 10;
let  checkCount = 0;
//set strength circle to grey
//copy msg
//handleSlider
//generatePassword
//setIndicator
//getRandomUpper, lower,number,symbol
handleSlider(); 

function handleSlider() {
    slider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = slider.min;
    console.log(min)
    const max = slider.max;
    console.log(max)
    let per = ((slider.value - min) / (max - min)) * 100;
    slider.style.backgroundSize = `${per}% 100%`;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = '0px 0px 25px 5px' + color
}
setIndicator("#ccc");
function getRndInt(min,max){
    return Math.floor(Math.random() * (max-min) + min);
}
function getNumber(){
    return getRndInt(0,9);
}
function getUpper(){
    return String.fromCharCode(getRndInt(65,90));
}
function getLower(){
    return String.fromCharCode(getRndInt(97,122));
}
sym = "!@#$%^&*~|-+.";
function getSymbol(){
    return sym[getRndInt(0,12)];
}

function calcStrength(){
    let upper = false;
    let lower = false;
    let num = false;
    let sym = false;
    if(uppercase.checked)
        upper = true;
    if(lowercase.checked)
        lower = true;
    if(number.checked)
        num = true;
    if(symbol.checked)
        sym = true;
    if(upper && lower && num || sym && passwordLength>8){
        setIndicator("#0f0");
    }else if((lower || upper) && (num || sym) && passwordLength > 5){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);  
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() =>{copyMsg.classList.remove("active");},2000);
}

slider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click",(e) => {
    if(passwordDisplay.value)
        copyContent();
})

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++; 
    })
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckboxChange);
})

function shufflePassword(array){
    //Fisher Yates Method 
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((i) => {str+=i;});
    return str;
}

generate.addEventListener("click",(e) => {
    if(checkCount <= 0) return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    
    let funcArr = [];
    if(uppercase.checked)
        funcArr.push(getUpper);
    if(lowercase.checked)
        funcArr.push(getLower);
    if(number.checked)
        funcArr.push(getNumber);
    if(symbol.checked)
        funcArr.push(getSymbol);
    for(let i=0; i<funcArr.length; i++){
        password = password + funcArr[i]();
    }
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let rndIdx = getRndInt(0,funcArr.length);
        password = password + funcArr[rndIdx]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    calcStrength();
})
 