/* ===========================================================================
 *  Aleppo Cafe — public site bootstrap
 *
 *  1. Render immediately from the built-in defaults (so the page is never
 *     blank, even on GitHub Pages before Supabase is set up).
 *  2. If Supabase is configured, fetch live content, assemble it into the same
 *     shape, and re-render. Any fetch error silently keeps the defaults.
 * ======================================================================== */
(function () {
  'use strict';

  /* --- scroll reveal (re-usable so re-rendered nodes animate too) -------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  window.aleppoObserveReveals = function () {
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) { revealObserver.observe(el); });
  };

  /* --- nav shrink on scroll --------------------------------------------- */
  function wireNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* --- assemble flat Supabase rows into the nested render shape ---------- */
  function assemble(res) {
    var content = {};
    // start from defaults so any text block the admin hasn't created still shows
    var d = window.ALEPPO_DEFAULT || {};
    Object.keys(d.content || {}).forEach(function (k) {
      content[k] = { en: d.content[k].en, ar: d.content[k].ar };
    });
    (res.content_blocks || []).forEach(function (b) {
      content[b.key] = { en: b.value_en || '', ar: b.value_ar || '' };
    });

    var groupBy = function (arr, key) {
      var m = {};
      (arr || []).forEach(function (r) { (m[r[key]] = m[r[key]] || []).push(r); });
      return m;
    };
    var catsByBranch = groupBy(res.categories, 'branch_id');
    var subsByCat = groupBy(res.subcategories, 'category_id');
    var itemsByCat = groupBy(res.menu_items, 'category_id');
    var subSlug = {};
    (res.subcategories || []).forEach(function (s) { subSlug[s.id] = s.slug; });

    var branches = (res.branches || []).map(function (b) {
      return {
        slug: b.slug, name_en: b.name_en, name_ar: b.name_ar, is_active: b.is_active,
        categories: (catsByBranch[b.id] || []).map(function (c) {
          return {
            slug: c.slug, name_en: c.name_en, name_ar: c.name_ar,
            image1_url: c.image1_url, image2_url: c.image2_url, is_active: c.is_active,
            subcategories: subsByCat[c.id] || [],
            items: (itemsByCat[c.id] || []).map(function (it) {
              return {
                name_en: it.name_en, name_ar: it.name_ar, price: it.price,
                description_en: it.description_en, image_url: it.image_url,
                subcategory_slug: subSlug[it.subcategory_id] || null,
                is_available: it.is_available
              };
            }).filter(function (it) { return it.is_available !== false; })
          };
        })
      };
    });

    return {
      content: content,
      branches: branches.length ? branches : (d.branches || []),
      locations: (res.locations && res.locations.length) ? res.locations : (d.locations || []),
      social: (res.social_links && res.social_links.length) ? res.social_links : (d.social || [])
    };
  }

  /* --- fetch everything from Supabase ----------------------------------- */
  function loadFromSupabase() {
    var client = window.aleppoClient();
    if (!client) return Promise.reject('not configured');
    var order = function (table, col) {
      return client.from(table).select('*').order(col, { ascending: true });
    };
    return Promise.all([
      order('content_blocks', 'sort_order'),
      order('branches', 'sort_order'),
      order('categories', 'sort_order'),
      order('subcategories', 'sort_order'),
      order('menu_items', 'sort_order'),
      order('locations', 'sort_order'),
      order('social_links', 'sort_order')
    ]).then(function (r) {
      for (var i = 0; i < r.length; i++) { if (r[i].error) throw r[i].error; }
      return {
        content_blocks: r[0].data, branches: r[1].data, categories: r[2].data,
        subcategories: r[3].data, menu_items: r[4].data, locations: r[5].data,
        social_links: r[6].data
      };
    });
  }

  /* --- boot -------------------------------------------------------------- */
  function boot() {
    wireNav();

    // 1) instant render from defaults
    var defaults = window.ALEPPO_DEFAULT || {};
    window.AleppoRender.renderAll({
      content: (function () {
        var c = {};
        Object.keys(defaults.content || {}).forEach(function (k) {
          c[k] = { en: defaults.content[k].en, ar: defaults.content[k].ar };
        });
        return c;
      })(),
      branches: defaults.branches || [],
      locations: defaults.locations || [],
      social: defaults.social || []
    });
    window.aleppoObserveReveals();

    // 2) upgrade with live content if configured
    if (window.aleppoIsConfigured && window.aleppoIsConfigured()) {
      loadFromSupabase()
        .then(function (res) {
          window.AleppoRender.renderAll(assemble(res));
          window.aleppoObserveReveals();
        })
        .catch(function (err) {
          console.warn('[Aleppo] Using default content (Supabase load failed):', err.message || err);
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
