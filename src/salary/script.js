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
    let annualProfitRate = parseFloat(document.getElementById("calculator-retire-annual_profit_rate").value) / 100;
    let monthlyFreeCash = parseInt(document.getElementById("calculator-retire-monthly_fc").value);
    let targetSeed = parseInt(document.getElementById("calculator-retire-target_seed").value);
    let targetCost = parseInt(document.getElementById("calculator-retire-target_monthly_cost").value);

    let annualFreeCash = monthlyFreeCash * 12;
    let fireYear = 0;
    let year = 1;
    let fireStarted = false;

    // first year capital
    let futureCapital = currentAsset * (1 + annualProfitRate) + annualFreeCash;
    let table = document.getElementById("result-table");
    let accuInvestment = currentAsset * (1 + annualProfitRate) - currentAsset;
    let fireSeedActual = 0;

    table.innerHTML = "";
    table.innerHTML = `
          <tr>
              <th style="width:33%">연차</th>
              <th style="width:33%">총 보유 자산</th>
              <th style="width:33%">누적 재투자 금액</th>
          </tr>
      `;

    let doLoop = true;

    if (isNaN(currentAsset) || isNaN(annualProfitRate) || isNaN(monthlyFreeCash) || isNaN(targetCost)) {
        alert('데이터를 입력해주세요.');
        doLoop = false;
    }

    if (monthlyFreeCash === 0 || monthlyFreeCash < 0) {
        alert('월 투자 금액은 0원 이상이어야 파이어가 가능합니다.');
        doLoop = false;
    }

    while (doLoop) {
        if (annualProfitRate > 0) {
            if (fireStarted) {
                //update accumulated investment
                accuInvestment = accuInvestment + fireSeedActual * (1 + annualProfitRate) - fireSeedActual

                //update seed actual
                fireSeedActual = fireSeedActual * (1 + annualProfitRate) - targetCost * 12;

                if (fireSeedActual < 0) {
                    let resultContainer = document.getElementById('result-table-container');
                    if (resultContainer.style.display === 'none') {
                        resultContainer.style.display = 'block';
                    }
                    document.getElementById('result3').innerText = `${Number(year - fireYear - 1).toLocaleString()}`;

                    doLoop = false;
                    break;
                }

                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `${year} 년`;
                row.insertCell(1).innerHTML = `${Number(Math.round(fireSeedActual)).toLocaleString()} 만 원`;
                row.insertCell(2).innerHTML = `${Number(Math.round(accuInvestment)).toLocaleString()} 만 원`;
            }

            if (futureCapital >= targetSeed - annualFreeCash && !fireStarted) {
                fireStarted = true;
                fireSeedActual = futureCapital;
                fireYear = year;

                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `<strong>🔥파이어 시작 - ${year} 년</strong>`;
                row.insertCell(1).innerHTML = `<strong>${Number(Math.round(futureCapital)).toLocaleString()} 만 원</strong>`;
                row.insertCell(2).innerHTML = `<strong>${Number(Math.round(accuInvestment)).toLocaleString()} 만 원</strong>`;

                document.getElementById('result1').innerText = `${year}`;
                document.getElementById('result2').innerText = `${Number(Math.round(futureCapital)).toLocaleString()}`;
            }

            if (!fireStarted) {
                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `${year} 년`;
                row.insertCell(1).innerHTML = `${Number(Math.round(futureCapital)).toLocaleString()} 만 원`;
                row.insertCell(2).innerHTML = `${Number(Math.round(accuInvestment)).toLocaleString()} 만 원`;

                //update accumulated investment
                accuInvestment = accuInvestment + futureCapital * (1 + annualProfitRate) - futureCapital

                //update future capital
                futureCapital = futureCapital * (1 + annualProfitRate) + annualFreeCash;
            }

            //increment year
            year = year + 1;
        } else {
            alert('죄송합니다. 자산을 통한 소득이 없으면 은퇴는 불가능합니다.');
            doLoop = false;
            break;
        }

    }
}

function reset() {
    document.getElementById("calculator-retire-curr_asset").value = '';
    document.getElementById("calculator-retire-annual_profit_rate").value = 3;
    document.getElementById("calculator-retire-monthly_fc").value = '';
    document.getElementById("calculator-retire-target_seed").value = '';
    document.getElementById("calculator-retire-target_monthly_cost").value = '';

    document.getElementById('result1').innerText = '0';
    document.getElementById('result2').innerText = `0`;
    document.getElementById('result3').innerText = `0`;

    let resultContainer = document.getElementById('result-table-container');
    if (resultContainer.style.display !== 'none') {
        resultContainer.style.display = 'none';
        let table = document.getElementById("result-table");
        table.innerHTML = '';
    }

}