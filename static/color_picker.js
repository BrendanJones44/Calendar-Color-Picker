colorPickerShowing = false;
function handleColorInputClick() {
  if (colorPickerShowing) {
    document.getElementById("color-picker").style.visibility = "hidden";
  } else {
    document.getElementById("color-picker").style.visibility = "visible";
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