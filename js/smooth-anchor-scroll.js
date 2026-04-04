/**
 * 同一ページ内アンカー: ease-in-out で加減速が滑らかなスクロール（ヘッダー・ナビ用）
 */
(function () {
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getScrollPaddingTop() {
    var raw = getComputedStyle(document.documentElement).scrollPaddingTop;
    var px = parseFloat(raw);
    return Number.isFinite(px) ? px : 104;
  }

  function getTargetY(el) {
    var padTop = getScrollPaddingTop();
    var rect = el.getBoundingClientRect();
    return Math.max(0, rect.top + window.pageYOffset - padTop);
  }

  function smoothScrollTo(targetY) {
    var startY = window.pageYOffset;
    var delta = targetY - startY;
    var dist = Math.abs(delta);
    /* 短すぎるとカクついて見えるため下限あり。係数は小さめ＝全体が軽く流れる */
    var duration = Math.min(720, Math.max(200, dist * 0.28));
    var startTime = null;

    function step(now) {
      if (startTime === null) startTime = now;
      var elapsed = now - startTime;
      var t = Math.min(1, elapsed / duration);
      var eased = easeInOutCubic(t);
      window.scrollTo(0, startY + delta * eased);
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  document.documentElement.addEventListener(
    'click',
    function (e) {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;

      var href = a.getAttribute('href');
      if (href.length < 2) return;

      var id;
      try {
        id = decodeURIComponent(href.slice(1));
      } catch (err) {
        return;
      }
      if (!id) return;

      var target = document.getElementById(id);
      if (!target) return;

      if (a.host !== '' && a.host !== window.location.host) return;

      e.preventDefault();

      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, getTargetY(target));
        if (history.pushState) history.pushState(null, '', href);
        return;
      }

      var y = getTargetY(target);
      smoothScrollTo(y);
      if (history.pushState) history.pushState(null, '', href);
    },
    true
  );
})();
