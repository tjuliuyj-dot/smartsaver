(function () {
  const seedRecords = Array.isArray(window.SMART_SAVER_SEED) ? window.SMART_SAVER_SEED : [];
  const orderStorageKey = "smart-saver-orders-v1";

  const storeCatalog = [
    {
      id: "okay",
      shortName: "OKay",
      displayName: "OKay Gent",
      badgeClass: "okay",
      address: "Voskenslaan 228, 9000 Gent",
      image: "./assets/okay-gent-official.jpg",
      imageAlt: "OKay Gent 官方门店图片",
      sourceUrl: "https://www.okay.be/fr/nos-magasins/okay-gent",
      note: "官网门店图与地址来自 OKay Gent 官方门店页。"
    },
    {
      id: "ah",
      shortName: "Albert Heijn",
      displayName: "AH Overpoortstraat",
      badgeClass: "ah",
      address: "Overpoortstraat 49 A, 9000 Gent",
      image: "./assets/ah-overpoort-official.png",
      imageAlt: "AH Overpoortstraat 官方门店页截图",
      sourceUrl: "https://www.ah.be/winkel/3026",
      note: "图片来自 AH Overpoortstraat 官方门店页截图。"
    },
    {
      id: "delhaize",
      shortName: "Delhaize",
      displayName: "Delhaize Gent Ster",
      badgeClass: "delhaize",
      address: "Kortrijksesteenweg 906, 9000 Gent",
      image: "./assets/delhaize-gent-ster-official.png",
      imageAlt: "Delhaize Gent Ster 官方门店图片",
      sourceUrl: "https://stores.delhaize.be/fr/delhaize-gent-ster",
      note: "图片来自 Delhaize Gent Ster 官方门店图库。"
    }
  ];

  const state = {
    orders: loadOrders(),
    filterStore: "all"
  };

  const elements = {
    storeGrid: document.getElementById("storeGrid"),
    orderForm: document.getElementById("orderForm"),
    storeSelect: document.getElementById("storeSelect"),
    orderDate: document.getElementById("orderDate"),
    orderTotal: document.getElementById("orderTotal"),
    orderBasket: document.getElementById("orderBasket"),
    orderNote: document.getElementById("orderNote"),
    formFeedback: document.getElementById("formFeedback"),
    statsGrid: document.getElementById("statsGrid"),
    orderFilter: document.getElementById("orderFilter"),
    ordersList: document.getElementById("ordersList"),
    referenceGrid: document.getElementById("referenceGrid")
  };

  initialize();

  function initialize() {
    renderStoreCards();
    hydrateStoreSelects();
    elements.orderDate.value = todayLocalISO();
    bindEvents();
    render();
  }

  function bindEvents() {
    elements.orderForm.addEventListener("submit", handleOrderSubmit);

    elements.orderFilter.addEventListener("change", function (event) {
      state.filterStore = event.target.value;
      renderOrders();
    });

    elements.storeGrid.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-store-id]");
      if (!trigger) {
        return;
      }

      const storeId = trigger.getAttribute("data-store-id");
      elements.storeSelect.value = storeId;
      elements.orderBasket.focus();
      elements.formFeedback.textContent = "已切换到「" + getStoreName(storeId) + "」，可以直接开始记这单。";
    });

    elements.ordersList.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-delete-order]");
      if (!trigger) {
        return;
      }

      const orderId = trigger.getAttribute("data-delete-order");
      if (!window.confirm("要删除这笔订单吗？")) {
        return;
      }

      state.orders = state.orders.filter(function (order) {
        return order.id !== orderId;
      });

      saveOrders();
      render();
      elements.formFeedback.textContent = "订单已删除。";
    });
  }

  function render() {
    renderStats();
    renderOrders();
    renderReferenceCards();
  }

  function renderStoreCards() {
    elements.storeGrid.innerHTML = storeCatalog
      .map(function (store) {
        return (
          '<article class="store-card">' +
          '<img class="store-image" src="' + escapeHtml(store.image) + '" alt="' + escapeHtml(store.imageAlt) + '" />' +
          '<div class="store-body">' +
          '<div class="store-topline">' +
          '<span class="badge ' + escapeHtml(store.badgeClass) + '">' + escapeHtml(store.shortName) + '</span>' +
          '<span class="sub-badge">Gent</span>' +
          '</div>' +
          '<h3>' + escapeHtml(store.displayName) + '</h3>' +
          '<p class="muted">' + escapeHtml(store.address) + '</p>' +
          '<p class="muted">' + escapeHtml(store.note) + '</p>' +
          '<div class="store-actions">' +
          '<button class="button button-primary" type="button" data-store-id="' + escapeHtml(store.id) + '">记这家</button>' +
          '<a class="link-button" href="' + escapeHtml(store.sourceUrl) + '" target="_blank" rel="noreferrer">官网门店页</a>' +
          '</div>' +
          '</div>' +
          '</article>'
        );
      })
      .join("");
  }

  function hydrateStoreSelects() {
    const storeOptions = storeCatalog.map(function (store) {
      return '<option value="' + escapeHtml(store.id) + '">' + escapeHtml(store.displayName) + '</option>';
    }).join("");

    elements.storeSelect.innerHTML = storeOptions;
    elements.orderFilter.innerHTML =
      '<option value="all">全部订单</option>' +
      storeCatalog.map(function (store) {
        return '<option value="' + escapeHtml(store.id) + '">' + escapeHtml(store.displayName) + '</option>';
      }).join("");
  }

  function handleOrderSubmit(event) {
    event.preventDefault();

    const formData = new FormData(elements.orderForm);
    const storeId = String(formData.get("storeId") || "").trim();
    const orderedAt = String(formData.get("orderedAt") || "").trim();
    const basket = String(formData.get("basket") || "").trim();
    const note = String(formData.get("note") || "").trim();
    const total = Number(formData.get("total"));

    if (!storeId || !orderedAt || !basket || !Number.isFinite(total) || total <= 0) {
      elements.formFeedback.textContent = "请至少填写超市、日期、总价和“买了什么”。";
      return;
    }

    const order = {
      id: "order-" + Date.now(),
      storeId: storeId,
      orderedAt: orderedAt,
      total: total,
      basket: basket,
      note: note,
      createdAt: new Date().toISOString()
    };

    state.orders.unshift(order);
    saveOrders();
    render();

    elements.orderForm.reset();
    elements.storeSelect.value = storeId;
    elements.orderDate.value = todayLocalISO();
    elements.formFeedback.textContent = "已保存「" + getStoreName(storeId) + "」的新订单。";
  }

  function renderStats() {
    const orders = state.orders.slice();
    const totalSpent = orders.reduce(function (sum, order) {
      return sum + order.total;
    }, 0);
    const average = orders.length > 0 ? totalSpent / orders.length : 0;
    const topStore = getTopStore(orders);

    const cards = [
      {
        label: "已记录订单",
        value: String(orders.length),
        note: orders.length > 0 ? "订单会保存在当前浏览器" : "先记第一单，后面就会累积"
      },
      {
        label: "累计花费",
        value: formatMoney(totalSpent),
        note: orders.length > 0 ? "平均每单 " + formatMoney(average) : "还没有数据"
      },
      {
        label: "最常去超市",
        value: topStore ? topStore.name : "待生成",
        note: topStore ? "当前出现 " + topStore.count + " 次" : "至少保存一单后再统计"
      }
    ];

    elements.statsGrid.innerHTML = cards
      .map(function (card) {
        return (
          '<article class="stat-card">' +
          '<div class="stat-label">' + escapeHtml(card.label) + '</div>' +
          '<div class="stat-value">' + escapeHtml(card.value) + '</div>' +
          '<div class="muted">' + escapeHtml(card.note) + '</div>' +
          '</article>'
        );
      })
      .join("");
  }

  function renderOrders() {
    const orders = getVisibleOrders();

    if (orders.length === 0) {
      elements.ordersList.innerHTML = '<div class="empty-state">这里还没有订单。先记一单，后面就能按超市回看。</div>';
      return;
    }

    elements.ordersList.innerHTML = orders
      .map(function (order) {
        const store = getStore(order.storeId);
        return (
          '<article class="order-card">' +
          '<div class="order-topline">' +
          '<span class="badge ' + escapeHtml(store.badgeClass) + '">' + escapeHtml(store.shortName) + '</span>' +
          '<span class="sub-badge">' + escapeHtml(formatDate(order.orderedAt)) + '</span>' +
          '</div>' +
          '<div class="order-total">' + escapeHtml(formatMoney(order.total)) + '</div>' +
          '<div class="order-meta">' + escapeHtml(order.basket) + '</div>' +
          (order.note ? '<div class="order-meta">备注：' + escapeHtml(order.note) + '</div>' : '') +
          '<div class="order-actions">' +
          '<a class="link-button" href="' + escapeHtml(store.sourceUrl) + '" target="_blank" rel="noreferrer">看官网门店页</a>' +
          '<button class="ghost-button" type="button" data-delete-order="' + escapeHtml(order.id) + '">删除</button>' +
          '</div>' +
          '</article>'
        );
      })
      .join("");
  }

  function renderReferenceCards() {
    const references = [
      {
        label: "早餐谷物",
        description: "你原来价格库里目前最稳的 granola 参考。",
        record: getGroupWinner("granola")
      },
      {
        label: "卷纸",
        description: "纸品还是保留一个底价参考最省心。",
        record: getGroupWinner("toilet-paper")
      },
      {
        label: "酸奶",
        description: "高频补货品只保留一个最低记忆点。",
        record: getGroupWinner("yoghurt")
      }
    ];

    elements.referenceGrid.innerHTML = references
      .map(function (item) {
        if (!item.record) {
          return (
            '<article class="reference-card">' +
            '<div class="reference-topline"><span class="sub-badge">' + escapeHtml(item.label) + '</span></div>' +
            '<h3>还没有基准</h3>' +
            '<div class="reference-detail">' + escapeHtml(item.description) + '</div>' +
            '</article>'
          );
        }

        return (
          '<article class="reference-card">' +
          '<div class="reference-topline"><span class="sub-badge">' + escapeHtml(item.label) + '</span></div>' +
          '<h3>' + escapeHtml(item.record.name) + '</h3>' +
          '<div class="reference-detail">' +
          escapeHtml(item.record.storeName + ' · ' + formatMoney(item.record.totalPrice) + ' · ' + formatUnitPrice(item.record.unitPrice, item.record.normalizedUnit)) +
          '</div>' +
          '<div class="reference-detail">' + escapeHtml(item.description) + '</div>' +
          '</article>'
        );
      })
      .join("");
  }

  function getVisibleOrders() {
    return state.orders
      .filter(function (order) {
        return state.filterStore === "all" || order.storeId === state.filterStore;
      })
      .slice()
      .sort(function (left, right) {
        if (left.orderedAt === right.orderedAt) {
          return right.createdAt.localeCompare(left.createdAt);
        }

        return right.orderedAt.localeCompare(left.orderedAt);
      });
  }

  function getGroupWinner(groupKey) {
    const records = seedRecords.filter(function (record) {
      return record.comparisonGroup === groupKey && isNumber(record.unitPrice) && record.normalizedUnit;
    });

    if (records.length === 0) {
      return null;
    }

    return records.slice().sort(function (left, right) {
      return left.unitPrice - right.unitPrice;
    })[0];
  }

  function getTopStore(orders) {
    if (orders.length === 0) {
      return null;
    }

    const counts = orders.reduce(function (result, order) {
      result[order.storeId] = (result[order.storeId] || 0) + 1;
      return result;
    }, {});

    return Object.keys(counts)
      .map(function (storeId) {
        return {
          id: storeId,
          name: getStoreName(storeId),
          count: counts[storeId]
        };
      })
      .sort(function (left, right) {
        return right.count - left.count;
      })[0];
  }

  function getStore(storeId) {
    return storeCatalog.find(function (store) {
      return store.id === storeId;
    }) || storeCatalog[0];
  }

  function getStoreName(storeId) {
    return getStore(storeId).displayName;
  }

  function loadOrders() {
    try {
      const raw = window.localStorage.getItem(orderStorageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isValidOrder) : [];
    } catch (error) {
      return [];
    }
  }

  function saveOrders() {
    window.localStorage.setItem(orderStorageKey, JSON.stringify(state.orders));
  }

  function isValidOrder(order) {
    return Boolean(order && order.id && order.storeId && order.orderedAt && isNumber(order.total));
  }

  function formatMoney(value) {
    if (!isNumber(value)) {
      return "€0.00";
    }

    return "€" + value.toFixed(2);
  }

  function formatUnitPrice(value, unit) {
    if (!isNumber(value) || !unit) {
      return "单价待补充";
    }

    const digits = value < 0.1 ? 3 : 2;
    return "€" + value.toFixed(digits) + " / " + unit;
  }

  function formatDate(value) {
    const date = new Date(value + "T12:00:00");
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("zh-CN", {
      month: "short",
      day: "numeric"
    }).format(date);
  }

  function todayLocalISO() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
