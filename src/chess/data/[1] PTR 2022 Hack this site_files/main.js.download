String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function submit(e) {
	e.preventDefault();
	console.log("Asd");

	const xhttp = new XMLHttpRequest();
	var flag = document.getElementById("flag").value.hashCode();

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState === 4) {
			window.location = "/challenge";
    }
  }
	var x = ((flag == 1867359683) ? "" : "n") + "o";
	xhttp.open("POST", "/challenge", true);

	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send("flag=" + x + "k");
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("form").onsubmit = submit
});
