/**
 * 同一ページ内アンカー: 終端がなだらかな ease-out でスクロール（ヘッダー・ナビ用）
 */
(function () {
  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
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
    /* 最短を長くしすぎると「動き出しが遅い」感じになる。終端は easeOutQuint のまま */
    var duration = Math.min(950, Math.max(260, dist * 0.36));
    var startTime = null;

    function step(now) {
      if (startTime === null) startTime = now;
      var elapsed = now - startTime;
      var t = Math.min(1, elapsed / duration);
      var eased = easeOutQuint(t);
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
