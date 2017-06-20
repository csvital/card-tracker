/**
 * Created by hayatiibis on 19/06/2017.
 */

class MyField {
    constructor(fieldId,fieldName){
        this.fieldId = fieldId;
        this.fieldName = fieldName;
        this.eventTimerArray = [];
        this.fullTimeOnThis = 0;
    }

    get fullTime() {
        return this.calcFullTime();
    }

    calcFullTime() {
        var sum = 0;
        for (var i = 0; i < this.eventTimerArray.length; i++) {
            sum += this.eventTimerArray[i];
        }
        this.fullTimeOnThis = sum/1000;
        return this.fullTimeOnThis;
    }
}

var whenFocus;
var whenBlur;
var tinyElapsed;
var newFieldArray = [];

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

    // @lazySolution
    for (var i = 0; i < newFieldArray.length; i++) {
        if (newFieldArray[i].fieldId == this.id) {
            newFieldArray[i].eventTimerArray.push(tinyElapsed);
        }
    }
}

function getResults () {
    for (var i = 0; i < newFieldArray.length; i++) {
        newFieldArray[i].fullTime;
    }
    console.log(newFieldArray);
    setTimeout(function(){alert("hi")}, 5000);
};


function getOption(){
    console.log("Selected option value : " + this.value);
}

function startInteraction(){
    console.log("geldi")
}

function endInteraction(){
    console.log("gitti")
}

function init() {

    var jfFields = document.getElementsByClassName("jfField");

    console.log(jfFields);




    var done = document.getElementsByClassName("form-submit-button");

    console.log(done);
    var texts = document.querySelectorAll("input[type=text]");

    var checkboxes = document.querySelectorAll("input[type=checkbox]");

    var radios = document.querySelectorAll("input[type=radio]");

    var dropdowns = $$('[class^=form-dropdown]'); // prototype.js partial selector

    var isVisibleLi = $$('[class~=isVisible]');

    console.log(isVisibleLi)

    console.log(done);
    console.log(texts);
    console.log(checkboxes);
    console.log(radios);
    console.log(dropdowns);

    for (var i = 0; i < texts.length; i++) {
        if(texts[i].id != "" && texts[i].name != ""){
            newFieldArray.push(new MyField(texts[i].id,texts[i].name));
        }

        texts[i].addEventListener("focus", startTimer, true);
        texts[i].addEventListener("blur", endTimer, true);
    }
}

window.onload = init;