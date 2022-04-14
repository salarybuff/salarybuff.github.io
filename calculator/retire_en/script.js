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
              <th style="width:33%">Years</th>
              <th style="width:33%">Total Savings</th>
              <th style="width:33%">Amount of Reinvested Earnings</th>
          </tr>
      `;

    let doLoop = true;

    if (isNaN(currentAsset) || isNaN(annualProfitRate) || isNaN(monthlyFreeCash) || isNaN(targetCost)) {
        alert('Please enter the data.');
        doLoop = false;
    }

    if (monthlyFreeCash === 0 || monthlyFreeCash < 0){
        alert('Monthly invesment amount should be more than $0.');
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
                    document.getElementById('result3').innerText = `${Number(year-fireYear-1).toLocaleString()}`;

                    doLoop = false;
                    break;
                }

                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `${year} Year(s)`;
                row.insertCell(1).innerHTML = `${Number(Math.round(fireSeedActual)).toLocaleString()} USD`;
                row.insertCell(2).innerHTML = `${Number(Math.round(accuInvestment)).toLocaleString()} USD`;
            }

            if (futureCapital>= targetSeed - annualFreeCash && !fireStarted) {
                fireStarted = true;
                fireSeedActual = futureCapital;
                fireYear = year;

                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `<strong>🔥Financial Freedom Starts - ${year} Year(s)</strong>`;
                row.insertCell(1).innerHTML = `<strong>${Number(Math.round(futureCapital)).toLocaleString()} USD</strong>`;
                row.insertCell(2).innerHTML = `<strong>${Number(Math.round(accuInvestment)).toLocaleString()} USD</strong>`;

                document.getElementById('result1').innerText = `${year}`;
                document.getElementById('result2').innerText = `${Number(Math.round(futureCapital)).toLocaleString()}`;
            }

            if (!fireStarted) {
                // Update table
                let row = table.insertRow(year);
                row.insertCell(0).innerHTML = `${year} Year(s)`;
                row.insertCell(1).innerHTML = `${Number(Math.round(futureCapital)).toLocaleString()} USD`;
                row.insertCell(2).innerHTML = `${Number(Math.round(accuInvestment)).toLocaleString()} USD`;

                //update accumulated investment
                accuInvestment = accuInvestment + futureCapital * (1 + annualProfitRate) - futureCapital

                //update future capital
                futureCapital = futureCapital * (1 + annualProfitRate) + annualFreeCash;
            }

            //increment year
            year = year + 1;
        } else {
            alert('It is not possible to achieve financial freedom without income generated from the capital.');
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