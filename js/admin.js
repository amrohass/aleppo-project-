/* ===========================================================================
 *  Aleppo Cafe — CMS admin logic
 *
 *  Controls every editable part of the site: text & images, menu (branches →
 *  categories → sub-groups → items), locations, social/contact links, and a
 *  media library. Reads/writes Supabase; auth-gated (only a logged-in admin
 *  can change anything — enforced again by Row Level Security server-side).
 * ======================================================================== */
(function () {
  'use strict';

  var client = window.aleppoClient ? window.aleppoClient() : null;
  var cache = {};                 // ref tables: branches / categories / subcategories
  var state = { cfg: null, filters: {} };

  /* --- DOM helper -------------------------------------------------------- */
  function h(tag, props, children) {
    var n = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v == null) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k.indexOf('on') === 0) n.addEventListener(k.slice(2).toLowerCase(), v);
      else n.setAttribute(k, v);
    });
    if (children != null) (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  function $(id) { return document.getElementById(id); }

  var toastTimer;
  function toast(msg, isError) {
    var t = $('toast');
    t.textContent = msg;
    t.className = 'show' + (isError ? ' error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = ''; }, 3200);
  }

  /* --- media upload ------------------------------------------------------ */
  function publicUrl(path) {
    return client.storage.from('media').getPublicUrl(path).data.publicUrl;
  }
  function uploadFile(file) {
    var ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    var path = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    return client.storage.from('media').upload(path, file, { cacheControl: '3600', upsert: false })
      .then(function (res) {
        if (res.error) throw res.error;
        return publicUrl(path);
      });
  }

  /* --- reference tables (for select fields & filters) -------------------- */
  function loadRefs() {
    return Promise.all([
      client.from('branches').select('*').order('sort_order'),
      client.from('categories').select('*').order('sort_order'),
      client.from('subcategories').select('*').order('sort_order')
    ]).then(function (r) {
      cache.branches = r[0].data || [];
      cache.categories = r[1].data || [];
      cache.subcategories = r[2].data || [];
      cache._branch = {}; cache.branches.forEach(function (b) { cache._branch[b.id] = b.name_en; });
      cache._cat = {};
      cache.categories.forEach(function (c) {
        cache._cat[c.id] = (cache._branch[c.branch_id] ? cache._branch[c.branch_id] + ' · ' : '') + c.name_en;
      });
    });
  }
  function refRows(table) { return cache[table] || []; }
  function refLabel(table, r) {
    if (table === 'branches') return r.name_en;
    if (table === 'categories') return (cache._branch[r.branch_id] ? cache._branch[r.branch_id] + ' · ' : '') + r.name_en;
    if (table === 'subcategories') return (cache._cat[r.category_id] ? cache._cat[r.category_id] + ' · ' : '') + r.name_en;
    return r.name_en || r.id;
  }

  /* --- form field builder ----------------------------------------------- */
  function selectEl(options, value, blankLabel) {
    var s = h('select');
    if (blankLabel != null) s.appendChild(h('option', { value: '' }, blankLabel));
    options.forEach(function (o) {
      var opt = h('option', { value: o.value }, o.label);
      if (String(o.value) === String(value)) opt.setAttribute('selected', 'selected');
      s.appendChild(opt);
    });
    if (value != null) s.value = value;
    return s;
  }

  // Returns { node, get } for one field of a resource.
  function buildField(f, value) {
    var control, get;
    var isRtl = f.type === 'ar' || f.type === 'textarea-ar';

    if (f.type === 'bool') {
      control = h('input', { type: 'checkbox' });
      control.checked = value !== undefined ? !!value : (f.default !== undefined ? f.default : true);
      get = function () { return control.checked; };
      return {
        node: h('div', { class: 'field' }, [
          h('div', { class: 'check' }, [control, h('label', {}, f.label)])
        ]), get: get
      };
    }

    if (f.type === 'select') {
      control = selectEl((f.options || []), value, f.optional ? '— none —' : null);
      get = function () { return control.value || null; };
    } else if (f.type === 'textarea' || f.type === 'textarea-ar') {
      control = h('textarea', { dir: isRtl ? 'rtl' : 'ltr' });
      control.value = value || '';
      get = function () { return control.value; };
    } else if (f.type === 'number') {
      control = h('input', { type: 'number' });
      control.value = (value != null ? value : 0);
      get = function () { return control.value === '' ? 0 : parseInt(control.value, 10); };
    } else if (f.type === 'image') {
      return buildImageField(f, value);
    } else {
      control = h('input', { type: f.type === 'url' ? 'url' : 'text', dir: isRtl ? 'rtl' : 'ltr' });
      control.value = value || '';
      get = function () { return control.value.trim(); };
    }

    return {
      node: h('div', { class: 'field' }, [
        h('label', {}, f.label),
        control,
        f.help ? h('div', { class: 'help' }, f.help) : null
      ]), get: get
    };
  }

  function buildImageField(f, value) {
    var text = h('input', { type: 'text', placeholder: 'image URL or upload →' });
    text.value = value || '';
    var preview = h('div', { class: 'img-preview' });
    function refresh() { preview.style.backgroundImage = text.value ? "url('" + text.value + "')" : 'none'; }
    refresh();
    text.addEventListener('input', refresh);

    var file = h('input', { type: 'file', accept: 'image/*' });
    file.addEventListener('change', function () {
      if (!file.files || !file.files[0]) return;
      toast('Uploading…');
      uploadFile(file.files[0]).then(function (url) {
        text.value = url; refresh(); toast('Uploaded');
      }).catch(function (e) { toast(e.message || 'Upload failed', true); });
    });

    var node = h('div', { class: 'field' }, [
      h('label', {}, f.label),
      h('div', { class: 'img-field' }, [
        preview,
        h('div', { class: 'img-controls' }, [text, file])
      ]),
      f.help ? h('div', { class: 'help' }, f.help) : null
    ]);
    return { node: node, get: function () { return text.value.trim(); } };
  }

  /* --- resource definitions --------------------------------------------- */
  function branchOpts() { return refRows('branches').map(function (b) { return { value: b.id, label: refLabel('branches', b) }; }); }
  function catOpts() { return refRows('categories').map(function (c) { return { value: c.id, label: refLabel('categories', c) }; }); }
  function subOpts() { return refRows('subcategories').map(function (s) { return { value: s.id, label: refLabel('subcategories', s) }; }); }

  var RES = {
    branches: {
      table: 'branches', title: 'Menu Branches', order: 'sort_order',
      hint: 'Top-level tabs on the menu (e.g. Ramallah, Berzait).',
      fields: [
        { name: 'name_en', label: 'Name (display, may include Arabic)', type: 'text' },
        { name: 'name_ar', label: 'Name — Arabic', type: 'ar' },
        { name: 'slug', label: 'Slug — unique id, lowercase (e.g. ramallah)', type: 'text' },
        { name: 'sort_order', label: 'Order', type: 'number' },
        { name: 'is_active', label: 'Active', type: 'bool' }
      ],
      rowTitle: function (r) { return r.name_en; },
      rowSub: function (r) { return r.slug; }
    },
    categories: {
      table: 'categories', title: 'Menu Categories', order: 'sort_order',
      hint: 'Category tabs inside a branch. Each has two showcase images.',
      filters: [{ field: 'branch_id', label: 'Branch', opts: branchOpts }],
      fields: [
        { name: 'branch_id', label: 'Branch', type: 'select', options: null },
        { name: 'name_en', label: 'Name (display, may include Arabic)', type: 'text' },
        { name: 'name_ar', label: 'Name — Arabic', type: 'ar' },
        { name: 'slug', label: 'Slug — lowercase (e.g. drinks)', type: 'text' },
        { name: 'image1_url', label: 'Section image 1', type: 'image', help: 'Left showcase image for this section.' },
        { name: 'image2_url', label: 'Section image 2', type: 'image', help: 'Right showcase image for this section.' },
        { name: 'sort_order', label: 'Order', type: 'number' },
        { name: 'is_active', label: 'Active', type: 'bool' }
      ],
      dyn: function () { RES.categories.fields[0].options = branchOpts(); },
      rowTitle: function (r) { return r.name_en; },
      rowSub: function (r) { return (cache._branch[r.branch_id] || '') + ' · ' + r.slug; }
    },
    subcategories: {
      table: 'subcategories', title: 'Sub-groups', order: 'sort_order',
      hint: 'Optional groups inside a category (e.g. Drinks → Hot / Cold).',
      filters: [{ field: 'category_id', label: 'Category', opts: catOpts }],
      fields: [
        { name: 'category_id', label: 'Category', type: 'select', options: null },
        { name: 'name_en', label: 'Name (display, may include Arabic)', type: 'text' },
        { name: 'name_ar', label: 'Name — Arabic', type: 'ar' },
        { name: 'slug', label: 'Slug — lowercase (e.g. hot)', type: 'text' },
        { name: 'sort_order', label: 'Order', type: 'number' }
      ],
      dyn: function () { RES.subcategories.fields[0].options = catOpts(); },
      rowTitle: function (r) { return r.name_en; },
      rowSub: function (r) { return (cache._cat[r.category_id] || '') + ' · ' + r.slug; }
    },
    menu_items: {
      table: 'menu_items', title: 'Menu Items', order: 'sort_order',
      hint: 'Individual dishes / drinks.',
      filters: [{ field: 'category_id', label: 'Category', opts: catOpts }],
      fields: [
        { name: 'category_id', label: 'Category', type: 'select', options: null },
        { name: 'subcategory_id', label: 'Sub-group (drinks only — leave empty otherwise)', type: 'select', options: null, optional: true },
        { name: 'name_en', label: 'Name — English', type: 'text' },
        { name: 'name_ar', label: 'Name — Arabic', type: 'ar' },
        { name: 'price', label: 'Price (free text, e.g. 10 ₪ or 30–35 ₪)', type: 'text' },
        { name: 'description_en', label: 'Description — English', type: 'textarea' },
        { name: 'description_ar', label: 'Description — Arabic', type: 'textarea-ar' },
        { name: 'image_url', label: 'Item image (optional)', type: 'image' },
        { name: 'sort_order', label: 'Order', type: 'number' },
        { name: 'is_available', label: 'Available', type: 'bool' }
      ],
      dyn: function () {
        RES.menu_items.fields[0].options = catOpts();
        RES.menu_items.fields[1].options = subOpts();
      },
      rowTitle: function (r) { return r.name_en; },
      rowSub: function (r) { return [r.name_ar, r.price].filter(Boolean).join('  ·  '); },
      rowSubRtl: true
    },
    locations: {
      table: 'locations', title: 'Locations', order: 'sort_order',
      hint: 'The cards in the "Find Us" section.',
      fields: [
        { name: 'num', label: 'Number label (e.g. 01)', type: 'text' },
        { name: 'name_en', label: 'Name — English', type: 'text' },
        { name: 'name_ar', label: 'Name — Arabic', type: 'ar' },
        { name: 'description_en', label: 'Description — English', type: 'textarea' },
        { name: 'description_ar', label: 'Description — Arabic', type: 'textarea-ar' },
        { name: 'address_en', label: 'Address — English', type: 'textarea' },
        { name: 'address_ar', label: 'Address — Arabic', type: 'textarea-ar' },
        { name: 'social_handle', label: 'Social handle (e.g. @aleppo.cafe.palestine)', type: 'text' },
        { name: 'map_url', label: 'Button link (Instagram or Google Maps URL)', type: 'url' },
        { name: 'sort_order', label: 'Order', type: 'number' },
        { name: 'is_active', label: 'Active', type: 'bool' }
      ],
      rowTitle: function (r) { return r.name_en; },
      rowSub: function (r) { return r.address_en; }
    },
    social_links: {
      table: 'social_links', title: 'Social & Contacts', order: 'sort_order',
      hint: 'Icons in the footer + links in the Visit column. Use for phone/email too.',
      fields: [
        { name: 'platform', label: 'Platform (instagram / facebook / whatsapp / phone / email)', type: 'text' },
        { name: 'label', label: 'Label (shown in the Visit list, e.g. @aleppo.cafe.palestine)', type: 'text' },
        { name: 'url', label: 'Link (https://…, tel:+970…, mailto:…)', type: 'text' },
        { name: 'icon', label: 'Icon glyph (short — e.g. f, ig, ✆, ✉)', type: 'text' },
        { name: 'sort_order', label: 'Order', type: 'number' },
        { name: 'is_active', label: 'Active', type: 'bool' }
      ],
      rowTitle: function (r) { return r.label || r.platform; },
      rowSub: function (r) { return r.url; }
    }
  };

  /* --- generic CRUD view ------------------------------------------------- */
  function renderCrud(cfg) {
    state.cfg = cfg; state.filters = {};
    if (cfg.dyn) cfg.dyn();
    var view = $('view');
    view.innerHTML = '';

    var addBtn = h('button', { class: 'btn primary', text: '+ Add new', onClick: function () { openEditor(cfg, defaultsFromFilters()); } });
    view.appendChild(h('div', { class: 'view-head' }, [
      h('div', {}, [h('h2', {}, cfg.title), cfg.hint ? h('p', { class: 'hint' }, cfg.hint) : null]),
      addBtn
    ]));

    if (cfg.filters) {
      var bar = h('div', { class: 'toolbar' });
      cfg.filters.forEach(function (flt) {
        var sel = selectEl(flt.opts(), '', 'All ' + flt.label.toLowerCase() + 's');
        sel.addEventListener('change', function () {
          if (sel.value) state.filters[flt.field] = sel.value; else delete state.filters[flt.field];
          reloadList();
        });
        bar.appendChild(h('div', {}, [h('label', { class: 'help', style: 'display:block;margin-bottom:.3rem;color:var(--gold)' }, flt.label), sel]));
      });
      view.appendChild(bar);
    }

    view.appendChild(h('div', { id: 'editor-mount' }));
    view.appendChild(h('div', { id: 'crud-list' }));
    reloadList();
  }

  function defaultsFromFilters() {
    var d = {};
    Object.keys(state.filters).forEach(function (k) { d[k] = state.filters[k]; });
    return d;
  }

  function reloadList() {
    var cfg = state.cfg;
    var q = client.from(cfg.table).select('*').order(cfg.order || 'sort_order', { ascending: true });
    Object.keys(state.filters).forEach(function (k) { q = q.eq(k, state.filters[k]); });
    q.then(function (res) {
      var list = $('crud-list');
      list.innerHTML = '';
      if (res.error) { list.appendChild(h('p', { class: 'msg error' }, res.error.message)); return; }
      var rows = res.data || [];
      if (!rows.length) { list.appendChild(h('p', { class: 'empty' }, 'Nothing here yet — click “Add new”.')); return; }
      rows.forEach(function (row) {
        var sub = cfg.rowSub(row) || '';
        list.appendChild(h('div', { class: 'row-card' }, [
          h('div', { class: 'row-main' }, [
            h('div', { class: 'row-title' }, [
              cfg.rowTitle(row) || '(untitled)',
              (row.is_active === false || row.is_available === false) ? h('span', { class: 'badge off', style: 'margin-left:.6rem' }, 'hidden') : null
            ]),
            sub ? h('div', { class: 'row-sub', dir: cfg.rowSubRtl ? 'rtl' : 'ltr' }, sub) : null
          ]),
          h('div', { class: 'row-actions' }, [
            h('button', { class: 'btn ghost sm', text: 'Edit', onClick: function () { openEditor(cfg, row); } }),
            h('button', { class: 'btn danger sm', text: 'Delete', onClick: function () { del(cfg, row); } })
          ])
        ]));
      });
    });
  }

  function openEditor(cfg, row) {
    row = row || {};
    var mount = $('editor-mount');
    mount.innerHTML = '';
    var getters = {};
    var form = h('div', { class: 'editor' });
    form.appendChild(h('div', { class: 'group-label', style: 'margin-top:0' }, row.id ? 'Edit' : 'New ' + cfg.title.replace(/s$/, '')));
    cfg.fields.forEach(function (f) {
      var built = buildField(f, row[f.name]);
      getters[f.name] = built.get;
      form.appendChild(built.node);
    });
    var msg = h('div', { class: 'msg' });
    form.appendChild(h('div', { class: 'editor-actions' }, [
      h('button', { class: 'btn primary', text: row.id ? 'Save changes' : 'Create', onClick: function () { saveRow(cfg, row, getters, msg); } }),
      h('button', { class: 'btn ghost', text: 'Cancel', onClick: function () { mount.innerHTML = ''; } })
    ]));
    form.appendChild(msg);
    mount.appendChild(form);
    mount.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function saveRow(cfg, row, getters, msg) {
    var payload = {};
    cfg.fields.forEach(function (f) { payload[f.name] = getters[f.name](); });
    msg.textContent = 'Saving…'; msg.className = 'msg';
    var op = row.id
      ? client.from(cfg.table).update(payload).eq('id', row.id)
      : client.from(cfg.table).insert(payload);
    op.then(function (res) {
      if (res.error) throw res.error;
      toast('Saved');
      $('editor-mount').innerHTML = '';
      var after = (['branches', 'categories', 'subcategories'].indexOf(cfg.table) >= 0) ? loadRefs() : Promise.resolve();
      after.then(function () { if (cfg.dyn) cfg.dyn(); reloadList(); });
    }).catch(function (e) {
      msg.textContent = 'Error: ' + (e.message || e); msg.className = 'msg error';
      toast(e.message || 'Save failed', true);
    });
  }

  function del(cfg, row) {
    if (!window.confirm('Delete “' + (cfg.rowTitle(row) || 'this') + '”? This cannot be undone.')) return;
    client.from(cfg.table).delete().eq('id', row.id).then(function (res) {
      if (res.error) { toast(res.error.message, true); return; }
      toast('Deleted');
      var after = (['branches', 'categories', 'subcategories'].indexOf(cfg.table) >= 0) ? loadRefs() : Promise.resolve();
      after.then(function () { if (cfg.dyn) cfg.dyn(); reloadList(); });
    });
  }

  /* --- TEXT & IMAGES view (content_blocks, key/value) -------------------- */
  function renderTextView() {
    state.cfg = null;
    var view = $('view');
    view.innerHTML = '';
    var defs = (window.ALEPPO_DEFAULT && window.ALEPPO_DEFAULT.content) || {};

    var saveBtn = h('button', { class: 'btn primary', text: 'Save all changes' });
    view.appendChild(h('div', { class: 'view-head' }, [
      h('div', {}, [h('h2', {}, 'Text & Images'), h('p', { class: 'hint' }, 'Every heading, paragraph, tagline and background image. Arabic fields are right-to-left.')]),
      saveBtn
    ]));

    var mount = h('div');
    view.appendChild(mount);

    // load current DB values, then render each block on top of the defaults
    client.from('content_blocks').select('*').then(function (res) {
      var db = {};
      (res.data || []).forEach(function (b) { db[b.key] = b; });

      var groups = {};
      Object.keys(defs).forEach(function (key) {
        var s = defs[key].section || 'General';
        (groups[s] = groups[s] || []).push(key);
      });

      var getters = {};
      Object.keys(groups).forEach(function (section) {
        mount.appendChild(h('div', { class: 'group-label' }, section));
        groups[section].forEach(function (key) {
          var def = defs[key];
          var cur = db[key] || {};
          var enVal = cur.value_en !== undefined ? cur.value_en : def.en;
          var arVal = cur.value_ar !== undefined ? cur.value_ar : def.ar;

          var block = h('div', { class: 'editor' });
          block.appendChild(h('div', { class: 'row-sub', style: 'margin-bottom:.75rem;color:var(--cream-dim)' }, (def.label || key) + '  ·  ' + key));

          // English / display value (widget depends on type)
          var enField = buildField(
            { name: 'en', label: def.type === 'image' ? 'Image' : 'Value', type: fieldTypeFor(def.type),
              help: def.type === 'list' ? 'One per line. For flavors use “Name | Price”.' : (def.type === 'html' ? 'Basic HTML allowed (<em>, <br>).' : null) },
            enVal);
          block.appendChild(enField.node);

          var arGet = null;
          if (def.type !== 'image' && def.type !== 'list') {
            var arField = buildField({ name: 'ar', label: 'Arabic (optional)', type: 'textarea-ar' }, arVal);
            block.appendChild(arField.node);
            arGet = arField.get;
          }
          getters[key] = { en: enField.get, ar: arGet, def: def };
          mount.appendChild(block);
        });
      });

      saveBtn.addEventListener('click', function () {
        var rows = [];
        var i = 0;
        Object.keys(getters).forEach(function (key) {
          var g = getters[key];
          rows.push({
            key: key, section: g.def.section || 'General', label: g.def.label || key,
            type: g.def.type || 'text',
            value_en: g.en(), value_ar: g.ar ? g.ar() : '', sort_order: i++
          });
        });
        saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
        client.from('content_blocks').upsert(rows, { onConflict: 'key' }).then(function (res) {
          saveBtn.disabled = false; saveBtn.textContent = 'Save all changes';
          if (res.error) { toast(res.error.message, true); return; }
          toast('All text saved');
        });
      });
    });
  }
  function fieldTypeFor(t) {
    if (t === 'image') return 'image';
    if (t === 'list' || t === 'html') return 'textarea';
    return 'text';
  }

  /* --- MEDIA library ----------------------------------------------------- */
  function renderMedia() {
    state.cfg = null;
    var view = $('view');
    view.innerHTML = '';
    var file = h('input', { type: 'file', accept: 'image/*' });
    var uploadBtn = h('button', { class: 'btn primary', text: 'Upload image', onClick: function () { file.click(); } });
    file.addEventListener('change', function () {
      if (!file.files || !file.files[0]) return;
      toast('Uploading…');
      uploadFile(file.files[0]).then(function () { toast('Uploaded'); load(); })
        .catch(function (e) { toast(e.message || 'Upload failed', true); });
    });
    view.appendChild(h('div', { class: 'view-head' }, [
      h('div', {}, [h('h2', {}, 'Media Library'), h('p', { class: 'hint' }, 'Upload images once, reuse their URL anywhere (paste into an image field).')]),
      uploadBtn
    ]));
    view.appendChild(file);
    var grid = h('div', { class: 'media-grid' });
    view.appendChild(grid);

    function load() {
      client.storage.from('media').list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
        .then(function (res) {
          grid.innerHTML = '';
          var files = (res.data || []).filter(function (f) { return f.id || f.name.indexOf('.') > -1; });
          if (!files.length) { grid.appendChild(h('p', { class: 'empty' }, 'No uploads yet.')); return; }
          files.forEach(function (f) {
            var url = publicUrl(f.name);
            var thumb = h('div', { class: 'thumb' }); thumb.style.backgroundImage = "url('" + url + "')";
            grid.appendChild(h('div', { class: 'media-tile' }, [
              thumb,
              h('div', { class: 'name' }, f.name),
              h('button', { class: 'btn ghost sm', text: 'Copy URL', onClick: function () {
                navigator.clipboard ? navigator.clipboard.writeText(url).then(function () { toast('URL copied'); }) : window.prompt('URL', url);
              } }),
              h('button', { class: 'btn danger sm', text: 'Delete', onClick: function () {
                if (!window.confirm('Delete this file?')) return;
                client.storage.from('media').remove([f.name]).then(function () { toast('Deleted'); load(); });
              } })
            ]));
          });
        });
    }
    load();
  }

  /* --- tabs -------------------------------------------------------------- */
  var TABS = [
    { id: 'text', label: 'Text & Images', render: renderTextView },
    { id: 'branches', label: 'Branches', render: function () { renderCrud(RES.branches); } },
    { id: 'categories', label: 'Categories', render: function () { renderCrud(RES.categories); } },
    { id: 'subcategories', label: 'Sub-groups', render: function () { renderCrud(RES.subcategories); } },
    { id: 'items', label: 'Menu Items', render: function () { renderCrud(RES.menu_items); } },
    { id: 'locations', label: 'Locations', render: function () { renderCrud(RES.locations); } },
    { id: 'social', label: 'Social & Contacts', render: function () { renderCrud(RES.social_links); } },
    { id: 'media', label: 'Media', render: renderMedia }
  ];

  function buildTabs() {
    var bar = $('tabs');
    bar.innerHTML = '';
    TABS.forEach(function (t, i) {
      var btn = h('button', { class: 'tab' + (i === 0 ? ' active' : ''), text: t.label, onClick: function () {
        bar.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        t.render();
      } });
      bar.appendChild(btn);
    });
    TABS[0].render();
  }

  /* --- auth -------------------------------------------------------------- */
  function showApp(email) {
    $('login-screen').hidden = true;
    $('app').hidden = false;
    $('user-email').textContent = email || '';
    loadRefs().then(buildTabs);
  }
  function showLogin() {
    $('app').hidden = true;
    $('login-screen').hidden = false;
  }

  function initAuth() {
    if (!client) {
      $('login-screen').hidden = false;
      $('login-form').hidden = true;
      $('login-msg').textContent = 'Supabase is not configured yet. Open js/config.js and add your project URL and anon key, then reload.';
      $('login-msg').className = 'msg error';
      return;
    }
    $('login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('login-msg'); msg.textContent = 'Signing in…'; msg.className = 'msg';
      client.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value })
        .then(function (res) {
          if (res.error) { msg.textContent = res.error.message; msg.className = 'msg error'; return; }
          showApp(res.data.user && res.data.user.email);
        });
    });
    $('logout').addEventListener('click', function () {
      client.auth.signOut().then(showLogin);
    });
    client.auth.getSession().then(function (res) {
      var s = res.data.session;
      if (s) showApp(s.user && s.user.email); else showLogin();
    });
    client.auth.onAuthStateChange(function (_evt, s) {
      if (!s) showLogin();
    });
  }

  document.addEventListener('DOMContentLoaded', initAuth);
})();
