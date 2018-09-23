colorPickerShowing = false;
colorPickerId = "color-picker";
selectedTR = null;
selectedTD = null;
selectedEventKey = null;
selectedRowId = null;

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

function hideColorPicker() {
  colorPicker = document.getElementById(colorPickerId);
  colorPicker.style.visibility = "hidden";
  body = document.getElementsByTagName("BODY")[0];
  body.style.background = "#eeeeee";
  setTableLight();
  colorPickerShowing = false;
}

function updateColorTableButton(colorId) {
  buttonToUpdate = document.getElementById("color-btn-" + selectedRowId);
  buttonToUpdate.style.backgroundColor = colorMap[colorId];
}

function focusOnRow() {
  body = document.getElementsByTagName("BODY")[0];
  tr = document.getElementById("tr-" + selectedRowId);
  td = document.getElementById("td-" + selectedRowId);
  body.style.background = "#7b7d79";
  tr.style.background = "#e9e9e9";
  td.style.background = "#e9e9e9";
  setTableDark(selectedRowId);
  selectedTR = tr;
  selectedTD = td;
}

function showColorPicker() {
  colorPicker = document.getElementById(colorPickerId);
  colorPickerId = "color-picker-" + selectedRowId;
  colorPicker.id = colorPickerId;
  colorPicker.style.visibility = "visible";
  colorPickerShowing = !colorPickerShowing;
}

function handleColorInputClick() {
  selectedRowId = buttonNumber(this.id);
  selectedEventKey = groupedEvents[this.value];
  if (colorPickerShowing) {
    hideColorPicker();
  } else {
    showColorPicker();
    focusOnRow();
  }
}

function handleResponse(colorId) {
  closeModal();
  hideColorPicker();
  updateColorTableButton(colorId);
}

function handleColorSelectionClick() {
  var colorId = this.id;
  var eventsToUpdate = selectedEventKey;

  updateColorUrl = "http://localhost:5000/color_selection";
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      handleResponse(colorId);
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
  $("#loadingModal").modal();
}

function closeModal() {
  $('#loadingModal').modal('toggle');
}

function addEventListners() {
  addEventListenerToColorInputButtons();
  addEventListenerToColorOptions();
}

function addEventListenerToColorInputButtons() {
  colorInputButtons = document.getElementsByClassName("color-input");
  for (var i = 0; i < colorInputButtons.length; i++) {
    colorInputButtons[i].addEventListener('click', handleColorInputClick);
  }
}

function addEventListenerToColorOptions() {
  colorOptionButtons = document.getElementsByClassName("color-option");
  for (var i = 0; i < colorOptionButtons.length; i++) {
    colorOptionButtons[i].addEventListener('click', handleColorSelectionClick);
  }
}

window.onload = addEventListners;