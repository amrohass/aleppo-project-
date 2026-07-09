/* ===========================================================================
 *  Aleppo Cafe — front-end configuration
 *
 *  1. Create a Supabase project (https://supabase.com — free tier is fine).
 *  2. Project Settings → Data API / API keys → copy the two values below.
 *  3. Paste them here and commit. These values are SAFE to expose publicly:
 *     the anon key only grants what Row Level Security allows (public read,
 *     admin-only write — see supabase/schema.sql).
 *
 *  Until you fill these in, the website falls back to the built-in default
 *  content (js/default-data.js) so the page keeps working on GitHub Pages.
 * ======================================================================== */
window.ALEPPO_CONFIG = {
  SUPABASE_URL: 'https://anwxtyfatqvibqyzszrr.supabase.co',        // e.g. https://abcdefgh.supabase.co
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3h0eWZhdHF2aWJxeXpzenJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDA0OTQsImV4cCI6MjA5OTE3NjQ5NH0.lyB-iAJY4YrhpfHMlcAXG6Ch2ZAzEyRcYd70JC8E6Rg'
};

/* --- helpers (do not edit below) ---------------------------------------- */
(function () {
  var cfg = window.ALEPPO_CONFIG || {};

  // True only when real credentials have been provided.
  window.aleppoIsConfigured = function () {
    return (
      typeof cfg.SUPABASE_URL === 'string' &&
      typeof cfg.SUPABASE_ANON_KEY === 'string' &&
      cfg.SUPABASE_URL.indexOf('http') === 0 &&
      cfg.SUPABASE_URL.indexOf('YOUR_') === -1 &&
      cfg.SUPABASE_ANON_KEY.indexOf('YOUR_') === -1 &&
      cfg.SUPABASE_ANON_KEY.length > 20
    );
  };

  // Lazily create a single shared Supabase client (requires the CDN script,
  // which exposes the global `supabase`). Returns null when not configured.
  var _client = null;
  window.aleppoClient = function () {
    if (!window.aleppoIsConfigured()) return null;
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.warn('[Aleppo] supabase-js library not loaded.');
      return null;
    }
    if (!_client) {
      _client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    }
    return _client;
  };

  // Resolve an image value to a usable URL. Stored values are always directly
  // usable: either a repo-relative path (e.g. "hero-cover.png", served by
  // GitHub Pages) or a full https URL (what the CMS stores after an upload to
  // the Supabase "media" bucket). So this is effectively identity — kept as a
  // single choke-point in case resolution ever needs to change.
  window.aleppoMediaUrl = function (path) {
    return path || '';
  };
})();
