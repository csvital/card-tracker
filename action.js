class Card {
	constructor(order,type,name){
		this.order = order;
		this.type = type;
		this.name = name;
		this.previewEvents = [];
		this.previewFullTime = 0;
		this.fields = [];
	}
}
class SubField {
	constructor(order,type,id,name){
		this.order = order;
		this.type = type;
		this.id = id;
		this.name = name;
		this.events = [];
		this.fullTime = 0;
	}
}

// text field'da gecen sureyi
// hesaplayan adamlar
function textTimeCalculator(flag){
	//console.log(">>>>>>");
	//console.log(flag.type);
	// flag has event attributes
	if(flag.type == 'focus'){
    	console.log("focused!! on " + this.id);
    	whenFocus = new Date();
    	//console.log(whenFocus);
	}else if (flag.type == 'blur') {
		console.log("blured!! from " +this.id);
    	whenBlur = new Date();
    	//console.log(whenBlur);
    	var tinyElapsed = whenBlur - whenFocus;
    	console.log("User spend " + tinyElapsed/1000 + " seconds on " + this.id + " field on unique event.");
	}
}

// question field detailed reader and executioner
var cardList = [];
var cardOrder = 0;
function cardReader(jfQ){ // jfQ > jotform Question object
	var fieldOrder = 0;
	
	console.log("cardOrder : " + cardOrder++);
	//console.log(jfQ.parentNode.parentNode.parentNode.getAttribute('data-type'));

	//console.log(jfQ.children);

	//console.log('>>');
	//console.log(jfQ.getElementsByTagName('input'));


	var inputs = jfQ.getElementsByTagName('input');

	//console.log(inputs[0]);

	// this block counts time for 
	// text fields focus and blur events
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener("focus", textTimeCalculator);
		inputs[i].addEventListener("blur", textTimeCalculator);
	}

	// li element's control type
	var type = jfQ.parentNode.parentNode.parentNode.getAttribute('data-type');
	var control_type = jfQ.parentNode.parentNode.parentNode.getAttribute('data-type').split("control_");
	
	console.log("\t"+control_type[1]);
	
	for (var i = 0; i < jfQ.childElementCount; i++) {
		console.log("\tfieldOrder : " + fieldOrder++);	
	}

	// create card array
	cardList.push(new Card(cardOrder,type,control_type[1]));
}



function cardTimerStart(){
	console.log('new card loaded');
	cardStartTime = new Date();
}

function cardOnChange(){
	console.log("card changed");
	//console.log(this);
	cardEndTime = new Date();
	elapsedTime = cardEndTime - cardStartTime;
	console.log("User spend " + elapsedTime/1000 + " seconds on ? card on unique view.");
	
	cardTimerStart();
	//console.log("Her onchange'de cardListi basarim");
	//console.log(cardList);
}

// Initialize the widget only select question fields and 
// pass them to reader
function init () {
	var jfQuestionFields = document.getElementsByClassName("jfQuestion-fields");
	console.log(jfQuestionFields);
	for (var i = 0; i < jfQuestionFields.length; i++) {
		cardReader(jfQuestionFields[i]);
	}
	
	cardTimerStart();

	var oldFunc = CardForm.setCardIndex;
	CardForm.setCardIndex = (index) => {
 		console.log("==>>"+index);
 		cardOnChange();
  		oldFunc(index);
	};
	
	// textArea for detailed report
	var textArea = document.getElementsByTagName('textarea');
	console.log(textArea);
	textArea[0].innerHTML = "Sa";
}

window.onload = init;




