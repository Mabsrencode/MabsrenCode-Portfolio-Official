const hamburger = document.querySelector(".hamburger-home");
const navLinks = document.querySelector(".navbar-home");
const links = document.querySelectorAll(".navbar-home li");
const hamburgerAbout = document.querySelector(".hamburger-about");
const navLinksAbout = document.querySelector(".navbar-about");
const linksAbout = document.querySelectorAll(".navbar-about li");
const hamburgerProjects = document.querySelector(".hamburger-projects");
const navLinksProjects = document.querySelector(".navbar-projects");
const linksProjects = document.querySelectorAll(".navbar-projects li");
const hamburgerContact = document.querySelector(".hamburger-contact");
const navLinksContact = document.querySelector(".navbar-contact");
const linksContact = document.querySelectorAll(".navbar-contact li");

hamburger.addEventListener("click", () => {
  //Animate Links
  // navbar.classList.toggle("wide");
  navLinks.classList.toggle("open-home");
  links.forEach((link) => {
    link.classList.toggle("fade-home");
  });

  //Hamburger Animation
  hamburger.classList.toggle("toggle-home");
});
// about navbar responsive
hamburgerAbout.addEventListener("click", () => {
  //Animate Links
  // navbar.classList.toggle("wide");
  navLinksAbout.classList.toggle("open-about");
  linksAbout.forEach((link) => {
    link.classList.toggle("fade-about");
  });

  //Hamburger Animation
  hamburgerAbout.classList.toggle("toggle-about");
});
// about navbar responsive
hamburgerProjects.addEventListener("click", () => {
  //Animate Links
  // navbar.classList.toggle("wide");
  navLinksProjects.classList.toggle("open-projects");
  linksProjects.forEach((link) => {
    link.classList.toggle("fade-projects");
  });
  //Hamburger Animation
  hamburgerProjects.classList.toggle("toggle-projects");
});
//contact navbar responsive
hamburgerContact.addEventListener("click", () => {
  //Animate Links
  // navbar.classList.toggle("wide");
  navLinksContact.classList.toggle("open-contact");
  linksContact.forEach((link) => {
    link.classList.toggle("fade-contact");
  });
  //Hamburger Animation
  hamburgerContact.classList.toggle("toggle-contact");
});

//scroll trigger orientation

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.classList.add("active");
    } else {
      entry.target.classList.remove("show");
      entry.target.classList.remove("active");
    }
  });
});
const hiddenElements = document.querySelectorAll(".hidden");
const hideElements = document.querySelectorAll(
  `.about .about-me-text-h2, 
  .about .reveal-text-first,
   .ren-image-child, 
   .about .reveal-text-first-paragraph,
    .about .reveal-text-second,
     .about .reveal-text-second-paragraph,
      .skills-header,
      .projects-header h2,
      .projects-container-content h3,
      .projects-container-content h4,
      .projects-container-content span,
      .projects-container-img,
      .projects-container-content .projects-content-paragraph,
      .projects-content-icons a`
);
hiddenElements.forEach((e) => observer.observe(e));
hideElements.forEach((e) => observer.observe(e));

const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue(
  "--marquee-elements-displayed"
);
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for (let i = 0; i < marqueeElementsDisplayed; i++) {
  marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}
