window.onload = function () {
  let val = document.getElementsByClassName("text-span");
  for(let i = 0; i < val.length; i++){
    console.log(val[i].textContent)
    val[i].innerHTML = val[i].textContent;
  }
} 