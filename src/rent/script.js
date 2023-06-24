function calculate() {
    let currentDeposit = parseInt(document.getElementById("calculator-rent-curr_deposit").value);
    let conversionRate = parseFloat(document.getElementById("calculator-rent-conversion_rate").value) / 100;
    let newDeposit = parseInt(document.getElementById("calculator-rent-new_deposit").value);
    let baseDeposit = currentDeposit - newDeposit;
  
    let monthlyRent = 0;
    let doCalc = true;
  
    if (isNaN(baseDeposit) || isNaN(currentDeposit) || isNaN(conversionRate) || isNaN(newDeposit)) {
      alert('데이터를 입력해주세요.');
      doCalc = false;
    }
  
    if (doCalc) {
      monthlyRent = Math.round((baseDeposit * conversionRate / 12) * 100) / 100;
      document.getElementById('result1').innerText = `${monthlyRent}`;
    }
  }