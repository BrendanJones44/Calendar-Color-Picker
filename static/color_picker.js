colorPickerShowing = false;
colorPickerId = "color-picker";

function buttonNumber(buttonString) {
  return buttonString.replace("color-btn-", "")
}

function handleColorInputClick() {
  colorPicker = document.getElementById(colorPickerId);
  colorPickerId = "color-picker-" + buttonNumber(this.id);
  colorPicker.id = colorPickerId;
  if (colorPickerShowing) {
    colorPicker.style.visibility = "hidden";
  } else {
    colorPicker.style.visibility = "visible";
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