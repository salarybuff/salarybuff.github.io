function calculate() {
    let currentAsset = parseInt(document.getElementById("calculator-retire-curr_asset").value);
    let annualInvRate = parseFloat(document.getElementById("calculator-retire-annual_inv_rate").value) / 100;
    let monthlyFreeCash = parseInt(document.getElementById("calculator-retire-monthly_fc").value);
    let annualnflation = parseFloat(document.getElementById("calculator-retire-annual_inflation").value) / 100;
    let monthlyTargetCost = parseInt(document.getElementById("calculator-retire-monthly_target_cost").value);

    // first month asset
    let futureAsset = currentAsset + monthlyFreeCash - monthlyTargetCost;
    let month = 1;
    let year = 0;

    let table = document.getElementById("result-table");

    table.innerHTML = "";
    table.innerHTML = `
    <tr>
        <th>연차</th>
        <th>연말 보유 자산</th>
        <th>연말 월 수익</th>
        <th>연말 월 지출</th>
    </tr>
`;

    let doLoop = true;

    if (isNaN(currentAsset) || isNaN(annualInvRate) || isNaN(monthlyFreeCash) || isNaN(annualnflation) || isNaN(monthlyTargetCost)) {
        alert('데이터를 입력해주세요.');
        doLoop = false;
    }

    while (doLoop) {
        if (futureAsset < 0) {
            document.getElementById('result1').innerText = `${year}년 ${month - year * 12}개월`;
            document.getElementById('result2').innerText = `${Number(Math.round(futureAsset)).toLocaleString()}`;
            document.getElementById('result3').innerText = `${Number(Math.round(futureAsset * annualDivRate / 12)).toLocaleString()}`;

            doLoop = false;
            break;
        }

        if (month / 12 >= year + 1) {
            // increment year
            year = year + 1;

            // Update table
            let row = table.insertRow(year);
            row.insertCell(0).innerHTML = `${year} 년`;
            row.insertCell(1).innerHTML = `${Number(Math.round(futureAsset)).toLocaleString()} 만 원`;
            row.insertCell(2).innerHTML = `${Number(Math.round(futureAsset * annualInvRate / 12 + monthlyFreeCash)).toLocaleString()} 만 원`;
            row.insertCell(3).innerHTML = `${Number(Math.round(monthlyTargetCost * Math.pow(1 + annualnflation, month / 12))).toLocaleString()} 만 원`;
        }

        if (year > 100) {
            alert('축하합니다. 현재 상태로는 100년이 지나도 자산이 줄지 않습니다.');
            doLoop = false;
        }

        //update future capital
        futureAsset = futureAsset + monthlyFreeCash + futureAsset * annualInvRate / 12 - monthlyTargetCost * Math.pow(1 + annualnflation, month / 12);

        //increment month
        month = month + 1;

    }
}