"use strict";

window.addEventListener("keydown", (e) => {
    if (e.key === 'Enter' && e.isTrusted) {
        calculate();
    }
});

function showPopup(id) {
    let elem = document.getElementById(id);
    elem.style.display = 'grid';
}

function closePopup(id) {
    let elem = document.getElementById(id);
    elem.style.display = 'none';
}

function calculate() {
    let savingPeriod = parseInt(document.getElementById("calculator-saving-period").value);
    let monthlySaving = parseInt(document.getElementById("calculator-saving-monthly_saving").value);
    let savingRate = parseFloat(document.getElementById("calculator-saving-saving_rate").value)/1200;

    let currentMonth = 0;
    let currentSaving = 0;
    let currentInterest = 0;

    let doLoop = true;

    if (isNaN(savingPeriod) || isNaN(monthlySaving) || isNaN(savingRate)) {
        alert('데이터를 입력해주세요.');
        doLoop = false;
    }

    if (savingPeriod <= 0 || monthlySaving <= 0 || savingRate <= 0){
        alert('적금 약정기간, 납입액, 약정 금리를 확인해주세요.');
        doLoop = false;
    }

    while (doLoop) {
        if(currentMonth === savingPeriod){
            document.getElementById('result1').innerText = `${Number(Math.round(currentSaving)).toLocaleString()}`;
            document.getElementById('result2').innerText = `${Number(currentInterest).toLocaleString()}`;
            document.getElementById('result3').innerText = `${Number(currentInterest*0.846).toLocaleString()}`;
            document.getElementById('result4').innerText = `${Number(currentInterest*0.846 + currentSaving).toLocaleString()}`;

            doLoop = false;
            break;
        }

        currentMonth += 1;
        currentInterest += monthlySaving * savingRate * (savingPeriod - currentMonth);
        currentSaving += monthlySaving;
    }
}

function reset() {
    document.getElementById("calculator-saving-period").value = '';
    document.getElementById("calculator-saving-monthly_saving").value = '';
    document.getElementById("calculator-saving-saving_rate").value = 2;

    document.getElementById('result1').innerText = '0';
    document.getElementById('result2').innerText = `0`;
    document.getElementById('result3').innerText = `0`;
    document.getElementById('result4').innerText = `0`;
}