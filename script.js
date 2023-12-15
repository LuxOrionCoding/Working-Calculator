const calcDisplay_wrapper = document.querySelector('.execution-wrapper');
const calcDisplay = document.querySelector('.execution-display');
const numberInput = document.querySelectorAll('.number-btn');

const uniqueInput = document.querySelectorAll('.unique-btn');
const uniqueSymbol = []
uniqueInput.forEach(input => {
	if (!['CE', '(', ')', '%'].includes(input.innerHTML)) {
		uniqueSymbol.push(input.innerHTML);
	}
})
var [plus, minus, times, divide] = ['+', '−', '×', '÷'];
const operation = [plus, minus, times, divide];

const deleteBtn = document.querySelector('#delete-btn');
const executeMath = document.querySelector('#execute-math-btn');

// to tidy up the number (1000 -> 1.000)
function tidy(string) {
	let maxDigit = 0;

	if (string.includes('.')) {
		let afterDecimal = string.slice(0, string.indexOf('.'));
		maxDigit = afterDecimal.length + 12;
	} else { maxDigit = 15 }

	return parseFloat(string).toLocaleString('de-DE', { maximumSignificantDigits: maxDigit });
}

// displaying the number
numberInput.forEach(numberBtn => {
	numberBtn.addEventListener('click', ()=>{
		let lastItem = calcDisplay.innerHTML.slice(-1);
		let temList = joinNumbers(calcDisplay.innerHTML.split(''));

		// to limit number weight
		for (var i = temList.length - 1; i >= 0; i--) {
			if (!isNaN(temList[i])) {
				if (temList[i].includes('.') && temList[i].length-1	 > 12) {
					alert("can't put number more than 12 digits before decimal point.");
					return;
				} else if (temList[i].length+1 > 15) {	
					alert("can't put number more than 15 digits.");
					return;
				}
			} else {
				break;
			}
		}

		if (calcDisplay.innerHTML == '0') {
			// to remove the 0 when typing number
			calcDisplay.innerHTML = numberBtn.classList[1].slice(-1);
		} else {
			if (lastItem == '%' || lastItem == ')') calcDisplay.innerHTML += times;
			calcDisplay.innerHTML += numberBtn.classList[1].slice(-1);
		}

		// tidy up the numbers (1000 -> 1.000)
		let temCleanList = joinNumbers(calcDisplay.innerHTML.split(''));

		for (var i = 0; i < temCleanList.length; i++) {
			if (!isNaN(temCleanList[i])) {
				temCleanList[i] = tidy(temCleanList[i]);
			}
		}

		calcDisplay.innerHTML = temCleanList.join('');

		calcDisplay_wrapper.scrollLeft = calcDisplay_wrapper.scrollWidth;
	})
})

// displaying the unique btn (other than number)
uniqueInput.forEach(uniqueBtn => {
	// display the unique btn except the '=' and 'C'
	if (!['delete-btn', 'execute-math-btn'].includes(uniqueBtn.id)) {
		uniqueBtn.addEventListener('click', ()=>{
			calcDisplay_wrapper.scrollLeft = calcDisplay_wrapper.scrollWidth;

			let displayListed = calcDisplay.innerHTML.split('');
			let temCleanList = joinNumbers(displayListed);
			let lastItem = calcDisplay.innerHTML.slice(-1);

			// make sure there is number before the unique symbol
			if (uniqueBtn.id == 'paranteces') {

				if (calcDisplay.innerHTML == '0') {
					calcDisplay.innerHTML = '(';
				} else {
					let lastParanteces = '(';
					let prt1_counter = 0;
					let prt2_counter = 0;
					
					displayListed.forEach(item => {
						if (item == '(') { prt1_counter += 1 }
						else if (item == ')') { prt2_counter += 1 }
					})

					if (prt1_counter != prt2_counter && (!isNaN(lastItem) || lastItem == ')')) {
						lastParanteces = ')';
					} else if (lastItem == ')' || (!isNaN(lastItem) && lastParanteces == '(')) {
						calcDisplay.innerHTML += times;
					}

					calcDisplay.innerHTML += lastParanteces;
				}

			} 

			else if (uniqueBtn.id == 'plus-minus-btn' && lastItem != '-') {
				if (calcDisplay.innerHTML == '0') calcDisplay.innerHTML = '(-';
				else { calcDisplay.innerHTML += '(-'; }
			}

			else if (uniqueBtn.id == 'decimal-btn') {
				let isDecimal = false;
				// to check if already decimal
				for (var i = temCleanList.length; i >= 0; i--) {
					if (!isNaN(temCleanList[i])) {
						if (temCleanList[i].indexOf('.') != -1) isDecimal = true;
						break;
					}
				}
				if (!isDecimal) calcDisplay.innerHTML += uniqueBtn.innerHTML;
			}

			else if (calcDisplay.innerHTML != '0' && lastItem != '(' && !uniqueSymbol.includes(lastItem)) {
				calcDisplay.innerHTML += uniqueBtn.innerHTML;
			}

			calcDisplay_wrapper.scrollLeft = calcDisplay_wrapper.scrollWidth;
		})
	}
})

// function to join seperated number ("1","5" -> "15")
function joinNumbers(array) {
	let arr = [];
	[...array].forEach(item => arr.push(item));
	let newList = [];

	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == '.') {
			arr.splice(i, 1);
		} else if (arr[i] == ',') {
			arr.splice(i, 1, '.');
		}
	}
	
	while (arr.length != 0) {
		if (arr.length == 1) {
			newList.push(arr[0]);
			break;
		}

		if (arr[0] == '-' && !isNaN(arr[1])) {
			arr[0] += arr[1];
			arr.splice(1, 1);
		}

		if ( (!isNaN(arr[0]) && !isNaN(arr[1])) || arr[1] == '.') {
			arr[0] += arr[1];
			arr.splice(1, 1);
		} else {
			newList.push(arr[0]);
			arr.splice(0, 1);
		}
	}

	return newList;
}

// CLEARING FUNCTION
deleteBtn.addEventListener('click', ()=>{
	calcDisplay.innerHTML = calcDisplay.innerHTML.slice(0, calcDisplay.innerHTML.length-1);
	if (calcDisplay.innerHTML == '') calcDisplay.innerHTML = 0;


	let temCleanList = joinNumbers(calcDisplay.innerHTML.split(''));
	for (var i = temCleanList.length - 1; i >= 0; i--) {
		if (!isNaN(temCleanList[i])) {
			temCleanList[i] = tidy(temCleanList[i]);
		}
	}

	calcDisplay.innerHTML = temCleanList.join('');
})

var valueList = [];
var cleanList = [];

// THE SYSTEM
executeMath.addEventListener('click', ()=>{

	valueList = calcDisplay.innerHTML.split('');

	let lastDisplayValue = calcDisplay.innerHTML.slice(-1);
	let isContainOperation = valueList.some(item => operation.includes(item));

	if ( (isContainOperation && lastDisplayValue == ')') || (isContainOperation && !isNaN(lastDisplayValue)) || lastDisplayValue == '%' ) {

		// Step 1: Joining the seperated number.
		cleanList = joinNumbers(valueList);

		// Step 2: Start executing the number.
		function executeMath(array) {
			let arr = [];
			array.forEach(item => {arr.push(item)});
			let result = arr[0];

			// executing multiply and divide first
			let i = 0;
			while (i < arr.length) {

				if (arr[i] == '%') {

					var percentMath = arr[i-1] / 100;
					result = percentMath;
					arr.splice(i-1, 2, String(percentMath));
					continue;

				} else if (arr[i] == times) {

					var timesMath = arr[i-1] * arr[i+1];
					result = timesMath;
					arr.splice(i-1, 3, String(timesMath));
					continue;

				} else if (arr[i] == divide) {

					var divideMath = arr[i-1] / arr[i+1];
					result = divideMath;
					arr.splice(i-1, 3, String(divideMath));
					continue;

				}

				i+=1;
			}

			let j = 0;
			// Then, executing the plus and minus
			while (j < arr.length) {

				if (arr[j] == plus) {

					var plusMath = parseFloat(arr[j-1]) + parseFloat(arr[j+1]);
					result = plusMath;
					arr.splice(j-1, 3, String(plusMath));
					continue;

				} else if (arr[j] == minus) {

					var minusMath = parseFloat(arr[j-1]) - parseFloat(arr[j+1]);
					result = minusMath;
					arr.splice(j-1, 3, String(minusMath));
					continue;

				}

				j+=1;
			}

			return String(result);
		}

		while (cleanList.includes('(') || cleanList.includes(')')) {

			let prt1_group = [];
			let prt2_group = [];

			for (var i = 0; i < cleanList.length; i++) {
				if (cleanList[i] == '(') prt1_group.push(i);
				else if (cleanList[i] == ')') prt2_group.push(i);
			}

			let prt_1 = prt1_group[prt1_group.length-1];
			let prt_2 = prt2_group.find(prt => prt>prt_1);

			let parantecesResult = 0;
			let insideParanteces = cleanList.slice(prt_1+1, prt_2);
			if (insideParanteces.length == 1) cleanList.splice(prt_1, 3, insideParanteces[0]);
			else {
				parantecesResult = executeMath(insideParanteces);
				cleanList.splice(prt_1, insideParanteces.length+2, parantecesResult);
			}

		}

		if (!cleanList.includes('(') && !cleanList.includes(')')) {
			result =  executeMath(cleanList);
		}
		calcDisplay.innerHTML = tidy(result);
		cleanList = [];

	}

})

function breakLoop() {
	debugger;
}