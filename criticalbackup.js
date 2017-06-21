class Card {
	constructor(order,qid,type,name){
		this.order = order;
		this.qid = qid;
		this.type = type;
		this.name = name;
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
	constructor(order,type,id,name){
		this.order = order;
		this.type = type;
		this.id = id;
		this.name = name;
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
	console.log('=>');
	console.log(this.id);
	console.log(this.name);
	console.log(this.getAttribute('data-component'));
	console.log(cardOrder);

	if(flag.type == 'focus'){
    	console.log("focused!! on " + this.id);
    	whenFocus = new Date();
	}else if (flag.type == 'blur') {
		console.log("blured!! from " +this.id);
    	whenBlur = new Date();
    	var tinyElapsed = whenBlur - whenFocus;
    	console.log("User spend " + tinyElapsed/1000 + " seconds on " + this.id + " field on unique event.");

    	for (var i = 0; i < cardList.length; i++) {
    		for (var j = 0; j < cardList[i].fields.length; j++) {
    			if (this.id == cardList[i].fields[j].id) {
    				console.log('\tmatch');
    				console.log('\t' + this.id);
    				console.log('\t' + cardList[i].fields[j].id);
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
	console.log("cardOrder : " + cardOrder);

	// li element's control type
	var control_type = jfQLi.getAttribute('data-type').split("control_");

	// create card array
	cardList.push(new Card(cardOrder,
						   jfQLi.id,
						   jfQLi.getAttribute('data-type'),
						   control_type[1]));

	//TEXTFIELD
	var inputs = jfQLi.getElementsByTagName('input');
	// this block counts time for 
	// text fields focus and blur events
	for (var i = 0; i < inputs.length; i++) {
		console.log(inputs[i].id);
		console.log(inputs[i].name);
		console.log(inputs[i].getAttribute('data-component'));

		//console.log(cardList[cardOrder]);
		
		cardList[cardOrder].fields.push(new SubField(fieldOrder++,
													 inputs[i].getAttribute('data-component'),
													 inputs[i].id,
													 inputs[i].name));

		inputs[i].addEventListener("focus", textTimeCalculator);
		inputs[i].addEventListener("blur", textTimeCalculator);
	}

	cardOrder++;
}

// control timer state
var timerIndex = 0;
function cardTimerStart(){
	console.log('new card loaded');
	console.log('timer index :' + timerIndex );
	cardStartTime = new Date();
}
function cardOnChange(newIndex){
	console.log("card changed");
	//console.log(this);
	cardEndTime = new Date();
	elapsedTime = cardEndTime - cardStartTime;
	console.log("User spend " + elapsedTime/1000 + " seconds on card " + timerIndex + "  at single view.");
	
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
	console.log(result);
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
	forSubmit[0].addEventListener('submit', writeResult);
}

window.onload = init;




