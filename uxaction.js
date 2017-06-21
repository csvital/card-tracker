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
function cardReader(jfQLi){ // jfQLi > jotform Question li object
	var fieldOrder = 0;
	console.log("cardOrder : " + cardOrder);
	//console.log(jfQ.parentNode.parentNode.parentNode.getAttribute('data-type'));
	//console.log(jfQ.children);
	//console.log('>>');
	//console.log(jfQ.getElementsByTagName('input'));

	var inputs = jfQLi.getElementsByTagName('input');

	//console.log(inputs[0]);

	// this block counts time for 
	// text fields focus and blur events
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener("focus", textTimeCalculator);
		inputs[i].addEventListener("blur", textTimeCalculator);
	}

	// li element's control type
	//var type = jfQ.parentNode.parentNode.parentNode.getAttribute('data-type');
	//var control_type = jfQ.parentNode.parentNode.parentNode.getAttribute('data-type').split("control_");
	
	//console.log("\t"+control_type[1]);

	//for (var i = 0; i < jfQLi.childElementCount; i++) {
	//	console.log("\tfieldOrder : " + fieldOrder++);
		//console.log("\t\t"+jfQ.children[i].children[i].id);	
	//}
	
	
	var type = jfQLi.getAttribute('data-type');
	var control_type = jfQLi.getAttribute('data-type').split("control_");

	// create card array
	cardList.push(new Card(cardOrder++,jfQLi.id,type,control_type[1]));


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
	console.log("User spend " + elapsedTime/1000 + " seconds on " + timerIndex + " card on unique view.");
	

	// add time record to relevant card object
	for (var i = 0; i < cardList.length; i++) {
		//console.log(cardList[i]);
		if(cardList[i].order == timerIndex){
			cardList[i].viewThroughTimes.push(elapsedTime);
		}
	}

	timerIndex = newIndex;

	cardTimerStart();
	//console.log("Her onchange'de cardListi basarim");
	//console.log(cardList);
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
	
	// textArea for detailed report
	var textArea = document.getElementsByTagName('textarea');
	//console.log(textArea);
	textArea[0].innerHTML = "Sa";
}

window.onload = init;




