colorPickerShowing = false;
colorPickerId = "color-picker";
selectedTR = null;
selectedTD = null;
selectedEventKey = null;

function buttonNumber(buttonString) {
  return buttonString.replace("color-btn-", "")
}

function setTableDark(num){
  for(i=0; i < 5; i++){
    if (i !== Number(num)){
      document.getElementById("tr-" + i).style.background = "#7b7d79";
      document.getElementById("td-" + i).style.background = "#7b7d79";
    }
  }
}

function setTableLight(){
  for (i = 0; i < 5; i++) {
    document.getElementById("tr-" + i).style.background = "#eeeeee";
    document.getElementById("td-" + i).style.background = "#eeeeee";
  }
}

function handleColorInputClick() {
  buttonNum = buttonNumber(this.id);
  selectedEventKey = groupedEvents[this.value];
  colorPicker = document.getElementById(colorPickerId);
  colorPickerId = "color-picker-" + buttonNum;
  colorPicker.id = colorPickerId;
  body = document.getElementsByTagName("BODY")[0];
  tr = document.getElementById("tr-" + buttonNum);
  td = document.getElementById("td-" + buttonNum);
  if (colorPickerShowing) {
    colorPicker.style.visibility = "hidden";
    body.style.background = "#eeeeee";
    setTableLight();
  } else {
    colorPicker.style.visibility = "visible";
    body.style.background = "#7b7d79";
    tr.style.background = "#e9e9e9";
    td.style.background = "#e9e9e9";
    setTableDark(buttonNum);
    selectedTR = tr;
    selectedTD = td;
  }
  colorPickerShowing = !colorPickerShowing;
}

function handleColorSelectionClick() {
  console.log(selectedEventKey);
  console.log(this.id);
  var colorId = this.id;
  var eventsToUpdate = selectedEventKey;

  updateColorUrl = "http://localhost:5000/color_selection";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      closeModal();
      console.log("close");
    }
  }
  xhr.open("POST", updateColorUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
    "newColorId": colorId,
    "events": eventsToUpdate
  }));
  openModal();
}
function openModal() {
  // modal = document.getElementById("loadingModal");
  // modal.modal();
  $("#loadingModal").modal();
}
function closeModal() {
  $('#loadingModal').modal('toggle');
}

function addEventListners() {
  colorInputButtons = document.getElementsByClassName("color-input");
  for (var i = 0; i < colorInputButtons.length; i++) {
    colorInputButtons[i].addEventListener('click', handleColorInputClick);
  }
  addEventListenerToColorOptions();
}

function addEventListenerToColorOptions() {
  colorOptionButtons = document.getElementsByClassName("color-option");
  for (var i = 0; i < colorOptionButtons.length; i++) {
    colorOptionButtons[i].addEventListener('click', handleColorSelectionClick);
  }
}
window.onload = addEventListners;