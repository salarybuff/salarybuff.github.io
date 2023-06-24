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
    const mortgageCapital = parseFloat(document.getElementById("calculator-mortgage-capital").value);
    const mortgageInterestRate = parseFloat(document.getElementById("calculator-mortgage-rate").value)/100;
    const moartgageOverallPeriod = parseInt(document.getElementById("calculator-mortgage-period").value);
    const mortgageRepaymentTimes = parseInt(document.getElementById("calculator-mortgage-times").value);
    const mortgageCurrentBalance = parseFloat(document.getElementById("calculator-mortgage-balance").value);
    const mortgageAdditional = parseFloat(document.getElementById("calculator-mortgage-additional").value);
    const mortgageTarget = parseFloat(document.getElementById("calculator-mortgage-target").value);

    if (isNaN(mortgageCapital) || isNaN(mortgageInterestRate) || isNaN(moartgageOverallPeriod) || isNaN(mortgageRepaymentTimes) || isNaN(mortgageCurrentBalance) || isNaN(mortgageAdditional) || isNaN(mortgageTarget)) {
        alert('데이터를 입력해주세요.');
        return;
    }

    if (mortgageCapital < 0 || mortgageInterestRate < 0 || moartgageOverallPeriod < 0 || mortgageRepaymentTimes < 0 || mortgageCurrentBalance < 0 || mortgageAdditional < 0 || mortgageTarget < 0) {
        alert('음수를 입력하셨습니다. 양수를 입력해 주십시오.');
        return;
    }

    const monthlyInterestRate = mortgageInterestRate / 12;
    const currentMonthlyRepayments = calcMonthlyRepayment(mortgageCurrentBalance, monthlyInterestRate, moartgageOverallPeriod, mortgageRepaymentTimes);
    
    //목표 회차수 찾기
    let calcResult = findTarget(mortgageTarget, mortgageCurrentBalance, monthlyInterestRate, moartgageOverallPeriod, mortgageRepaymentTimes, currentMonthlyRepayments, mortgageAdditional);

    document.getElementById('result1').innerText = parseInt(calcResult.balanceWithoutDeductionTarget);
    document.getElementById('result2').innerText = parseInt(calcResult.balanceWithoutDeductionFinal);
    document.getElementById('result3').innerText = parseInt(calcResult.balanceWithDeductionTarget);
    document.getElementById('result4').innerText = parseInt(calcResult.balanceWithDeductionFinal);
}

function findTarget(target, currentBalance, monthlyInterestRate, overallPeriod, currRepaymentTimes, originalRepayments, mortgageAdditional) {
    let result = {
        balanceWithoutDeductionTarget: 0,
        balanceWithDeductionTarget: 0,
        balanceWithoutDeductionFinal: 0,
        balanceWithDeductionFinal: 0,
    };

    // console.log("target:" + String(target) + " currentBalance:" + String(currentBalance) + " monthlyInterestRate:" + String(monthlyInterestRate) + " overallPeriod:" + String(overallPeriod) + " currRepaymentTimes:" + String(currRepaymentTimes) + " originalRepayments:" + String(originalRepayments));

    let balanceWithDeductionTargetCalculated = false;
    let balanceWithoutDeductionTargetCalculated = false;
    let balanceWithDeductionFinalCalculated = false;
    let balanceWithoutDeductionFinalCalculated = false;

    let tempBalanceWithoutDeduction = currentBalance;
    let tempBalanceWithDeduction = currentBalance;

    for (let i = currRepaymentTimes + 1; i < overallPeriod; i++) {
        const monthlyRepaymentWithoutDeduction = calcMonthlyRepayment(tempBalanceWithoutDeduction, monthlyInterestRate, overallPeriod, i - 1);
        const monthlyRepaymentWithDeduction = calcMonthlyRepayment(tempBalanceWithDeduction, monthlyInterestRate, overallPeriod, i - 1);

        if (!balanceWithDeductionTargetCalculated && monthlyRepaymentWithDeduction <= target) {
            result.balanceWithDeductionTarget = i - currRepaymentTimes;
            balanceWithDeductionTargetCalculated = true;
        }

        if (!balanceWithoutDeductionTargetCalculated && monthlyRepaymentWithoutDeduction <= target) {
            result.balanceWithoutDeductionTarget = i - currRepaymentTimes;
            balanceWithoutDeductionTargetCalculated = true;
        }

        if (!balanceWithDeductionFinalCalculated && monthlyRepaymentWithDeduction < 0) {
            result.balanceWithDeductionFinal = i - currRepaymentTimes;
            balanceWithDeductionFinalCalculated = true;
        }

        if (!balanceWithoutDeductionFinalCalculated && monthlyRepaymentWithoutDeduction < 0) {
            result.balanceWithoutDeductionFinal = i - currRepaymentTimes;
            balanceWithoutDeductionFinalCalculated = true;
        }

        // console.log("months: " + String(i))
        // console.log("monthlyRepaymentWithoutDeduction: " + String(monthlyRepaymentWithoutDeduction))
        // console.log("monthlyRepaymentWithDeduction: " + String(monthlyRepaymentWithDeduction))

        if (balanceWithDeductionTargetCalculated && balanceWithoutDeductionTargetCalculated && balanceWithDeductionFinalCalculated && balanceWithoutDeductionFinalCalculated) {
            // console.log(result);
            return result;
        }

        const monthlyInterestWithoutDeduction = monthlyInterestRate * tempBalanceWithoutDeduction;
        const monthlyInterestWithDeduction = monthlyInterestRate * tempBalanceWithDeduction;
        const monthlyRepaymentCapitalWithoutDeduction = monthlyRepaymentWithoutDeduction - monthlyInterestWithoutDeduction
        const monthlyRepaymentCapitalWithDeduction = monthlyRepaymentWithDeduction - monthlyInterestWithDeduction

        tempBalanceWithoutDeduction = tempBalanceWithoutDeduction - monthlyRepaymentCapitalWithoutDeduction - mortgageAdditional;
        tempBalanceWithDeduction = tempBalanceWithDeduction - monthlyRepaymentCapitalWithDeduction - mortgageAdditional - (originalRepayments - monthlyRepaymentCapitalWithDeduction);
    }

    return result;
}

function calcMonthlyRepayment(currBalance, monthlyInterestRate, overallPeriod, currRepaymentTimes) {
    return (currBalance * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, overallPeriod - currRepaymentTimes)) / (Math.pow(1 + monthlyInterestRate, overallPeriod - currRepaymentTimes) - 1)
}


function reset() {
    document.getElementById("calculator-mortgage-capital").value = '';
    document.getElementById("calculator-mortgage-rate").value = '';
    document.getElementById("calculator-mortgage-period").value = '';
    document.getElementById("calculator-mortgage-times").value = '';
    document.getElementById("calculator-mortgage-balance").value = '';
    document.getElementById("calculator-mortgage-additional").value = '';
    document.getElementById("calculator-mortgage-target").value = '';

    document.getElementById('result1').innerText = '0';
    document.getElementById('result2').innerText = '0';
    document.getElementById('result3').innerText = '0';
    document.getElementById('result4').innerText = '0';
}