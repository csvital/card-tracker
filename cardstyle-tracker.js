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

var cardList = [];

var cardOrder = 0;
function cardReader(jfQ){ // jfQ > jotform Question object
	var fieldOrder = 0;
	
	console.log("cardOrder : " + cardOrder++);
	console.log(jfQ.parentNode.parentNode.parentNode.getAttribute('data-type'));

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