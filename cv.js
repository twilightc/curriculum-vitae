const isVisible = 'is-visible';

document.addEventListener('click', (e) => {
  if (e.target == document.querySelector('.modal.is-visible')) {
    document.querySelector('.modal.is-visible').classList.remove(isVisible);
    setTimeout(() => {
      let el = document.querySelector('.modal-img');
      if (el) {
        el.remove();
      }
    }, 500);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key == 'Escape' && document.querySelector('.modal.is-visible')) {
    document.querySelector('.modal.is-visible').classList.remove(isVisible);
    setTimeout(() => {
      let el = document.querySelector('.modal-img');
      if (el) {
        el.remove();
      }
    }, 500);
  }
});
