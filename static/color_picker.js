colorPickerShowing = false;
colorPickerId = "color-picker";
selectedTR = null;
selectedTD = null;

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

function addEventListners() {
  colorInputButtons = document.getElementsByClassName("color-input");
  for (var i = 0; i < colorInputButtons.length; i++) {
    colorInputButtons[i].addEventListener('click', handleColorInputClick);
  }
}
window.onload = addEventListners;