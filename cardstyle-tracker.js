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



function startTimer(){
    console.log("focused!! on " + this.id);
    whenFocus = new Date();
    console.log(whenFocus);
}

function endTimer(){
    console.log("blured!! from " +this.id);
    whenBlur = new Date();
    console.log(whenBlur);
    var tinyElapsed = whenBlur - whenFocus;
    console.log("User spend " + tinyElapsed/1000 + " seconds on " + this.id + " field on unique event.");
}

var cardList = [];

var cardOrder = 0;
function cardReader(jfQ){ // jfQ > jotform Question object
	var fieldOrder = 0;
	
	console.log("cardOrder : " + cardOrder++);
	//console.log(jfQ.parentNode.parentNode.parentNode.getAttribute('data-type'));

	console.log(jfQ.children);

	console.log('>>');
	console.log(jfQ.getElementsByTagName('input'));

	var inputs = jfQ.getElementsByTagName('input');

	console.log(inputs[0]);

	inputs[0].addEventListener("focus", function(){
    			console.log("focused!! on " + this.id);
    			whenFocus = new Date();
    			console.log(whenFocus);
				});
	inputs[0].addEventListener("blur", function(){
				console.log("blured!! from " +this.id);
    			whenBlur = new Date();
    			console.log(whenBlur);
    			var tinyElapsed = whenBlur - whenFocus;
    			console.log("User spend " + tinyElapsed/1000 + " seconds on " + this.id + " field on unique event.");
				});

	//jfQ.children.childNodes[0].addEventListener("focus", startTimer, true);
	//jfQ.children.childNodes[0].addEventListener("blur", endTimer, true);

	// li element's control type
	var control_type = jfQ.parentNode.parentNode.parentNode.getAttribute('data-type').split("control_");
	
	console.log("\t"+control_type[1]);
	
	for (var i = 0; i < jfQ.childElementCount; i++) {
		console.log("\tfieldOrder : " + fieldOrder++);	
	}



}

function init () {
	var jfQuestionFields = document.getElementsByClassName("jfQuestion-fields");
	console.log(jfQuestionFields);
	for (var i = 0; i < jfQuestionFields.length; i++) {
		cardReader(jfQuestionFields[i]);
	}


}
window.onload = init;