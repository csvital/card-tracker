class Card {
	constructor(order,qid,type,name,questionLength = -1){
		this.order = order;
		this.qid = qid;
		this.type = type;
		this.name = name;
		this.questionLength = questionLength;
		this.totalClickCount = 0;
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
	constructor(order,type,id,name,length = -1,value = -1){
		this.order = order;
		this.type = type;
		this.id = id;
		this.name = name;
		this.length = length;
		this.value = value;
		this.interactionCount = 0;
		this.events = [];
		this.fieldfullTime = 0;
		this.characterCounter = -1;
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
var sessionStartTime;
function cardReader(jfQLi){ // jfQLi > jotform Question li object
	var fieldOrder = 0;
	// li element's control type
	var control_type = jfQLi.getAttribute('data-type');
	var type = jfQLi.getAttribute('data-type').split('control_');
	// for find question text's length
	var questionLabel = jfQLi.querySelector(".jfQuestion-label");
	
	// console.log('questionLabel', questionLabel);
	
	// create card array
	cardList.push(new Card(cardOrder,
						   jfQLi.id,
						   jfQLi.getAttribute('data-type'),
						   control_type.length > 1 ? type[1] : control_type,
						   questionLabel != null ? (questionLabel.innerHTML != null ? questionLabel.innerHTML.length : 0) : 0)
						   // questionLabel.innerHTML != null ? questionLabel.innerHTML.length : 0)
						);

	// input field analysis
	var inputs = jfQLi.getElementsByTagName('input');
	// console.log('inputs', inputs);

	// PATCH for textarea, dropdown, static text and images
	if (inputs.length == 0) {
		// console.log('hop');
		// console.log('jfQLi', jfQLi);
		// console.log('jfQLi.getElementsByTagName("textarea")', jfQLi.getElementsByTagName('textarea'));
		inputs = jfQLi.getElementsByTagName('textarea');
	}
	
	// this block counts time for 
	// text fields focus and blur events
	for (var i = 0; i < inputs.length; i++) {
		// temporarily exclude radio and checkboxes
		if (inputs[i].getAttribute('data-component') == null) {
			// radio or selextbox

			var label = inputs[i].parentNode; // label
			
			label.addEventListener('click', function(e){

				// TODO fix future two click problem
				// console.log('e.currentTarget===e.target', e.currentTarget===e.target);
				
				// count interactions
				for (var i = 0; i < cardList.length; i++) {
    				for (var j = 0; j < cardList[i].fields.length; j++) {
    					
    					if (this.up('li').id == cardList[i].qid && 
    						this.querySelector('input').value == cardList[i].fields[j].value) {

    					    //console.log('this.up.id', this.up('li').id);
    					 	//console.log('cardList[i].qid', cardList[i].qid);
    					 	//console.log('this.querySelector(input).value', this.querySelector('input').value);
    					    //console.log('cardList[i].fields[j].value', cardList[i].fields[j].value);

							cardList[i].fields[j].interactionCount++;    
    					}
    				}
    			}	
			});

			cardList[cardOrder].fields.push(new SubField(fieldOrder++, // field order in current card
													 inputs[i].type, // what's the input
													 -1, // default
													 inputs[i].name, // default
													 inputs[i].value.length,
													 inputs[i].value)); // answer's text length

			// interactionlari saymak lazim -> saydik 


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

	var prevIndex = navigateHistory[navigateHistory.length-2];
	// console.log('prev index ', prevIndex);

	// console.log('cardList[prevIndex]', cardList[prevIndex]);
	for (var i = 0; i < cardList[prevIndex].fields.length; i++) {
		// console.log('cardList[prevIndex].fields[i].id', cardList[prevIndex].fields[i].id);

		if (cardList[prevIndex].fields[i].id != -1) {
			var temp = document.querySelector('#'+cardList[prevIndex].fields[i].id);
			// console.log('temp', temp.value.length);
			cardList[prevIndex].fields[i].characterCounter = temp.value.length;
		}
	}


	cardEndTime = new Date();
	elapsedTime = cardEndTime - cardStartTime;
	
	// add time record to relevant card object
	for (var i = 0; i < cardList.length; i++) {
		if(cardList[i].order == timerIndex){
			cardList[i].viewThroughTimes.push(elapsedTime);
		}
	}
	if(newIndex == -1) {
		return;
	}
	timerIndex = newIndex;
	cardTimerStart();
}
// end control timer state

// submit aninda calisir, toplam sureleri hesaplar 
// JSON yapar gonderir, helal olsundur.
function writeResult(){
	var sessionElapsedTime = new Date() - sessionStartTime;
	console.log('sessionElapsedTime', sessionElapsedTime);
	generalInformation.totalSessionTime = sessionElapsedTime / 1000;

	cardOnChange(-1); // change on card (-1 exit)
	for (var i = 0; i < cardList.length; i++) {
		cardList[i].fullTime;
	}

	for (var i = 0; i < cardList.length; i++) {
    	for (var j = 0; j < cardList[i].fields.length; j++) {
   				cardList[i].fields[j].fullTime;
   				cardList[i].fields[j].interactionCount /= 2;
   	   	}
    }

	//console.log(cardList);
	cardList.unshift(generalInformation);
	var result = JSON.stringify(cardList);

	function download(text, name, type) {
	    var a = document.createElement("a");
	    var file = new Blob([text], {type: type});
	    a.href = URL.createObjectURL(file);
	    a.download = name;
	    a.click();
	}
	download(result, 'result.txt', 'text/plain');	
}

var labelFlag = false;

var navigateHistory = [];
var generalInformation;
// Initialize the widget only select question fields and 
// pass them to reader
function init () {
	
	sessionStartTime = new Date();
	console.log('sessionStartTime', sessionStartTime);

	console.log('navigator.userAgent', navigator.userAgent);
	console.log('window.resolution : ', screen.width + 'x' + screen.height);
	generalInformation = {
		userAgentString : navigator.userAgent,
		resolution : screen.width + 'x' + screen.height,
		totalSessionTime : 0
	}

	var jfQuestionLi = document.getElementsByClassName('form-line');
	for (var i = 0; i < jfQuestionLi.length; i++) {
		cardReader(jfQuestionLi[i]);
	}

	//console.log(cardList);
	
	cardTimerStart(0);
	navigateHistory.push(0);

	var oldFunc = CardForm.setCardIndex;
	CardForm.setCardIndex = (index) => {
		// console.log('current index', index);
		navigateHistory.push(index);
 		cardOnChange(index);
  		oldFunc(index);
	};

	var forSubmit = document.getElementsByClassName('jotform-form');
	forSubmit[0].addEventListener('submit', writeResult);



	var questionAreas = document.querySelectorAll('.jfCard-question');
	console.log('questionAreas', questionAreas);

	for (var i = 0; i < questionAreas.length; i++) {
		questionAreas[i].addEventListener('click', function(evt){
			console.log('evt', evt);
			console.log('evt.target', evt.target);
			console.log('evt.currentTarget', evt.currentTarget);
			console.log('evt.target.id', evt.target.getAttribute('id'));
			console.log('evt.currentTarget', evt.currentTarget.querySelector('label').getAttribute('for'));
			
			var isLabelExist = evt.currentTarget.querySelector('label') === null ? false : true;
			console.log('isLabelExist', isLabelExist);
			if( evt.currentTarget.querySelector('label').getAttribute('for') == evt.target.getAttribute('id') ){
				console.log('clicked');
				cardList[navigateHistory[navigateHistory.length-1]].totalClickCount++;
			}
		});
	}
}
window.onload = init;

// when user leaves the page
//window.onbeforeunload = confirmExit;
//function confirmExit()
//{
//	console.log('cardOrder', cardOrder);
	//return "You have attempted to leave this page. If you have made any changes to the fields without clicking the Save button, your changes will be lost.  Are you sure you want to exit this page?";
//}