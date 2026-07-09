/* ===========================================================================
 *  Aleppo Cafe — public site renderer
 *
 *  Draws the dynamic parts of the page (text, images, menu, locations,
 *  social) from a normalized data object. The same renderer is used for the
 *  built-in default content and for content loaded from Supabase, so the two
 *  always look identical. All DOM is built with textContent (no innerHTML of
 *  untrusted strings) except a small set of explicit HTML blocks.
 * ======================================================================== */
(function () {
  'use strict';

  /* --- tiny DOM helpers -------------------------------------------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function mediaUrl(v) {
    return (window.aleppoMediaUrl ? window.aleppoMediaUrl(v) : v) || '';
  }

  /* --- text / image content --------------------------------------------- */
  function val(content, key) {
    var b = content && content[key];
    return b ? (b.en || '') : '';
  }

  function applyContent(content) {
    // Plain text blocks
    document.querySelectorAll('[data-content]').forEach(function (node) {
      var key = node.getAttribute('data-content');
      if (content[key] != null) node.textContent = val(content, key);
    });
    // HTML blocks (headlines with <em>/<br>) — authored only by the admin
    document.querySelectorAll('[data-content-html]').forEach(function (node) {
      var key = node.getAttribute('data-content-html');
      if (content[key] != null) node.innerHTML = val(content, key);
    });
    // Inline background images
    document.querySelectorAll('[data-bg]').forEach(function (node) {
      var key = node.getAttribute('data-bg');
      var v = val(content, key);
      if (v) node.style.backgroundImage = "url('" + mediaUrl(v) + "')";
    });

    // Favicon (browser-tab icon)
    var fav = val(content, 'brand.favicon');
    if (fav) {
      var link = document.querySelector('link[rel="icon"]');
      if (link) link.setAttribute('href', mediaUrl(fav));
    }

    // Hero backgrounds use CSS variables so the mobile swap keeps working
    var heroBg = val(content, 'hero.bg');
    var heroBgM = val(content, 'hero.bg_mobile');
    if (heroBg) document.documentElement.style.setProperty('--hero-bg', "url('" + mediaUrl(heroBg) + "')");
    if (heroBgM) document.documentElement.style.setProperty('--hero-bg-mobile', "url('" + mediaUrl(heroBgM) + "')");

    renderList('#hookah-flavors', val(content, 'hookah.flavors'), 'flavor-chip', true);
    renderList('#games-list', val(content, 'games.list'), null, false);
  }

  // Renders a newline list. When priced=true each line is "Name | Price".
  function renderList(sel, raw, itemClass, priced) {
    var host = document.querySelector(sel);
    if (!host) return;
    host.innerHTML = '';
    (raw || '').split('\n').forEach(function (line) {
      line = line.trim();
      if (!line) return;
      if (priced) {
        var parts = line.split('|');
        var chip = el('div', itemClass);
        chip.appendChild(el('span', 'flavor-name', (parts[0] || '').trim()));
        chip.appendChild(el('span', 'flavor-price', (parts[1] || '').trim()));
        host.appendChild(chip);
      } else {
        host.appendChild(el('li', null, line));
      }
    });
  }

  /* --- one menu item card ------------------------------------------------ */
  function menuItem(item) {
    var wrap = el('div', 'menu-item');
    if (item.image_url) {
      var media = el('div', 'menu-item-media');
      media.style.backgroundImage = "url('" + mediaUrl(item.image_url) + "')";
      wrap.appendChild(media);
    }
    var header = el('div', 'menu-item-header');
    var left = el('div');
    left.appendChild(el('div', 'menu-item-name', item.name_en || item.en || ''));
    var ar = item.name_ar != null ? item.name_ar : item.ar;
    if (ar) {
      var arEl = el('div', 'menu-item-name-ar', ar);
      arEl.setAttribute('dir', 'rtl');
      left.appendChild(arEl);
    }
    header.appendChild(left);
    header.appendChild(el('div', 'menu-item-price', item.price || ''));
    wrap.appendChild(header);
    var desc = item.description_en || item.desc;
    if (desc) wrap.appendChild(el('div', 'menu-item-desc', desc));
    return wrap;
  }

  /* --- two showcase images at the top of a category --------------------- */
  function panelImages(cat) {
    var ph = window.ALEPPO_PLACEHOLDER_IMG;
    var row = el('div', 'menu-panel-images');
    [cat.image1_url, cat.image2_url].forEach(function (src) {
      var box = el('div', 'menu-panel-img');
      box.style.backgroundImage = "url('" + (src ? mediaUrl(src) : ph) + "')";
      row.appendChild(box);
    });
    return row;
  }

  /* --- a single category panel ------------------------------------------ */
  function categoryPanel(cat, isActive) {
    var panel = el('div', 'menu-panel' + (isActive ? ' active' : ''));
    panel.setAttribute('data-category', cat.slug);
    panel.appendChild(panelImages(cat));

    var subs = cat.subcategories || [];
    if (subs.length) {
      // sub-tabs + one sub-content block per subcategory
      var tabs = el('div', 'sub-tabs');
      subs.forEach(function (s, i) {
        var b = el('button', 'menu-tab sub-tab' + (i === 0 ? ' active' : ''), s.name_en);
        b.setAttribute('data-subtab', s.slug);
        tabs.appendChild(b);
      });
      panel.appendChild(tabs);

      subs.forEach(function (s, i) {
        var block = el('div', 'sub-content' + (i === 0 ? ' active' : ''));
        block.setAttribute('data-type', s.slug);
        var grid = el('div', 'menu-grid');
        (cat.items || []).forEach(function (it) {
          if ((it.subcategory_slug || it.sub) === s.slug) grid.appendChild(menuItem(it));
        });
        block.appendChild(grid);
        panel.appendChild(block);
      });
    } else {
      var grid2 = el('div', 'menu-grid');
      (cat.items || []).forEach(function (it) { grid2.appendChild(menuItem(it)); });
      panel.appendChild(grid2);
    }
    return panel;
  }

  /* --- the whole menu ---------------------------------------------------- */
  function renderMenu(branches) {
    var selector = document.getElementById('branch-selector');
    var host = document.getElementById('menu-branches');
    if (!selector || !host) return;
    selector.innerHTML = '';
    host.innerHTML = '';
    branches = (branches || []).filter(function (b) { return b.is_active !== false; });

    branches.forEach(function (branch, bi) {
      var btn = el('button', 'branch-btn' + (bi === 0 ? ' active' : ''), branch.name_en);
      btn.setAttribute('data-branch', branch.slug);
      selector.appendChild(btn);

      var branchEl = el('div', 'menu-branch' + (bi === 0 ? ' active-branch' : ''));
      branchEl.setAttribute('data-branch', branch.slug);

      var cats = (branch.categories || []).filter(function (c) { return c.is_active !== false; });
      var tabs = el('div', 'menu-tabs');
      cats.forEach(function (cat, ci) {
        var t = el('button', 'menu-tab' + (ci === 0 ? ' active' : ''), cat.name_en);
        t.setAttribute('data-category', cat.slug);
        tabs.appendChild(t);
      });
      branchEl.appendChild(tabs);
      cats.forEach(function (cat, ci) { branchEl.appendChild(categoryPanel(cat, ci === 0)); });

      if (!cats.length) branchEl.appendChild(el('p', 'body-text', 'Menu coming soon.'));
      host.appendChild(branchEl);
    });
  }

  /* --- locations --------------------------------------------------------- */
  function renderLocations(locations) {
    var grid = document.getElementById('loc-grid');
    if (!grid) return;
    grid.innerHTML = '';
    (locations || []).filter(function (l) { return l.is_active !== false; }).forEach(function (loc, i) {
      var card = el('div', 'loc-card reveal');
      if (i > 0) card.style.transitionDelay = '0.2s';
      card.appendChild(el('div', 'loc-num', loc.num || String(i + 1).padStart(2, '0')));
      var nameAr = el('div', 'loc-name-ar', loc.name_ar || '');
      nameAr.setAttribute('dir', 'rtl');
      card.appendChild(nameAr);
      card.appendChild(el('div', 'loc-name-en', loc.name_en || ''));
      if (loc.description_en) {
        var d = el('p', 'body-text', loc.description_en);
        d.style.fontSize = '0.9rem';
        card.appendChild(d);
      }
      var detail = el('div', 'loc-detail');
      if (loc.address_en) detail.appendChild(locRow('Address', loc.address_en));
      if (loc.social_handle) detail.appendChild(locRow('Social', loc.social_handle));
      card.appendChild(detail);
      if (loc.map_url) {
        var a = el('a', 'loc-map-btn', 'View →');
        a.href = loc.map_url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = /instagram/i.test(loc.map_url) ? 'Instagram Page →' : 'Find on Map →';
        card.appendChild(a);
      }
      grid.appendChild(card);
    });
    // re-arm reveal animation for the freshly built cards
    if (window.aleppoObserveReveals) window.aleppoObserveReveals();
  }
  function locRow(label, value) {
    var row = el('div', 'loc-row');
    row.appendChild(el('span', 'loc-row-label', label));
    row.appendChild(el('span', 'loc-row-val', value));
    return row;
  }

  /* --- social / contact links ------------------------------------------- */
  function renderSocial(links) {
    var host = document.getElementById('footer-social');
    if (!host) return;
    host.innerHTML = '';
    (links || []).filter(function (s) { return s.is_active !== false && s.url; }).forEach(function (s) {
      var a = el('a', null, s.icon || (s.platform ? s.platform[0] : '•'));
      a.href = s.url;
      a.title = s.label || s.platform || '';
      a.target = '_blank';
      a.rel = 'noopener';
      host.appendChild(a);
    });

    // Footer "Visit" column: locations + social handles
    var visit = document.getElementById('footer-visit');
    if (visit) {
      visit.innerHTML = '';
      (window.__aleppoLocations || []).forEach(function (loc) {
        var li = el('li');
        var a = el('a', null, loc.name_en || loc.address_en || '');
        a.href = loc.map_url || '#';
        if (loc.map_url) { a.target = '_blank'; a.rel = 'noopener'; }
        li.appendChild(a);
        visit.appendChild(li);
      });
      (links || []).filter(function (s) { return s.is_active !== false && s.url && s.label; }).forEach(function (s) {
        var li = el('li');
        var a = el('a', null, s.label);
        a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
        li.appendChild(a);
        visit.appendChild(li);
      });
    }
  }

  /* --- menu interactions (event delegation, no inline handlers) --------- */
  function wireMenuEvents() {
    var selector = document.getElementById('branch-selector');
    var host = document.getElementById('menu-branches');
    if (!selector || !host || host.__wired) return;
    host.__wired = true;

    selector.addEventListener('click', function (e) {
      var btn = e.target.closest('.branch-btn');
      if (!btn) return;
      var slug = btn.getAttribute('data-branch');
      selector.querySelectorAll('.branch-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      host.querySelectorAll('.menu-branch').forEach(function (b) {
        b.classList.toggle('active-branch', b.getAttribute('data-branch') === slug);
      });
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    });

    host.addEventListener('click', function (e) {
      var subBtn = e.target.closest('.sub-tab');
      if (subBtn) {
        var panel = subBtn.closest('.menu-panel');
        var type = subBtn.getAttribute('data-subtab');
        panel.querySelectorAll('.sub-content').forEach(function (c) { c.classList.remove('active'); });
        var target = panel.querySelector('.sub-content[data-type="' + type + '"]');
        if (target) target.classList.add('active');
        panel.querySelectorAll('.sub-tab').forEach(function (b) { b.classList.remove('active'); });
        subBtn.classList.add('active');
        return;
      }
      var tab = e.target.closest('.menu-tab');
      if (tab && !tab.classList.contains('sub-tab')) {
        var branch = tab.closest('.menu-branch');
        var cat = tab.getAttribute('data-category');
        branch.querySelectorAll('.menu-panel').forEach(function (p) { p.classList.remove('active'); });
        var panel2 = branch.querySelector('.menu-panel[data-category="' + cat + '"]');
        if (panel2) panel2.classList.add('active');
        branch.querySelector('.menu-tabs').querySelectorAll('.menu-tab').forEach(function (b) { b.classList.remove('active'); });
        tab.classList.add('active');
      }
    });
  }

  /* --- public API -------------------------------------------------------- */
  window.AleppoRender = {
    renderAll: function (data) {
      window.__aleppoLocations = data.locations || [];
      applyContent(data.content || {});
      renderMenu(data.branches || []);
      renderLocations(data.locations || []);
      renderSocial(data.social || []);
      wireMenuEvents();
    }
  };
})();
