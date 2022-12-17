function closeDropdown(e) {
  const dropdown = document.querySelector(".dropdown");
  if (dropdown) {
    dropdown.classList.remove("animate-fromRight");
    dropdown.classList.add("pointer-events-none");
  }
}

function openDropdown(e) {
  const dropdown = document.querySelector(".dropdown");
  if (dropdown) {
    dropdown.classList.add("animate-fromRight");
    dropdown.classList.remove("pointer-events-none");
  }
}

window.addEventListener("load", function (e) {
  const instructors = document.getElementsByClassName("instructor");
  const close_dropdown = document.getElementById("close_dropdown");
  const filter = document.getElementById("filter");

  if (close_dropdown) {
    close_dropdown.addEventListener("click", closeDropdown);
  }

  if (filter) {
    filter.addEventListener("click", openDropdown);
  }

  if (instructors && instructors.length > 0) {
    Array.from(instructors).map((elmt, index) => {
      elmt.style.animationDelay = index * 100 + "ms";
    });
  }
});
