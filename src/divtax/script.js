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
    const annualSalary = parseInt(document.getElementById("calculator-divtax-annual_salary").value);
    const annualInterest = parseInt(document.getElementById("calculator-divtax-annual_interest").value);
    const annualDividend = parseInt(document.getElementById("calculator-divtax-annual_dividend").value);
    const annualDeduction = parseInt(document.getElementById("calculator-divtax-annual_deduction").value);
    const taxRegion = document.querySelector('input[name="btnradio"]:checked').value;

    const taxRate = {
        1200: 0.06,
        4600: 0.15,
        8800: 0.24,
        15000: 0.35,
        30000: 0.38,
        50000: 0.4,
        100000: 0.42,
        100001: 0.45
    }

    const regionalDivTaxRate = {
        'USA': 0.15,
        'KOR': 0.154
    }

    // if (isNaN(annualSalary) || isNaN(annualInterest) || isNaN(annualDividend) || isNaN(taxRegion)) {
    //     alert('데이터를 입력해주세요.');
    //     return;
    // }

    if (annualDividend < 0 || annualInterest < 0 || annualSalary < 0) {
        alert('소득은 0원 이상이어야 세금 납부가 가능합니다.');
        return;
    }

    const financialIncome = annualInterest + annualDividend;
    const taxBase1 = annualSalary - annualDeduction + financialIncome - 2000;
    const taxBase2 = annualSalary - annualDeduction;
    const paidInterestTax = annualInterest * 0.14;
    const paidDivTax = annualDividend * regionalDivTaxRate[taxRegion];
    const paidFinancialTax = paidDivTax + paidInterestTax;

    let paidSalaryTax = 0;
    let reportingTax = 0;
    let appliedTaxRate = 0.00;
    let prevKey = 0;
    let case1Result = 0; //(기준초과금액 + 금융소득외 다른 종합소득금액 - 종합소득공제) * 기본세율 + 종합과세기준금액(2000만원) * 14%
    let case2Result = 0; // 금융소득 * 14% + (금융소득외 다른 종합소득금액 - 종합소득공제) * 기본세율

    //paidSalaryTax
    for (const key of Object.keys(taxRate)) {
        if (key <= annualSalary - annualDeduction) {
            paidSalaryTax += (key - prevKey) * taxRate[key] * 1.1;
            prevKey = key;
        } else {
            paidSalaryTax += (annualSalary - annualDeduction - prevKey) * taxRate[key] * 1.1;
            break;
        }
    }

    if (financialIncome > 2000) {
        // case 1
        for (const key of Object.keys(taxRate)) {
            if (key <= taxBase1) {
                case1Result += (key - prevKey) * taxRate[key] * 1.1;
                prevKey = key;
            } else {
                case1Result += (taxBase1 - prevKey) * taxRate[key] * 1.1;
                break;
            }
        }
        case1Result += 2000 * 0.14;
    }

    prevKey = 0;

    //case 2
    for (const key of Object.keys(taxRate)) {
        if (key <= taxBase2) {
            case2Result += (key - prevKey) * taxRate[key] * 1.1;
            prevKey = key;
        } else {
            case2Result += (taxBase2 - prevKey) * taxRate[key] * 1.1;
            break;
        }
    }
    case2Result += paidFinancialTax;

    reportingTax = case2Result > case1Result ? case2Result : case1Result;

    document.getElementById('result1').innerText = parseInt(case2Result > case1Result ? taxBase2 : taxBase1);
    document.getElementById('result2').innerText = parseInt(paidSalaryTax);
    document.getElementById('result3').innerText = parseInt(paidDivTax);
    document.getElementById('result4').innerText = parseInt(paidInterestTax);
    document.getElementById('result5').innerText = parseInt(reportingTax);
    document.getElementById('result6').innerText = parseInt(reportingTax - paidSalaryTax - paidInterestTax - paidDivTax < 0 ? 0 : reportingTax - paidSalaryTax - paidInterestTax - paidDivTax);
}

function reset() {
    document.getElementById("calculator-divtax-annual_salary").value = '';
    document.getElementById("calculator-divtax-annual_interest").value = '';
    document.getElementById("calculator-divtax-annual_dividend").value = '';
    document.getElementById("calculator-divtax-annual_deduction").value = '';

    document.getElementById('result1').innerText = '0';
    document.getElementById('result2').innerText = '0';
    document.getElementById('result3').innerText = '0';
    document.getElementById('result4').innerText = '0';
    document.getElementById('result5').innerText = '0';
    document.getElementById('result6').innerText = '0';
}