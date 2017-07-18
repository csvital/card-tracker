class Card {

  constructor(order,qid,type,name,questionLength = -1) {
    this.order = order;
    this.qid = qid;
    this.type = type;
    this.name = name;
    this.totalClickCount = 0;
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

  constructor(order,type,id,name,length = -1,value = -1) {
    this.order = order;
    this.type = type;
    this.id = id;
    this.name = name;
    this.length = length;
    this.value = value;
    this.interactionCount = 0;
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
function textTimeCalculator(flag) {
  if (flag.type == 'focus') {
    whenFocus = new Date();
  } else if (flag.type == 'blur') {
    if(!whenFocus) {
      return;
    }
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
function cardReader(jfQLi) { // jfQLi > jotform Question li object
  var fieldOrder = 0;
  // li element's control type
  var control_type = jfQLi.getAttribute('data-type');
  var type = jfQLi.getAttribute('data-type').split('control_');
  // for find question text's length
  var questionLabel = jfQLi.querySelector(".jfQuestion-label");

  // create card array
  cardList.push(
    new Card(
      cardOrder,
      jfQLi.id,
      jfQLi.getAttribute('data-type'),
      control_type.length > 1 ? type[1] : control_type,
      questionLabel != null ? (questionLabel.innerHTML != null ? questionLabel.innerHTML.length : 0) : 0)
  );

  // input field analysis
  var inputs = jfQLi.getElementsByTagName('input');
  
  // this block counts time for 
  // text fields focus and blur events
  for (var i = 0; i < inputs.length; i++) {
    // temporarily exclude radio and checkboxes
    if (inputs[i].getAttribute('data-component') == null) {
      // radio or selextbox
      var label = inputs[i].parentNode; // label
      
      label.addEventListener('click', function(e) {

        // count interactions
        for (var i = 0; i < cardList.length; i++) {
          for (var j = 0; j < cardList[i].fields.length; j++) {
            
            if (this.up('li').id == cardList[i].qid && 
              this.querySelector('input').value == cardList[i].fields[j].value) {
              cardList[i].fields[j].interactionCount++;    
            }
          }
        } 
      });

      cardList[cardOrder].fields.push(
        new SubField(
          fieldOrder++, // field order in current card
          inputs[i].type, // what's the input
          -1, // default
          inputs[i].name, // default
          inputs[i].value.length,
          inputs[i].value)
      ); // answer's text length
    } else {
      cardList[cardOrder].fields.push(
        new SubField(
          fieldOrder++,
          inputs[i].getAttribute('data-component'),
          inputs[i].id,
          inputs[i].name)
      );  
    }
    inputs[i].addEventListener("focus", textTimeCalculator);
    inputs[i].addEventListener("blur", textTimeCalculator);
  }
  cardOrder++;
}

// control timer state
var timerIndex = 0;
function cardTimerStart() {
  cardStartTime = new Date();
}
function cardOnChange(newIndex) {
  var prevIndex = navigateHistory[navigateHistory.length-2];
  test();
  for (var i = 0; i < cardList[prevIndex].fields.length; i++) {
  

    if (cardList[prevIndex].fields[i].id != -1) {
      var temp = document.querySelector('#'+cardList[prevIndex].fields[i].id);
    
      cardList[prevIndex].fields[i].characterCounter = temp.value.length;
    }
  }
  cardEndTime = new Date();
  elapsedTime = cardEndTime - cardStartTime;

  // add time record to relevant card object
  for (var i = 0; i < cardList.length; i++) {
    if (cardList[i].order == timerIndex) {
      console.log('elapsedTime', elapsedTime);
      cardList[i].viewThroughTimes.push(elapsedTime);
    }
  }

  if(newIndex == -1) {
    return;
  }
  timerIndex = newIndex;
  cardTimerStart();
  writeResult();
}
// end control timer state

// submit aninda calisir, toplam sureleri hesaplar 
// JSON yapar gonderir, helal olsundur.
function writeResult() {
  var sessionElapsedTime = new Date() - sessionStartTime;
  generalInformation.totalSessionTime = sessionElapsedTime / 1000;

  // cardOnChange(-1); // change on card (-1 exit)

  for (var i = 0; i < cardList.length; i++) {
    cardList[i].fullTime;
  }

  for (var i = 0; i < cardList.length; i++) {
    for (var j = 0; j < cardList[i].fields.length; j++) {
        cardList[i].fields[j].fullTime;
        cardList[i].fields[j].interactionCount /= 2;
    }
  }

  var formID = document.querySelector('form').id;
  var event_id = document.querySelector('input[name="event_id"]').value;

  var totalClickCount = cardList.reduce(function(sum, value) {
    return sum + value.totalClickCount;
  }, 0);
  var result = Array(cardList);
  generalInformation.formID = formID;
  generalInformation.event_id = event_id;
  generalInformation.totalClickCount = totalClickCount;
  generalInformation.navigateHistory = navigateHistory;

  result.unshift(generalInformation);
  var result = JSON.stringify(result);

  if (result !== null) {
    sendData(formID, event_id, result);
  }
}

function test() {
  var errors = document.querySelectorAll('.form-validation-error');
  errors.forEach(function(elem) {
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(mutation.attributeName === 'class') {
        
        }
      });
    });

    // configuration of the observer:
    var config = { attributes: true};
     
    // pass in the target node, as well as the observer options
    observer.observe(elem, config);
  });
}
var navigateHistory = [];
var generalInformation;
// Initialize the widget only select question fields and 
// pass them to reader
function init () {
  var event_id = document.querySelector('input[name="event_id"]');
  if(event_id == null) {
    return;
  }
  event_id = event_id.value;
  sessionStartTime = new Date();
  generalInformation = {
    userAgentString : navigator.userAgent,
    resolution : screen.width + 'x' + screen.height,
    totalSessionTime : 0
  }

  window.previousCard = 0;
  var jfQuestionLi = document.getElementsByClassName('form-line');
  
  for (var i = 0; i < jfQuestionLi.length; i++) {
    cardReader(jfQuestionLi[i]);
  }

  cardTimerStart(0);
  navigateHistory.push(0);
  test();

  var oldFunc = CardForm.setCardIndex;

  CardForm.setCardIndex = (index) => {
    // console.log('next');
    navigateHistory.push(index);
    cardOnChange(index);
    oldFunc(index);
  };
  var forSubmit = document.getElementsByClassName('jotform-form');
  forSubmit[0].addEventListener('submit', writeResult);

  var questionAreas = document.querySelectorAll('.form-line');
  window.previousClick = null;
  for (var i = 0; i < questionAreas.length; i++) {
    questionAreas[i].addEventListener('click', function(e){
      if(window.previousClick !== null && window.previousClick.getAttribute('for') === e.target.getAttribute('id')) {
        window.previousClick = null;
        return;
      }
      if(e.target.tagName === "LABEL") {
        window.previousClick = e.target;
      }
      var currentIndex = CardForm.progress.layoutParams.selectedIndex;
      cardList[currentIndex].totalClickCount++;
    });
  }
}

function sendData(form_id, event_id, data) {
  console.log('result', data);
  // new Ajax.Request('/server.php', {
  //   parameters: {
  //     'action': 'saveCardformData',
  //     'form_id': form_id,
  //     'event_id': event_id,
  //     'data': data
  //   },
  //   evalJSON: 'force'
  // });
}

document.addEventListener('DOMContentLoaded', function() {
  init();
});