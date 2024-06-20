const passwordDisplay = document.querySelector("#passwordDisplay");
const slider = document.querySelector("#data-length-slider");
const length = document.querySelector("#data-length");
const copyMsg = document.querySelector("#copyMsg");
const copyContainer = document.querySelector("#copyContainer");
const copyImg = document.querySelector("#copyImg");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const generateBtn = document.querySelector("#generateBtn");
const indicator = document.querySelector("#indicator");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");
const symbolList = "~`!@#$%^&*()_+-={}[]|:;',<.>/?"

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set password length
function handleSlider(){
    slider.value = passwordLength;
    length.innerText = passwordLength;
}

// set colour of strength
function setIndicator(color){
    indicator.style.backgroundColor = color;
}

// get random integer between min and max
function getRndInteger(min, max){
    // console.log(Math.floor(Math.random()*(max - min) + min));
    return Math.floor(Math.random()*(max - min) + min); 
}

// returns random integer
function getRandomNumber(){
    return getRndInteger(0,9);
}

// returns lower character
function getLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

// returns upper character
function getUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

// returns symbol character
function getSymbol(){
    const leng = symbolList.length;
    const rnd = getRandomNumber(0, leng);
    return symbolList.charAt(rnd);
}

// a method to calculate strength
function calcStrength(){

    let hasUp = false;
    let hasLow = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercase.checked) hasUp = true;
    if(lowercase.checked) hasLow = true;
    if(numbers.checked) hasNum = true;
    if(symbols.checked) hasSym = true;

    if((hasUp && hasLow) && (hasNum && hasSym)){
        setIndicator('rgb(163 230 53)');
    }
    else if((hasUp || hasLow) && (!hasNum && !hasSym)){
        setIndicator('rgb(220 30 30)');
    }
    else if(((hasUp || !hasLow) && (!hasNum || hasSym) )||(( !hasUp || hasLow) && (hasNum || !hasSym))){
        setIndicator('rgb(252 211 77)');
    }
    else{
        setIndicator('rgb(220 30 30)');
    }
}

// shuffle password
function shuffle(array){
    for (let i = array.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = array[i];
        array[i] = array[j];
        array[j] = k;
      }
      return array.join("");
}

// copy content of passwordDisplay to clipboard
async function copyContent(){
    if(passwordDisplay.value == "") return;
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.classList.remove("hidden");
    copyImg.classList.add("hidden");
    setTimeout(() => {
        copyMsg.classList.add("hidden");
        copyImg.classList.remove("hidden");
    }, 1000);
}

// if checked boxes changes, count all checkboxes that are checked
function handleCheckBoxes(){
    checkCount = 0;
    allCheckBoxes.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    // special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// when move slider password length value change
slider.addEventListener('input', () => {
    passwordLength = slider.value;
    handleSlider();
})

// when clicked on copy button
copyContainer.addEventListener('click', ()=> {
    if(passwordDisplay.value) {
        copyContent();  // call fn to copy to clipboard
    }
})

// generate password
generateBtn.addEventListener('click', () => {
    handleCheckBoxes();
    if(checkCount == 0){
        passwordDisplay.value = "";
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password
    password = "";


    let functarr = [];
    if(uppercase.checked){
        functarr.push(getUpperCase);
    }
    if(lowercase.checked){
        functarr.push(getLowerCase);
    }
    if(numbers.checked){
        functarr.push(getRandomNumber);
    }
    if(symbols.checked){
        functarr.push(getSymbol);
    }

    // compulsory length
    functarr.forEach(element => {
        password += element();
    });
    
    console.log(functarr);
    // remaining length
    for(let i=0; i<passwordLength - functarr.length; i++){
        let randIdx = getRndInteger(0, functarr.length);
        console.log(randIdx);
        password += functarr[randIdx]();
    }

    // shuffle the password
    password = shuffle(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();

    console.log(password);

});