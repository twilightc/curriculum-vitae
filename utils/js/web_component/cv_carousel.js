const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      height: 100%;
      margin: 0;
    }

    @media(max-width:500px){
      img{
        width:100%;
        max-width:400px;
      }
    }

    .carousel-wrapper {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    .carousel {
      width: 600px;
      height: 400px;
      top: 0;
      overflow: hidden;
      position: relative;
    }
    @media(max-width:600px){
      .carousel{
        width:400px;
      }
    }


    .carousel-photo {
      width: 100%;
      height: 100%;
      position: absolute;
    }

    .prev {
      left: 0;
    }

    .next {
      right: 0;
    }

    .prev,
    .next {
      width: 40px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
    }

    .arrow {
      color: rgba(0, 255, 255, 0.75);
      width: inherit;
      z-index: 85;
      height: 40px;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0;
      user-select: none;
    }

    .arrow:hover {
      animation-name: buttonSlider;
      animation-duration: 1.5s;
      animation-fill-mode: forwards;
    }

    @keyframes buttonSlider {
      from {
        color: rgba(0, 255, 255, 0.75);
        font-size: 20px;
      }
      to {
        color: rgba(0, 255, 255, 1);
        font-size: 28px;
      }
    }

    .indicators {
      position: absolute;
      bottom: 0;
      z-index: 80;
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .indicator {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin: 0 5px;
      background-color: rgba(0, 255, 255, 0.3);
      cursor: pointer;
    }

    .indicator:hover {
      animation: indicatorHover;
      animation-duration: 1s;
      animation-fill-mode: forwards;
    }

    @keyframes indicatorHover {
      from {
        background-color: rgba(0, 255, 255, 0.3);
      }
      to {
        background-color: rgba(0, 255, 255, 1);
      }
    }

    .active {
      z-index: 60;
    }

    .indicator.active {
      background-color: rgba(0, 255, 127, 0.9);
    }

    .leave-to-rightside {
      animation: LeaveToRightside;
      animation-duration: 500ms;
    }

    @keyframes LeaveToRightside {
      from {
        transform: translateX(0%);
        z-index: 60;
      }
      to {
        transform: translateX(100%);
        z-index: 0;
      }
    }

    .enter-from-leftside {
      animation: EnterFromLeftside;
      animation-duration: 500ms;
    }

    @keyframes EnterFromLeftside {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0%);
      }
    }

    .enter-from-rightside {
      animation: EnterFromRightside;
      animation-duration: 500ms;
    }

    @keyframes EnterFromRightside {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0%);
      }
    }

    .leave-to-leftside {
      animation: LeaveToLeftside;
      animation-duration: 500ms;
    }

    @keyframes LeaveToLeftside {
      from {
        transform: translateX(0%);
        z-index: 60;
      }
      to {
        transform: translateX(-100%);
        z-index: 0;
      }
    }
  </style>


  <div class="carousel-wrapper">
      <div class="carousel">

        <div class="prev">
          <div class="arrow">
            &#10094;
          </div>
        </div>
        <div class="next">
          <div class="arrow">&#10095;</div>
        </div>
        <div class="indicators">
        </div>
      </div>
    </div>
`;

class CustCarousel extends HTMLElement {
  constructor(carouselCleaner) {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.carouselCleaner = carouselCleaner;
    this._imgsToShow = [];
  }

  set imgsToShow(val) {
    this._imgsToShow = val;
  }

  get imgsToShow() {
    return this._imgsToShow;
  }

  set imgSource(val) {
    this.setAttribute('imgSource', val);
  }

  get imgSource() {
    return this.getAttribute('imgSource');
  }

  static get observedAttributes() {
    return ['imgSource'];
  }

  attributeChangedCallback(prop, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }

    console.log('attributeChangeCallback', prop);

    // prop === 'imgSource'
    if (this.imgSource) {
      let imgs = this.imgSource.split(',');
      let arrowPrev = this.shadowRoot.querySelector('.prev');

      imgs.forEach((img) => {
        let imgElement = this.shadowRoot.createElement('img');
        imgElement.setAttribute('src', img);
        arrowPrev.insertBefore(imgElement, arrowPrev);
      });
      this.render();
    }
  }

  connectedCallback() {
    if (this.imgsToShow) {
      let imgs = this.imgsToShow;
      let carousel = this.shadowRoot.querySelector('.carousel');
      let arrowPrev = this.shadowRoot.querySelector('.prev');
      let indicators = this.shadowRoot.querySelector('.indicators');

      imgs.forEach((img, index) => {
        let element = document.createElement('img');
        element.setAttribute('src', img);
        element.dataset.open = 'img' + (index + 1);
        element.classList.add('carousel-photo');
        if (index === 0) element.classList.add('active');
        carousel.insertBefore(element, arrowPrev);

        let indicatorElement = document.createElement('div');
        indicatorElement.classList.add('indicator');
        indicatorElement.setAttribute('data-pointing', index);
        indicators.appendChild(indicatorElement);

        element.addEventListener('click', (e) => {
          e.preventDefault();
          const imgClicked = new CustomEvent('imgClickEvent', {
            bubbles: true,
            composed: true,
            detail: {
              element: e.target.cloneNode(true),
              src: e.target.getAttribute('src'),
            },
          });
          this.shadowRoot.dispatchEvent(imgClicked);
        });
      });

      this.render();
    }
  }

  /**
   * Activating carousel, return function to remove evenlisteners.
   *
   * @param {Element} element register Elements to be carousels
   * @param {number} interval time to switch photo(ms)
   * @returns {()=>void} Remove EventListeners
   */
  setCarousel(element, interval) {
    let photos = element.querySelectorAll('.carousel-photo');
    let currentIndex = Array.from(
      element.querySelector('.carousel-photo')
    ).findIndex((data) => data.classList.contains('active'));
    let indicators = element.querySelector('.indicators');
    let prev = element.querySelector('.prev');
    let next = element.querySelector('.next');

    let debounceMoving = true;
    let currentIndicator = Array.from(indicators.children).findIndex((data) =>
      data.classList.contains('active')
    );
    if (currentIndicator === -1) {
      currentIndex = 0;
      indicators.children[currentIndex].classList.add('active');
    }

    let canAutoSlides = null;
    if (interval) {
      canAutoSlides =
        typeof interval === 'number' && setInterval(toNext, interval);
    }

    function clearAutoSlides() {
      if (canAutoSlides) {
        clearInterval(canAutoSlides);
        canAutoSlides = null;
      }
    }

    function autoSlides() {
      if (interval && typeof interval === 'number') {
        canAutoSlides = setInterval(toNext, interval);
      }
    }

    function toPrev() {
      if (!debounceMoving) {
        return;
      }

      debounceMoving = false;
      let nextStatusIndex =
        currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
      let currentImg = photos[currentIndex];
      let nextImg = photos[nextStatusIndex];

      moveFromRightToLeft(currentImg, nextImg);
      moveIndicator(currentIndex, nextStatusIndex);

      currentIndex = nextStatusIndex;
    }

    function toNext() {
      if (!debounceMoving) {
        return;
      }

      debounceMoving = false;
      let nextStatusIndex =
        currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
      let currentImg = photos[currentIndex];
      let nextImg = photos[nextStatusIndex];

      moveFromLeftToRight(currentImg, nextImg);
      moveIndicator(currentIndex, nextStatusIndex);

      currentIndex = nextStatusIndex;
    }

    function moveFromRightToLeft(currentImg, nextImg) {
      currentImg.classList.remove('active');
      currentImg.classList.remove('enter-from-leftside');
      currentImg.classList.add('leave-to-rightside');

      nextImg.classList.add('active');
      nextImg.classList.add('enter-from-leftside');
      nextImg.classList.remove('leave-to-rightside');
      setTimeout(() => {
        currentImg.classList.remove('leave-to-rightside');
        nextImg.classList.remove('enter-from-leftside');
        debounceMoving = true;
      }, 500);
    }

    function moveFromLeftToRight(currentImg, nextImg) {
      currentImg.classList.remove('active');
      currentImg.classList.remove('enter-from-rightside');
      currentImg.classList.add('leave-to-leftside');

      nextImg.classList.add('active');
      nextImg.classList.add('enter-from-rightside');
      nextImg.classList.remove('leave-to-leftside');
      setTimeout(() => {
        currentImg.classList.remove('leave-to-leftside');
        nextImg.classList.remove('enter-from-rightside');
        debounceMoving = true;
      }, 500);
    }

    /**
     * @param { Event } e
     */
    function toSpecficImg(e) {
      if (!debounceMoving) {
        return;
      }
      let nextIndex = parseInt(e.target.dataset.pointing, 10);

      if (currentIndex === nextIndex) {
        return;
      }

      let currentImg = photos[currentIndex];
      let nextImg = photos[nextIndex];

      if (!currentImg || !nextImg) {
        return;
      }

      if (nextIndex > currentIndex) {
        moveFromLeftToRight(currentImg, nextImg);
      } else {
        moveFromRightToLeft(currentImg, nextImg);
      }
      moveIndicator(currentIndex, nextIndex);

      currentIndex = nextIndex;
    }

    function moveIndicator(currentIndex, nextIndex) {
      indicators.children[currentIndex].classList.remove('active');
      indicators.children[nextIndex].classList.add('active');
    }

    prev.addEventListener('click', toPrev);
    next.addEventListener('click', toNext);
    indicators.addEventListener('click', toSpecficImg);
    if (canAutoSlides) {
      element.addEventListener('mouseenter', clearAutoSlides);
      element.addEventListener('mouseleave', autoSlides);
    }
    return function clearCounter() {
      prev.removeEventListener('click', toPrev);
      next.removeEventListener('click', toNext);
      indicators.removeEventListener('click', toSpecficImg);
      element.removeEventListener('mouseenter', clearAutoSlides);
      element.removeEventListener('mouseleave', autoSlides);
      clearInterval(canAutoSlides);
      element = null;
      next = null;
      prev = null;
      indicators = null;
      photos = null;
    };
  }

  render() {
    this.carouselCleaner = Array.from(
      this.shadowRoot.querySelectorAll('.carousel'),
      (element) => this.setCarousel(element, 5000)
    );
  }
}

customElements.define('cust-carousel', CustCarousel);
