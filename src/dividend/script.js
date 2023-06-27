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
    let currentAsset = parseInt(document.getElementById("calculator-retire-curr_asset").value);
    let annualDivRate = parseFloat(document.getElementById("calculator-retire-annual_div_rate").value) / 100;
    let monthlyFreeCash = parseInt(document.getElementById("calculator-retire-monthly_fc").value);
    let annualFreeCashGrowthRate = parseFloat(document.getElementById("calculator-retire-fc_annual_growth").value) / 100;
    let annualDivGrowthRate = parseFloat(document.getElementById("calculator-retire-div_annual_growth").value) / 100;
    let targetCost = parseInt(document.getElementById("calculator-retire-target_cost").value);
    const taxRegion = document.querySelector('input[name="btnradio"]:checked').value;

    let taxRate = 0;
    if (taxRegion === 'USA') taxRate = 0.15;
    else if (taxRegion === 'KOR') taxRate = 0.154;

    console.log(taxRegion);

    let year = 1;
    let endOfYearAsset = 0;
    let startOfYearAsset = currentAsset;

    let startOfYearDividend = 0;
    let monthlyDividend = 0;
    let accuDividend = 0;
    let accuSeed = currentAsset;

    let annualFreeCash = monthlyFreeCash * 12;


    let table = document.getElementById("result-table");
    table.innerHTML = "";
    table.innerHTML = `
            <tr>
                <th style="width:20%">연차</th>
                <th style="width:20%">연초 배당금</th>
                <th style="width:20%">연말 보유 자산</th>
                <th style="width:20%">누적 투자 원금</th>
                <th style="width:20%">누적 재투자 배당금</th>
            </tr>
        `;

    let doLoop = true;

    if (isNaN(currentAsset) || isNaN(annualDivRate) || isNaN(monthlyFreeCash) || isNaN(annualFreeCashGrowthRate) || isNaN(annualDivGrowthRate) || isNaN(targetCost)) {
        alert('데이터를 입력해주세요.');
        doLoop = false;
    }

    if (monthlyFreeCash === 0 || monthlyFreeCash < 0) {
        alert('월 투자 금액은 0원 이상이어야 파이어가 가능합니다.');
        doLoop = false;
    }

    while (doLoop) {
        if (annualDivRate > 0) {

            //calculate end of year status
            startOfYearDividend = startOfYearAsset * annualDivRate * Math.pow((1 + annualDivGrowthRate), year - 1) * (1 - taxRate);
            endOfYearAsset = startOfYearAsset + startOfYearDividend + annualFreeCash * Math.pow((1 + annualFreeCashGrowthRate), year - 1);
            accuDividend = accuDividend + startOfYearDividend;
            accuSeed = accuSeed + annualFreeCash * Math.pow((1 + annualFreeCashGrowthRate), year - 1);

            if (startOfYearDividend / 12 >= targetCost) {
                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `<strong>🔥목표 달성 - ${year} 년</strong>`;
                row.insertCell(1).innerHTML = `<strong>${Number(Math.round(startOfYearDividend)).toLocaleString()} 만 원</strong>`;
                row.insertCell(2).innerHTML = `<strong>${Number(Math.round(endOfYearAsset)).toLocaleString()} 만 원</strong>`;
                row.insertCell(3).innerHTML = `<strong>${Number(Math.round(accuSeed)).toLocaleString()} 만 원</strong>`;
                row.insertCell(4).innerHTML = `<strong>${Number(Math.round(accuDividend)).toLocaleString()} 만 원</strong>`;

                document.getElementById('result1').innerText = `${year}`;
                document.getElementById('result2').innerText = `${Number(Math.round(endOfYearAsset)).toLocaleString()}`;
                document.getElementById('result3').innerText = `${Number(Math.round(accuSeed)).toLocaleString()}`;
                document.getElementById('result4').innerText = `${Number(Math.round(startOfYearDividend / 12)).toLocaleString()}`;

                let resultContainer = document.getElementById('result-table-container');
                if (resultContainer.style.display === 'none') {
                    resultContainer.style.display = 'block';
                }

                doLoop = false;
                break;
            } else {
                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `${year} 년`;
                row.insertCell(1).innerHTML = `${Number(Math.round(startOfYearDividend)).toLocaleString()} 만 원`;
                row.insertCell(2).innerHTML = `${Number(Math.round(endOfYearAsset)).toLocaleString()} 만 원`;
                row.insertCell(3).innerHTML = `${Number(Math.round(accuSeed)).toLocaleString()} 만 원`;
                row.insertCell(4).innerHTML = `${Number(Math.round(accuDividend)).toLocaleString()} 만 원`;

                startOfYearAsset = endOfYearAsset;
            }

            //increment year
            year = year + 1;

        } else {
            alert('죄송합니다. 본 모델에서는 배당 소득이 없으면 은퇴가 불가능합니다.');
            doLoop = false;
            break;
        }

        if (year > 100) {
            alert('죄송합니다. 현재 상태로는 100년이 지나도 은퇴할 수 없습니다.');
            doLoop = false;
        }
    }
}

function reset() {
    document.getElementById("calculator-retire-curr_asset").value = '';
    document.getElementById("calculator-retire-annual_div_rate").value = '';
    document.getElementById("calculator-retire-monthly_fc").value = '';
    document.getElementById("calculator-retire-fc_annual_growth").value = '';
    document.getElementById("calculator-retire-div_annual_growth").value = '';
    document.getElementById("calculator-retire-target_cost").value = '';

    document.getElementById('result1').innerText = '0';
    document.getElementById('result2').innerText = `0`;
    document.getElementById('result3').innerText = `0`;
    document.getElementById('result4').innerText = `0`;

    let resultContainer = document.getElementById('result-table-container');
    if (resultContainer.style.display !== 'none') {
        resultContainer.style.display = 'none';
        let table = document.getElementById("result-table");
        table.innerHTML = '';
    }

}