class Card {
	constructor(cardOrder,cardType,cardName){
		this.cardOrder = cardOrder;
		this.cardType = cardType;
		this.cardName = cardName;
		this.cardShowEvents = [];
		this.cardFullTime = 0;
		this.cardFields = [];
	}
}
class SubField {
	constructor(subFieldOrder,subFieldType,subFieldId,subFieldName){
		this.subFieldOrder = subFieldOrder;
		this.subFieldType = subFieldType;
		this.subFieldId = subFieldId;
		this.subFieldName = subFieldName;
		this.subFieldEvents = [];
		this.subFieldFullTime = 0;
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

cardId = null;

function findIsVisibleCard(){
	console.log("welcome to my termination");
	visibleCard = document.querySelectorAll('.isVisible');
	cardStartTime = new Date();
	console.log(visibleCard);
	console.log(visibleCard[0].id);
	console.log("i'm the voice of war");
	cardId = visibleCard[0].id;
}

function cardOnChange(){
	console.log("nexte, progresse veya preve basti");
	console.log(this);
	cardEndTime = new Date();
	elapsedTime = cardEndTime - cardStartTime;
	
	
	console.log("User spend " + elapsedTime/1000 + " seconds on " + cardId + " card on unique view.");

	
	findIsVisibleCard();

	console.log("Her onchange'de cardListi basarim");
	console.log(cardList);
}

// Initialize the widget only select question fields and 
// pass them to reader
function init () {
	var jfQuestionFields = document.getElementsByClassName("jfQuestion-fields");
	console.log(jfQuestionFields);
	for (var i = 0; i < jfQuestionFields.length; i++) {
		cardReader(jfQuestionFields[i]);
	}
	
	// visible olani bul
	findIsVisibleCard();

	// next'e basildi mi?
	// find next buttons and add listener for onchange events
	var nextButtons = document.querySelectorAll('.forNext');
	console.log(nextButtons);
	for (var i = 0; i < nextButtons.length; i++) {
		nextButtons[i].addEventListener("click", cardOnChange);
	}
	var prevButtons = document.querySelectorAll('.forPrev');
	console.log(prevButtons);
	for (var i = 0; i < prevButtons.length; i++) {
		prevButtons[i].addEventListener("click", cardOnChange);
	}

	var progressItems = document.querySelectorAll('.jfProgress-item');
	console.log("Progress Items");
	console.log(progressItems);
	for (var i = 0; i < progressItems.length; i++) {
		progressItems[i].addEventListener("click", cardOnChange);
	}

	var oldFunc = CardForm.setCardIndex;
	CardForm.setCardIndex = (index) => {
 		console.log("==>>"+index);
  		oldFunc(index);
	};

	// EOC


	// textArea for detailed report
	var textArea = document.getElementsByTagName('textarea');
	console.log(textArea);
	textArea[0].innerHTML = "Sa";

}



window.onload = init;




