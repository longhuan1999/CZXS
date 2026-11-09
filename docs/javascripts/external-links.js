// docs/javascripts/external-links.js
(function () {
  const internal = location.hostname;

  function isExternal(href) {
    if (!href || href.startsWith("#") || href.startsWith("mailto:") ||
        href.startsWith("tel:") || href.startsWith("javascript:")) return false;
    try {
      const u = new URL(href, location.origin);
      return u.protocol.startsWith("http") && u.hostname !== internal;
    } catch (_) {
      return false;
    }
  }

  // 1) 幂等打标记：只处理还没处理过的链接，防止 instant 切页回来重复绑定
  function patch(scope) {
    const root = scope || document;
    root.querySelectorAll('a[href]:not([data-ext-patched])').forEach(a => {
      a.dataset.extPatched = "true";
      if (isExternal(a.getAttribute("href"))) {
        a.target = "_blank";
        a.rel = (a.rel ? a.rel + " " : "") + "noopener noreferrer";
        a.classList.add("external");
      }
    });
  }

  // 2) 首屏
  document.addEventListener("DOMContentLoaded", () => patch());

  // 3) instant 导航后（Material / Zensical 都提供 document$）
  if (typeof document$ !== "undefined") {
    document$.subscribe(() => patch());
  }

  // 4) 兜底：事件委托 —— 对 JS 动态生成的链接（搜索下拉、mermaid、tabs 里的内容）也生效
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || !isExternal(a.getAttribute("href"))) return;
    // 只在没被浏览器默认行为处理时兜底；中键/右键/Ctrl+点击不该拦截
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    // 已经带 target="_blank" 的不用管，这里只补漏
    if (a.target === "_blank") return;
    e.preventDefault();
    window.open(a.href, "_blank", "noopener,noreferrer");
  }, true);
})();