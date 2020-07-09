let applyScrolling = function (arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    cb.call(null, i, arr[i]);
  }
};

let anchors = document.querySelectorAll("a[href^='#']");
if (window.scrollTo) {
  applyScrolling(anchors, function (index, el) {
    let target = document.getElementById(el.getAttribute('href').substring(1));
    el.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop, left: 0, behavior: 'smooth' });
    });
  });
}
