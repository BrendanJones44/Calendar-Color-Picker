NUM_PX_BETWEEN_ROW = 27;
STARTING_COLOR_PICKER_MARGIN_TOP = -25;
UPDATE_COLOR_ENDPOINT = "http://localhost:5000/color_selection";
colorPickerShowing = false;
eventsToUpdate = null;
selectedRowId = null;

function buttonId(buttonString) {
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
  colorPicker = document.getElementById("color-picker");
  colorPicker.style.visibility = "hidden";
  body = document.getElementsByTagName("BODY")[0];
  body.style.background = "#eeeeee";
  setTableLight();
  colorPickerShowing = false;
}

function adjustColorPickerToRow() {
  colorPicker = document.getElementById("color-picker");
  marginPx = STARTING_COLOR_PICKER_MARGIN_TOP + (selectedRowId * NUM_PX_BETWEEN_ROW);
  colorPicker.style.marginTop = marginPx + "px";
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
}

function showColorPicker() {
  colorPicker = document.getElementById("color-picker");
  adjustColorPickerToRow();
  colorPicker.style.visibility = "visible";
  colorPickerShowing = !colorPickerShowing;
}

function handleColorInputClick() {
  selectedRowId = buttonId(this.id);
  eventsToUpdate = groupedEvents[this.value];
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
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      handleResponse(colorId);
    }
  }
  xhr.open("POST", UPDATE_COLOR_ENDPOINT, true);
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

function addEventListners() {
  addEventListenerToColorInputButtons();
  addEventListenerToColorOptions();
}

window.onload = addEventListners;