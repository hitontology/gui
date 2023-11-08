function classified(title, link) {
  return `<div class="classified">
          <details>
		    <summary>
              <a href="${link}">${title}</a>
		    </summary>
			More information describing the classified.
          </details>
		  <hr>
        </div>`;
}

function classifieds() {
  const container = document.getElementById("classifieds");
  for (let i = 1; i <= 10; i++) {
    let html = classified("Classified " + i, "details.html?swp=Commercial RIS " + i);
    let fragment = document.createRange().createContextualFragment(html);
    container.appendChild(fragment);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get("cat");
    document.getElementById("cataloguename").innerText = `${cat}`;
    classifieds();
  },
  false
);
