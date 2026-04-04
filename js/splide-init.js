(function () {
  'use strict';

  function getOptions() {
    var reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      type: 'loop',
      rewind: true,
      /* 既定は max-width（PC向け）のため、SPで複数枚になる。min にしてモバイルファーストにする */
      mediaQuery: 'min',
      /* ~767px: 1枚 / 768px~: 2枚 / 1024px~: 3枚 */
      perPage: 1,
      gap: '0.45rem',
      breakpoints: {
        768: {
          perPage: 2,
          gap: '0.55rem',
        },
        1024: {
          perPage: 3,
          gap: '0.65rem',
        },
      },
      autoplay: !reduced,
      interval: 6000,
      speed: reduced ? 0 : 550,
      pauseOnHover: true,
      pauseOnFocus: true,
      arrows: true,
      pagination: true,
      paginationKeyboard: true,
      cover: true,
      /* 高さ = 幅 × heightRatio（小さめの表示） */
      heightRatio: 0.48,
      keyboard: true,
      i18n: {
        prev: '前の写真へ',
        next: '次の写真へ',
        first: '最初の写真へ',
        last: '最後の写真へ',
        slideX: '写真 %s へ移動',
        pageX: 'ページ %s',
        play: '自動再生を開始',
        pause: '自動再生を一時停止',
        carousel: 'カルーセル',
        select: '表示する写真を選択',
        slide: '写真',
        slideLabel: '%s / %s',
      },
    };
  }

  function mountSplide(root) {
    if (!root || root.getAttribute('data-splide-mounted') === '1') return;
    if (typeof Splide === 'undefined') return;

    root.setAttribute('data-splide-mounted', '1');
    var splide = new Splide(root, getOptions());
    splide.mount();

    window.requestAnimationFrame(function () {
      splide.refresh();
    });
  }

  function whenSectionVisible(root, callback) {
    var section = root.closest('.reveal-section');
    if (!section || section.classList.contains('is-visible')) {
      callback();
      return;
    }

    var obs = new MutationObserver(function () {
      if (section.classList.contains('is-visible')) {
        callback();
        obs.disconnect();
      }
    });
    obs.observe(section, { attributes: true, attributeFilter: ['class'] });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof Splide === 'undefined') return;

    ['#splide-day', '#splide-evening', '#splide-night'].forEach(function (selector) {
      var root = document.querySelector(selector);
      if (!root) return;

      whenSectionVisible(root, function () {
        mountSplide(root);
      });
    });
  });
})();
