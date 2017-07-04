class Card {
	constructor(order,qid,type,name,questionLength = -1){
		this.order = order;
		this.qid = qid;
		this.type = type;
		this.name = name;
		this.questionLength = questionLength;
		this.viewThroughTimes = [];
		this.viewFullTime = 0;
		this.fields = [];
	}
	get fullTime() {
        return this.calcFullTime();
    }
    calcFullTime() {
        var sum = 0;
        for (var i = 0; i < this.viewThroughTimes.length; i++) {
            sum += this.viewThroughTimes[i];
        }
        this.viewFullTime = sum/1000;
        return this.viewFullTime;
    }
}
class SubField {
	constructor(order,type,id,name,length = -1){
		this.order = order;
		this.type = type;
		this.id = id;
		this.name = name;
		this.length = length;
		this.events = [];
		this.fieldfullTime = 0;
	}
	get fullTime() {
        return this.calcFullTime();
    }
    calcFullTime() {
        var sum = 0;
        for (var i = 0; i < this.events.length; i++) {
            sum += this.events[i];
        }
        this.fieldfullTime = sum/1000;
        return this.fieldfullTime;
    }
}

// text field'da gecen sureyi hesaplayan adam
function textTimeCalculator(flag){
	if(flag.type == 'focus'){
    	whenFocus = new Date();
	}else if (flag.type == 'blur') {
    	whenBlur = new Date();
    	var tinyElapsed = whenBlur - whenFocus;
    	for (var i = 0; i < cardList.length; i++) {
    		for (var j = 0; j < cardList[i].fields.length; j++) {
    			if (this.id == cardList[i].fields[j].id) {
    				cardList[i].fields[j].events.push(tinyElapsed);
    			}
    		}
    	}
	}
}

// question field detailed reader and executioner
var cardList = [];
var cardOrder = 0;
function cardReader(jfQLi){ // jfQLi > jotform Question li object
	var fieldOrder = 0;

	// li element's control type
	var control_type = jfQLi.getAttribute('data-type').split("control_");

	// for find question text's length
	var questionLabel = jfQLi.querySelector(".jfQuestion-label");
	// console.log('questionLabel : ', questionLabel.innerHTML);
	// console.log('questionLabel -> length : ', questionLabel.innerHTML.length);

	// create card array
	cardList.push(new Card(cardOrder,
						   jfQLi.id,
						   jfQLi.getAttribute('data-type'),
						   control_type[1],
						   questionLabel.innerHTML.length)
						);


	console.log('---> control_type[1]', control_type[1]);







	// input field analysis
	var inputs = jfQLi.getElementsByTagName('input');
	
	// this block counts time for 
	// text fields focus and blur events
	for (var i = 0; i < inputs.length; i++) {
		console.log('--- --->i', i);
		// temporarily exclude radio and checkboxes
		if (inputs[i].getAttribute('data-component') == null) {
			console.log('radio or selectboxes');
			console.log('inputs[i]', inputs[i]);
			console.log('inputs[i]', inputs[i].type);
			console.log('inputs[i]', inputs[i].value);
			console.log('var');
			cardList[cardOrder].fields.push(new SubField(fieldOrder++, // field order in current card
													 inputs[i].type, // what's the input
													 -1, // default
													 -1, // default
													 inputs[i].value.length)); // answer's text length

			// interactionlari saymak lazim
			

		}else{
			cardList[cardOrder].fields.push(new SubField(fieldOrder++,
													 inputs[i].getAttribute('data-component'),
													 inputs[i].id,
													 inputs[i].name));	
		}
		inputs[i].addEventListener("focus", textTimeCalculator);
		inputs[i].addEventListener("blur", textTimeCalculator);
	}
	cardOrder++;
}

// control timer state
var timerIndex = 0;
function cardTimerStart(){
	cardStartTime = new Date();
}
function cardOnChange(newIndex){
	if(newIndex == -1){return true;}

	cardEndTime = new Date();
	elapsedTime = cardEndTime - cardStartTime;
	// add time record to relevant card object
	for (var i = 0; i < cardList.length; i++) {
		if(cardList[i].order == timerIndex){
			cardList[i].viewThroughTimes.push(elapsedTime);
		}
	}
	timerIndex = newIndex;
	cardTimerStart();
}
// end control timer state

// submit aninda calisir, toplam sureleri hesaplar 
// JSON yapar gonderir, helal olsundur.
function writeResult(){
	cardOnChange(-1); // change on card (-1 exit)
	for (var i = 0; i < cardList.length; i++) {
		cardList[i].fullTime;
	}

	for (var i = 0; i < cardList.length; i++) {
    	for (var j = 0; j < cardList[i].fields.length; j++) {
   				cardList[i].fields[j].fullTime;
   	   	}
    }
	console.log(cardList);
	var result = JSON.stringify(cardList);
	
	window.open("data:text/json," + encodeURIComponent(result), "_blank");
	console.log(result);
	debugger
}

// Initialize the widget only select question fields and 
// pass them to reader
function init () {
	var jfQuestionLi = document.getElementsByClassName('jfCard-wrapper');
	for (var i = 0; i < jfQuestionLi.length; i++) {
		cardReader(jfQuestionLi[i]);
	}

	console.log(cardList);
	
	cardTimerStart(0);

	var oldFunc = CardForm.setCardIndex;
	CardForm.setCardIndex = (index) => {
 		cardOnChange(index);
  		oldFunc(index);
	};

	var forSubmit = document.getElementsByClassName('jotform-form');
	console.log(cardList);
	forSubmit[0].addEventListener('submit', writeResult);
}

window.onload = init;