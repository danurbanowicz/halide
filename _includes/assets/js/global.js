window.addEventListener("DOMContentLoaded", (event) => {

  // Detect when site images have loaded and add a loaded class
  const lazyImages = document.querySelectorAll("img");

  // Loop over the images
  Array.from(lazyImages).forEach(img => {
    // Add the loaded class if already loaded
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.add("loaded");
    // If not already loaded, listen for the load event
    } else {
      img.addEventListener("load", () => {
        // Once loaded, apply the loaded class
        img.classList.add("loaded");
      });
    }
  });

});
