(function () {
  "use strict";

  // ─── Data Sources ──────────────────────────────────────────────────────────
  var seedRecords = Array.isArray(window.SMART_SAVER_SEED) ? window.SMART_SAVER_SEED : [];
  
  var userStorageKey = "smart-saver-user-prices-v2";
  var photoStorageKey = "smart-saver-photos-v1";
  var regionStorageKey = "smart-saver-region-v1";
  var customStoresKey = "smart-saver-custom-stores-v1";
  var customCountriesKey = "smart-saver-custom-countries-v1";

  // ─── Default Store Catalogs by City ────────────────────────────────────────
  var defaultStores = {
    belgium: [
      { id: "okay",     shortName: "OKay",         displayName: "OKay Belgium",       badgeClass: "okay",     sourceUrl: "https://www.okay.be" },
      { id: "ah",       shortName: "Albert Heijn",  displayName: "AH Belgium",         badgeClass: "ah",       sourceUrl: "https://www.ah.be" },
      { id: "delhaize", shortName: "Delhaize",      displayName: "Delhaize Belgium",   badgeClass: "delhaize", sourceUrl: "https://www.delhaize.be" },
      { id: "colruyt",  shortName: "Colruyt",       displayName: "Colruyt Belgium",    badgeClass: "colruyt",  sourceUrl: "https://www.colruyt.be" },
      { id: "lidl",     shortName: "Lidl",          displayName: "Lidl Belgium",       badgeClass: "lidl",     sourceUrl: "https://www.lidl.be" }
    ],
    netherlands: [
      { id: "ah",       shortName: "Albert Heijn",  displayName: "AH Netherlands",     badgeClass: "ah",       sourceUrl: "https://www.ah.nl" },
      { id: "jumbo",    shortName: "Jumbo",         displayName: "Jumbo Netherlands",  badgeClass: "default",  sourceUrl: "https://www.jumbo.com" },
      { id: "lidl",     shortName: "Lidl",          displayName: "Lidl Netherlands",   badgeClass: "lidl",     sourceUrl: "https://www.lidl.nl" }
    ],
    france: [
      { id: "carrefour", shortName: "Carrefour",    displayName: "Carrefour France",   badgeClass: "default",  sourceUrl: "https://www.carrefour.fr" },
      { id: "leclerc",   shortName: "Leclerc",      displayName: "E.Leclerc France",   badgeClass: "default",  sourceUrl: "https://www.e-leclerc.com" }
    ],
    germany: [
      { id: "rewe",     shortName: "REWE",          displayName: "REWE Germany",       badgeClass: "default",  sourceUrl: "https://www.rewe.de" },
      { id: "lidl",     shortName: "Lidl",          displayName: "Lidl Germany",       badgeClass: "lidl",     sourceUrl: "https://www.lidl.de" }
    ],
    china: [
      { id: "hema",     shortName: "盒马",          displayName: "盒马鲜生",             badgeClass: "default",  sourceUrl: "#" },
      { id: "walmart",  shortName: "沃尔玛",        displayName: "沃尔玛中国",           badgeClass: "default",  sourceUrl: "#" }
    ]
  };

  var defaultCountryLabels = {
    belgium: "🇧🇪 Belgium",
    netherlands: "🇳🇱 Netherlands",
    france: "🇫🇷 France",
    germany: "🇩🇪 Germany",
    china: "🇨🇳 China"
  };

  var currentRegion = localStorage.getItem(regionStorageKey) || "belgium";
  var userPrices = loadUserPrices();
  var customStores = loadCustomStores();
  var customCountries = loadCustomCountries();
  var selectedCountryTemp = currentRegion; // For confirm step
  var capturedPhoto = null;
  var browseCategory = "all";

  function getStoreCatalog() {
    var base = defaultStores[currentRegion] || [];
    var custom = (customStores[currentRegion] || []);
    return base.concat(custom);
  }

  function getAllRecords() {
    // Seed data is for Belgium; user prices are tagged with region
    var regionSeed = seedRecords.filter(function (r) {
      return (r.region || "belgium") === currentRegion;
    });
    var regionUser = userPrices.filter(function (r) {
      return (r.region || "belgium") === currentRegion;
    });
    return regionSeed.concat(regionUser);
  }

  // ─── DOM Elements ──────────────────────────────────────────────────────────
  var el = {
    heroEyebrow:     document.getElementById("heroEyebrow"),
    regionSelect:    document.getElementById("regionSelect"),
    manageStoresBtn: document.getElementById("manageStoresBtn"),
    searchInput:     document.getElementById("searchInput"),
    searchBtn:       document.getElementById("searchBtn"),
    cameraInput:     document.getElementById("cameraInput"),
    photoPreview:    document.getElementById("photoPreview"),
    photoImg:        document.getElementById("photoImg"),
    removePhoto:     document.getElementById("removePhoto"),
    resultsSection:  document.getElementById("resultsSection"),
    resultsTitle:    document.getElementById("resultsTitle"),
    resultsGrid:     document.getElementById("resultsGrid"),
    addPriceSection: document.getElementById("addPriceSection"),
    addPriceForm:    document.getElementById("addPriceForm"),
    newName:         document.getElementById("newName"),
    newBrand:        document.getElementById("newBrand"),
    newStore:        document.getElementById("newStore"),
    newSize:         document.getElementById("newSize"),
    newPrice:        document.getElementById("newPrice"),
    newUnitPrice:    document.getElementById("newUnitPrice"),
    newUnit:         document.getElementById("newUnit"),
    newCategory:     document.getElementById("newCategory"),
    newNotes:        document.getElementById("newNotes"),
    addFeedback:     document.getElementById("addFeedback"),
    browseFilter:    document.getElementById("browseFilter"),
    browseGrid:      document.getElementById("browseGrid"),
    // Modals
    storeModal:      document.getElementById("storeModal"),
    closeModal:      document.getElementById("closeModal"),
    modalCountryName:document.getElementById("modalCountryName"),
    storeList:       document.getElementById("storeList"),
    addStoreForm:    document.getElementById("addStoreForm"),
    newStoreName:    document.getElementById("newStoreName"),
    newStoreAddress: document.getElementById("newStoreAddress"),
    storeFeedback:   document.getElementById("storeFeedback"),
    countryModal:    document.getElementById("countryModal"),
    closeCountryModal:document.getElementById("closeCountryModal"),
    customCountryList:document.getElementById("customCountryList"),
    confirmCountryBtn:document.getElementById("confirmCountryBtn"),
    addCountryForm:  document.getElementById("addCountryForm"),
    newCountryName:  document.getElementById("newCountryName"),
    newCountryFlag:  document.getElementById("newCountryFlag"),
    countryFeedback: document.getElementById("countryFeedback")
  };

  // ─── Initialize ────────────────────────────────────────────────────────────
  rebuildCountryOptions();
  el.regionSelect.value = currentRegion;
  applyRegion();
  bindEvents();

  // ─── Event Binding ─────────────────────────────────────────────────────────
  function bindEvents() {
    el.searchBtn.addEventListener("click", doSearch);
    el.searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); doSearch(); }
    });
    el.cameraInput.addEventListener("change", handlePhoto);
    el.removePhoto.addEventListener("click", clearPhoto);
    el.addPriceForm.addEventListener("submit", handleAddPrice);
    el.browseFilter.addEventListener("change", function () {
      browseCategory = this.value;
      renderBrowse();
    });
    el.browseGrid.addEventListener("click", handleBrowseClick);

    // Region
    el.regionSelect.addEventListener("change", handleRegionChange);

    // Store modal
    el.manageStoresBtn.addEventListener("click", openStoreModal);
    el.closeModal.addEventListener("click", function () { el.storeModal.hidden = true; });
    el.storeModal.addEventListener("click", function (e) { if (e.target === el.storeModal) el.storeModal.hidden = true; });
    el.addStoreForm.addEventListener("submit", handleAddStore);
    el.storeList.addEventListener("click", handleDeleteStore);

    // Country modal
    el.closeCountryModal.addEventListener("click", function () { el.countryModal.hidden = true; });
    el.countryModal.addEventListener("click", function (e) { if (e.target === el.countryModal) el.countryModal.hidden = true; });
    el.addCountryForm.addEventListener("submit", handleAddCountry);
    el.customCountryList.addEventListener("click", handleCountryItemClick);
    el.confirmCountryBtn.addEventListener("click", handleConfirmCountry);
  }

  // ─── Region / Country ──────────────────────────────────────────────────────
  function handleRegionChange() {
    var val = el.regionSelect.value;
    if (val === "custom") {
      selectedCountryTemp = currentRegion; // Reset to active
      renderCustomCountryList();
      el.countryModal.hidden = false;
      el.regionSelect.value = currentRegion; // revert while modal is open
      return;
    }
    currentRegion = val;
    saveRegion();
    applyRegion();
  }

  function applyRegion() {
    var label = defaultCountryLabels[currentRegion] || getCountryLabel(currentRegion);
    el.heroEyebrow.textContent = "SmartSaver · " + label.replace(/^[^\s]+\s*/, "");
    populateStoreSelect();
    renderBrowse();
    // Clear previous results
    el.resultsSection.hidden = true;
    el.addPriceSection.hidden = true;
  }

  function getCountryLabel(id) {
    for (var i = 0; i < customCountries.length; i++) {
      if (customCountries[i].id === id) return customCountries[i].label;
    }
    return id;
  }

  function rebuildCountryOptions() {
    var html = '';
    for (var key in defaultCountryLabels) {
      html += '<option value="' + key + '">' + defaultCountryLabels[key] + '</option>';
    }
    customCountries.forEach(function (c) {
      html += '<option value="' + esc(c.id) + '">' + esc(c.label) + '</option>';
    });
    html += '<option value="custom">➕ Add country...</option>';
    el.regionSelect.innerHTML = html;
    el.regionSelect.value = currentRegion;
    renderCustomCountryList();
  }

  function renderCustomCountryList() {
    var allCountries = [];
    for (var key in defaultCountryLabels) {
      allCountries.push({ id: key, label: defaultCountryLabels[key], isDefault: true });
    }
    customCountries.forEach(function (c) {
      allCountries.push({ id: c.id, label: c.label, isDefault: false });
    });

    el.customCountryList.innerHTML = allCountries.map(function (c) {
      var isSelected = c.id === selectedCountryTemp;
      return (
        '<div class="store-item country-item ' + (isSelected ? 'current-country' : '') + '" data-country-id="' + esc(c.id) + '">' +
        '<span class="store-item-name">' + esc(c.label) + '</span>' +
        (isSelected ? '<span class="best-tag">Selected</span>' : '') +
        (!c.isDefault ? '<button class="ghost-button small-btn delete-city-btn" data-delete-country="' + esc(c.id) + '">🗑</button>' : '') +
        '</div>'
      );
    }).join("");
  }

  function handleCountryItemClick(e) {
    var deleteBtn = e.target.closest("[data-delete-country]");
    if (deleteBtn) {
      e.stopPropagation();
      var countryId = deleteBtn.getAttribute("data-delete-country");
      if (confirm("Delete database for " + countryId + "? This cannot be undone.")) {
        customCountries = customCountries.filter(function(c) { return c.id !== countryId; });
        saveCustomCountries();
        rebuildCountryOptions();
      }
      return;
    }

    var item = e.target.closest("[data-country-id]");
    if (!item) return;

    selectedCountryTemp = item.getAttribute("data-country-id");
    renderCustomCountryList();
  }

  function handleConfirmCountry() {
    currentRegion = selectedCountryTemp;
    saveRegion();
    applyRegion();
    el.regionSelect.value = currentRegion;
    el.countryModal.hidden = true;
  }

  function handleAddCountry(e) {
    e.preventDefault();
    var name = el.newCountryName.value.trim();
    var flag = el.newCountryFlag.value.trim() || "🌍";
    if (!name) return;

    var id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (defaultCountryLabels[id] || customCountries.some(function (c) { return c.id === id; })) {
      el.countryFeedback.textContent = "This country already exists.";
      return;
    }

    customCountries.push({ id: id, label: flag + " " + name });
    saveCustomCountries();
    rebuildCountryOptions();

    selectedCountryTemp = id;
    renderCustomCountryList();
    
    el.addCountryForm.reset();
    el.countryFeedback.textContent = "";
  }

  // ─── Store Management ──────────────────────────────────────────────────────
  function openStoreModal() {
    var label = defaultCountryLabels[currentRegion] || getCountryLabel(currentRegion);
    el.modalCountryName.textContent = label;
    renderStoreList();
    el.storeModal.hidden = false;
  }

  function renderStoreList() {
    var stores = getStoreCatalog();
    el.storeList.innerHTML = stores.map(function (s) {
      var isCustom = !!(customStores[currentRegion] || []).find(function (cs) { return cs.id === s.id; });
      return (
        '<div class="store-item">' +
        '<span class="badge ' + s.badgeClass + '">' + esc(s.shortName) + '</span>' +
        '<span class="store-item-name">' + esc(s.displayName) + '</span>' +
        (isCustom ? '<button class="ghost-button small-btn" data-delete-store="' + esc(s.id) + '">🗑</button>' : '<span class="store-item-default">Built-in</span>') +
        '</div>'
      );
    }).join("");
  }

  function handleAddStore(e) {
    e.preventDefault();
    var name = el.newStoreName.value.trim();
    var address = el.newStoreAddress.value.trim();
    if (!name) return;

    var id = currentRegion + "-" + name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    var store = {
      id: id,
      shortName: name,
      displayName: name + (address ? " (" + address + ")" : ""),
      badgeClass: "default",
      sourceUrl: "",
      address: address
    };

    if (!customStores[currentRegion]) customStores[currentRegion] = [];
    customStores[currentRegion].push(store);
    saveCustomStores();

    renderStoreList();
    populateStoreSelect();
    el.addStoreForm.reset();
    el.storeFeedback.textContent = '✅ Added "' + name + '"';
  }

  function handleDeleteStore(e) {
    var btn = e.target.closest("[data-delete-store]");
    if (!btn) return;
    var storeId = btn.getAttribute("data-delete-store");

    customStores[currentRegion] = (customStores[currentRegion] || []).filter(function (s) {
      return s.id !== storeId;
    });
    saveCustomStores();
    renderStoreList();
    populateStoreSelect();
  }

  // ─── Search ────────────────────────────────────────────────────────────────
  function doSearch() {
    var query = el.searchInput.value.trim().toLowerCase();
    if (query.length < 1) return;

    var all = getAllRecords();
    var matches = all.filter(function (r) {
      var haystack = [
        r.name, r.brand, r.category,
        r.comparisonGroup, r.notes,
        (r.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return haystack.indexOf(query) !== -1;
    });

    // Also find records in the same comparison groups
    var groups = {};
    matches.forEach(function (m) {
      if (m.comparisonGroup) groups[m.comparisonGroup] = true;
    });
    var groupMatches = all.filter(function (r) {
      return r.comparisonGroup && groups[r.comparisonGroup] && matches.indexOf(r) === -1;
    });

    var combined = matches.concat(groupMatches);
    combined.sort(function (a, b) {
      var ua = isNum(a.unitPrice) ? a.unitPrice : 99999;
      var ub = isNum(b.unitPrice) ? b.unitPrice : 99999;
      return ua - ub;
    });

    renderResults(query, combined);
  }

  function renderResults(query, records) {
    el.resultsSection.hidden = false;
    el.addPriceSection.hidden = false;
    el.resultsTitle.textContent = records.length + ' results for "' + query + '"';
    el.newName.value = el.searchInput.value.trim();

    if (records.length === 0) {
      el.resultsGrid.innerHTML =
        '<div class="empty-state">No matches found. Add this product below! ⬇️</div>';
      return;
    }

    var cheapestPrice = null;
    records.forEach(function (r) {
      if (isNum(r.unitPrice) && (cheapestPrice === null || r.unitPrice < cheapestPrice))
        cheapestPrice = r.unitPrice;
    });

    el.resultsGrid.innerHTML = records.map(function (r) {
      var isCheapest = isNum(r.unitPrice) && r.unitPrice === cheapestPrice;
      var priceClass = isCheapest ? "price-best" : (isNum(r.unitPrice) && r.unitPrice > cheapestPrice * 1.3) ? "price-high" : "";
      var badge = getStoreBadge(r.storeId || "", r.storeName || "");
      var userTag = r._isUser ? '<span class="user-tag">You</span>' : '';
      var promoTag = r.promotion ? '<span class="promo-tag">Promo</span>' : '';

      return (
        '<article class="result-card ' + (isCheapest ? 'best-deal' : '') + '">' +
        '<div class="result-topline">' + badge + userTag + promoTag +
        (isCheapest ? '<span class="best-tag">✅ Best Price</span>' : '') +
        '</div>' +
        '<h3>' + esc(r.name) + '</h3>' +
        '<div class="result-brand">' + esc(r.brand || "") + ' · ' + esc(r.sizeLabel || "") + '</div>' +
        '<div class="result-prices">' +
        '<span class="result-total ' + priceClass + '">€' + formatNum(r.totalPrice) + '</span>' +
        '<span class="result-unit">' + formatUnitPrice(r.unitPrice, r.normalizedUnit) + '</span>' +
        '</div>' +
        (r.notes ? '<div class="result-note">' + esc(r.notes) + '</div>' : '') +
        '</article>'
      );
    }).join("");
  }

  // ─── Camera / Photo ────────────────────────────────────────────────────────
  function handlePhoto(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      capturedPhoto = ev.target.result;
      el.photoImg.src = capturedPhoto;
      el.photoPreview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  function clearPhoto() {
    capturedPhoto = null;
    el.photoPreview.hidden = true;
    el.cameraInput.value = "";
  }

  // ─── Add New Price ─────────────────────────────────────────────────────────
  function handleAddPrice(e) {
    e.preventDefault();
    var name = el.newName.value.trim();
    var brand = el.newBrand.value.trim();
    var storeId = el.newStore.value;
    var size = el.newSize.value.trim();
    var price = parseFloat(el.newPrice.value);
    var unitPrice = parseFloat(el.newUnitPrice.value);
    var unit = el.newUnit.value;
    var category = el.newCategory.value;
    var notes = el.newNotes.value.trim();

    if (!name || !isNum(price)) {
      el.addFeedback.textContent = "Please fill in at least the product name and price.";
      return;
    }

    var store = getStore(storeId);
    var record = {
      id: "user-" + Date.now(),
      storeId: storeId,
      storeName: store ? store.displayName : storeId,
      chain: store ? store.shortName : "",
      category: category,
      comparisonGroup: nameToGroup(name),
      name: name,
      brand: brand,
      sizeLabel: size,
      totalPrice: price,
      unitPrice: isNum(unitPrice) ? unitPrice : null,
      normalizedUnit: isNum(unitPrice) ? unit : null,
      recordedAt: todayISO(),
      healthScore: null,
      nutriScore: null,
      promotion: false,
      tags: [],
      notes: notes,
      region: currentRegion,
      _isUser: true
    };

    if (capturedPhoto) {
      record.photoId = "photo-" + Date.now();
      savePhoto(record.photoId, capturedPhoto);
      clearPhoto();
    }

    userPrices.push(record);
    saveUserPrices();

    var storeName = store ? store.displayName : storeId;
    el.addFeedback.textContent = '✅ Saved "' + name + '" at ' + storeName + ' (€' + price.toFixed(2) + ')';
    el.addPriceForm.reset();
    el.newStore.value = storeId;

    if (el.searchInput.value.trim()) doSearch();
    renderBrowse();
  }

  // ─── Browse All ────────────────────────────────────────────────────────────
  function renderBrowse() {
    var all = getAllRecords();
    if (browseCategory !== "all") {
      all = all.filter(function (r) { return r.category === browseCategory; });
    }
    all.sort(function (a, b) {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      var ua = isNum(a.unitPrice) ? a.unitPrice : 99999;
      var ub = isNum(b.unitPrice) ? b.unitPrice : 99999;
      return ua - ub;
    });

    if (all.length === 0) {
      el.browseGrid.innerHTML = '<div class="empty-state">No products recorded for this city yet. Start adding prices!</div>';
      return;
    }

    el.browseGrid.innerHTML = all.map(function (r) {
      var badge = getStoreBadge(r.storeId || "", r.storeName || "");
      var userTag = r._isUser ? '<span class="user-tag">You</span>' : '';
      return (
        '<article class="result-card browse-card" data-product-name="' + esc(r.name) + '">' +
        '<div class="result-topline">' + badge + userTag +
        '<span class="sub-badge">' + esc(categoryLabel(r.category)) + '</span>' +
        '</div>' +
        '<h3>' + esc(r.name) + '</h3>' +
        '<div class="result-brand">' + esc(r.brand || "") + ' · ' + esc(r.sizeLabel || "") + '</div>' +
        '<div class="result-prices">' +
        '<span class="result-total">€' + formatNum(r.totalPrice) + '</span>' +
        '<span class="result-unit">' + formatUnitPrice(r.unitPrice, r.normalizedUnit) + '</span>' +
        '</div>' +
        '</article>'
      );
    }).join("");
  }

  function handleBrowseClick(e) {
    var card = e.target.closest("[data-product-name]");
    if (!card) return;
    el.searchInput.value = card.getAttribute("data-product-name");
    doSearch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function populateStoreSelect() {
    var stores = getStoreCatalog();
    el.newStore.innerHTML = stores.map(function (s) {
      return '<option value="' + esc(s.id) + '">' + esc(s.displayName) + '</option>';
    }).join("");
  }

  function getStore(storeId) {
    var stores = getStoreCatalog();
    return stores.find(function (s) { return s.id === storeId; }) || null;
  }

  function getStoreBadge(storeId, storeName) {
    var stores = getStoreCatalog();
    var store = stores.find(function (s) { return s.id === storeId; });
    var cls = store ? store.badgeClass : "default";
    var label = store ? store.shortName : (storeName || "Store");
    return '<span class="badge ' + cls + '">' + esc(label) + '</span>';
  }

  function nameToGroup(name) {
    var lower = name.toLowerCase();
    var map = {
      "黄瓜": "cucumber", "komkommer": "cucumber",
      "葱": "spring-onion", "ui": "spring-onion",
      "燕麦": "oats", "havermout": "oats",
      "麦片": "granola", "muesli": "granola", "granola": "granola",
      "卷纸": "toilet-paper", "卫生纸": "toilet-paper", "toiletpapier": "toilet-paper",
      "酸奶": "yoghurt", "yoghurt": "yoghurt",
      "牛奶": "milk", "melk": "milk",
      "鸡蛋": "eggs", "eieren": "eggs",
      "五花肉": "pork-belly", "spek": "pork-belly",
      "鸡": "chicken", "kip": "chicken",
      "虾": "shrimp", "garnalen": "shrimp",
      "三文鱼": "smoked-salmon", "zalm": "smoked-salmon",
      "甜椒": "bell-pepper", "paprika": "bell-pepper",
      "芦笋": "asparagus", "asperges": "asparagus",
      "牛油果": "avocado", "avocado": "avocado",
      "香蕉": "banana", "banaan": "banana",
      "腰果": "nuts", "cashew": "nuts",
      "杏仁": "nuts", "amandel": "nuts",
      "核桃": "nuts", "walnoot": "nuts",
      "厨房纸": "kitchen-roll", "keukenrol": "kitchen-roll",
      "抽纸": "tissue-box", "tissue": "tissue-box",
      "冰淇淋": "ice-cream", "ijs": "ice-cream",
      "油": "cooking-oil", "olie": "cooking-oil"
    };
    for (var key in map) {
      if (lower.indexOf(key) !== -1) return map[key];
    }
    return lower.replace(/[^a-z0-9\u4e00-\u9fff]/g, "-").substring(0, 30);
  }

  function categoryLabel(cat) {
    var map = {
      "粮油早餐": "Groceries", "蛋奶乳品": "Dairy", "肉类海鲜": "Meat",
      "生鲜果蔬": "Produce", "冷冻蔬菜": "Frozen", "坚果零食": "Snacks", "居家日化": "Household"
    };
    return map[cat] || cat;
  }

  function formatNum(val) { return isNum(val) ? val.toFixed(2) : "--"; }
  function formatUnitPrice(val, unit) {
    if (!isNum(val) || !unit) return "";
    return "€" + val.toFixed(val < 0.1 ? 3 : 2) + " / " + unit;
  }
  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // ─── Storage ───────────────────────────────────────────────────────────────
  var userStorageBase = "smart-saver-user-prices-v2";
  var regionStorageBase = "smart-saver-region-v1";
  var customStoresBase = "smart-saver-custom-stores-v1";
  var customCitiesBase = "smart-saver-custom-cities-v1";
  function loadRegion() {
    return localStorage.getItem(regionStorageKey) || "gent";
  }
  function saveRegion() {
    localStorage.setItem(regionStorageKey, currentRegion);
  }
  function loadUserPrices() {
    try {
      var raw = localStorage.getItem(userStorageKey);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(function (r) { r._isUser = true; return r; }) : [];
    } catch (e) { return []; }
  }
  function saveUserPrices() {
    localStorage.setItem(userStorageKey, JSON.stringify(userPrices));
  }
  function loadCustomStores() {
    try {
      return JSON.parse(localStorage.getItem(customStoresKey) || "{}");
    } catch (e) { return {}; }
  }
  function saveCustomStores() {
    localStorage.setItem(customStoresKey, JSON.stringify(customStores));
  }
  function loadCustomCountries() {
    try {
      return JSON.parse(localStorage.getItem(customCountriesKey) || "[]");
    } catch (e) { return []; }
  }
  function saveCustomCountries() {
    localStorage.setItem(customCountriesKey, JSON.stringify(customCountries));
  }
  function savePhoto(id, dataUrl) {
    try {
      var photos = JSON.parse(localStorage.getItem(photoStorageKey) || "{}");
      photos[id] = dataUrl;
      localStorage.setItem(photoStorageKey, JSON.stringify(photos));
    } catch (e) { /* storage full */ }
  }

  function esc(val) {
    return String(val == null ? "" : val)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
})();
