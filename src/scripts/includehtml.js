function ltco_includeHTML() {
  const z = document.getElementsByTagName("*");

  for (let i = 0; i < z.length; i++) {
    let elmnt = z[i];

    const file = elmnt.getAttribute("ltco-include-html");

    if (file) {
      const xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}

          elmnt.removeAttribute("ltco-include-html");

          ltco_includeHTML();
        }
      }

      xhttp.open("GET", file, true);
      xhttp.send();

      return;
    }
  }
}

ltco_includeHTML();
