const API_BASE_URL = window.AGRISHARE_CONFIG?.API_BASE_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = new URL(API_BASE_URL).origin;
const TOKEN_KEY = "agrishare_admin_token";
const USER_KEY = "agrishare_admin_user";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

const statusLabels = {
  new: "Mới",
  contacting: "Đang tư vấn",
  awaiting_payment: "Chờ thanh toán",
  paid: "Đã thanh toán",
  escrow_ready: "Sẵn sàng ký quỹ",
  in_production: "Theo dõi mùa vụ",
  ready_to_deliver: "Chờ bàn giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const deliveryLabels = {
  home_delivery: "Nhận hàng tại nhà",
  farm_pickup: "Trải nghiệm và nhận sản phẩm tại Farm",
};

const paymentLabels = {
  bank_transfer: "Chuyển khoản",
  cash_consultation: "Tư vấn thanh toán",
  later: "Thanh toán sau",
};

const loginPanel = document.querySelector("#loginPanel");
const dashboardPanel = document.querySelector("#dashboardPanel");
const loginForm = document.querySelector("#loginForm");
const loginStatus = document.querySelector("#loginStatus");
const logoutButton = document.querySelector("#logoutButton");
const sessionName = document.querySelector("#sessionName");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const refreshButton = document.querySelector("#refreshButton");
const exportButton = document.querySelector("#exportButton");
const adminNavLinks = document.querySelectorAll("[data-admin-view]");
const adminViews = document.querySelectorAll(".admin-view");
const ordersTableBody = document.querySelector("#ordersTableBody");
const emptyState = document.querySelector("#emptyState");
const orderDetail = document.querySelector("#orderDetail");
const projectForm = document.querySelector("#projectForm");
const resetProjectFormButton = document.querySelector("#resetProjectForm");
const projectStatus = document.querySelector("#projectStatus");
const projectsTableBody = document.querySelector("#projectsTableBody");
const customerSearchInput = document.querySelector("#customerSearchInput");
const refreshCustomersButton = document.querySelector("#refreshCustomersButton");
const customersTableBody = document.querySelector("#customersTableBody");
const refreshAnalyticsButton = document.querySelector("#refreshAnalyticsButton");
const analyticsGrid = document.querySelector("#analyticsGrid");
const settingsForm = document.querySelector("#settingsForm");
const settingsStatus = document.querySelector("#settingsStatus");
const projectUpdateForm = document.querySelector("#projectUpdateForm");
const projectUpdateStatus = document.querySelector("#projectUpdateStatus");
const refreshAuditButton = document.querySelector("#refreshAuditButton");
const auditTableBody = document.querySelector("#auditTableBody");
const passwordForm = document.querySelector("#passwordForm");
const passwordStatus = document.querySelector("#passwordStatus");
const roleBanner = document.querySelector("#roleBanner");
const metricTotal = document.querySelector("#metricTotal");
const metricRevenue = document.querySelector("#metricRevenue");
const metricContacting = document.querySelector("#metricContacting");
const metricPayment = document.querySelector("#metricPayment");

let orders = [];
let selectedOrderCode = "";
let projects = [];
let customers = [];
let auditLogs = [];
let currentView = "orders";

const roleAccess = {
  admin: {
    views: ["orders", "projects", "customers", "analytics", "settings", "audit", "account"],
    canEditOrders: true,
    canEditProjects: true,
    canCreateProjectUpdates: true,
    canEditCustomers: true,
    canEditSettings: true,
    canViewAudit: true,
    description: "Toàn quyền cấu hình, dự án, đơn hàng, CRM và analytics.",
  },
  sale: {
    views: ["orders", "customers", "analytics", "settings", "account"],
    canEditOrders: true,
    canEditProjects: false,
    canCreateProjectUpdates: false,
    canEditCustomers: true,
    canEditSettings: false,
    canViewAudit: false,
    description: "Xử lý đơn, tư vấn khách hàng, theo dõi doanh số và xem cấu hình vận hành.",
  },
  farm: {
    views: ["projects", "account"],
    canEditOrders: false,
    canEditProjects: true,
    canCreateProjectUpdates: true,
    canEditCustomers: false,
    canEditSettings: false,
    canViewAudit: false,
    description: "Quản lý dự án/farm và cập nhật thông tin mùa vụ.",
  },
  auditor: {
    views: ["orders", "projects", "analytics", "audit", "account"],
    canEditOrders: false,
    canEditProjects: false,
    canCreateProjectUpdates: true,
    canEditCustomers: false,
    canEditSettings: false,
    canViewAudit: true,
    description: "Theo dõi đơn, dự án và số liệu để kiểm soát minh bạch.",
  },
};

function getCurrentRole() {
  return getStoredUser()?.role || "";
}

function getAccess() {
  return roleAccess[getCurrentRole()] || roleAccess.auditor;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch (error) {
    return null;
  }
}

function normalizeUploadedUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Không thể đọc file upload"));
    reader.readAsDataURL(file);
  });
}

async function uploadFile(file, folder, authenticated = true) {
  if (!file) return "";

  const dataUrl = await fileToDataUrl(file);
  const response = await fetch(`${API_BASE_URL}/uploads/${authenticated ? "admin" : "public"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authenticated ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: JSON.stringify({
      dataUrl,
      folder,
      originalName: file.name,
    }),
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Không thể upload file");
  }

  return normalizeUploadedUrl(data.file.url);
}

function setSession(user, token) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  renderSession();
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  orders = [];
  selectedOrderCode = "";
  renderSession();
  renderOrders();
}

function renderSession() {
  const user = getStoredUser();
  const loggedIn = Boolean(getToken() && user);

  loginPanel.hidden = loggedIn;
  dashboardPanel.hidden = !loggedIn;
  logoutButton.hidden = !loggedIn;
  sessionName.textContent = loggedIn ? `${user.fullName} (${user.role})` : "Chưa đăng nhập";

  if (loggedIn) {
    applyRoleAccess();
    loadCurrentView();
  }
}

function switchView(view) {
  const access = getAccess();
  if (!access.views.includes(view)) {
    view = access.views[0] || "orders";
  }

  currentView = view;
  adminNavLinks.forEach((link) => link.classList.toggle("active", link.dataset.adminView === view));
  adminViews.forEach((section) => {
    section.hidden = section.id !== `${view}View`;
    section.classList.toggle("active", section.id === `${view}View`);
  });
  loadCurrentView();
}

function applyRoleAccess() {
  const user = getStoredUser();
  const access = getAccess();

  adminNavLinks.forEach((link) => {
    const view = link.dataset.adminView;
    link.hidden = !access.views.includes(view);
  });

  if (!access.views.includes(currentView)) {
    currentView = access.views[0] || "orders";
  }

  if (roleBanner) {
    roleBanner.innerHTML = `<span class="status-pill ${user.role}">${user.role}</span> <strong>${user.fullName}</strong> - ${access.description}`;
  }

  if (projectForm) {
    projectForm.querySelectorAll("input, select, textarea, button").forEach((field) => {
      if (field.id === "resetProjectForm") return;
      field.disabled = !access.canEditProjects;
    });
  }

  if (projectUpdateForm) {
    projectUpdateForm.querySelectorAll("input, select, textarea, button").forEach((field) => {
      field.disabled = !access.canCreateProjectUpdates;
    });
  }

  if (settingsForm) {
    settingsForm.querySelectorAll("input, select, textarea, button").forEach((field) => {
      field.disabled = !access.canEditSettings;
    });
  }
}

function loadCurrentView() {
  if (!getToken()) return;

  if (currentView === "orders") fetchOrders();
  if (currentView === "projects") fetchProjects();
  if (currentView === "customers") fetchCustomers();
  if (currentView === "analytics") fetchAnalytics();
  if (currentView === "settings") fetchSettings();
  if (currentView === "audit") fetchAuditLogs();
}

async function login(event) {
  event.preventDefault();

  const formData = new FormData(loginForm);
  loginStatus.textContent = "Đang đăng nhập...";
  loginStatus.dataset.state = "";

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể đăng nhập");
    }

    if (!roleAccess[data.user.role]) {
      throw new Error("Tài khoản này chưa có quyền vào trang vận hành");
    }

    loginStatus.textContent = "Đăng nhập thành công.";
    loginStatus.dataset.state = "success";
    setSession(data.user, data.token);
    loginForm.reset();
  } catch (error) {
    loginStatus.textContent = error.message;
    loginStatus.dataset.state = "error";
  }
}

async function fetchOrders() {
  const token = getToken();
  const status = statusFilter.value;
  const search = searchInput.value.trim();
  const params = new URLSearchParams();

  if (status) params.set("status", status);
  if (search) params.set("search", search);

  if (!token) return;

  refreshButton.disabled = true;
  refreshButton.textContent = "Đang tải...";

  try {
    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${API_BASE_URL}/checkout/admin/orders${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.status === 401 || response.status === 403) {
      clearSession();
      throw new Error("Phiên đăng nhập hết hạn hoặc không có quyền admin");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải đơn đầu tư");
    }

    orders = data.orders || [];
    selectedOrderCode = orders.some((order) => order.orderCode === selectedOrderCode)
      ? selectedOrderCode
      : orders[0]?.orderCode || "";
    renderOrders();
  } catch (error) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="7">
          <strong>Không thể tải dữ liệu</strong>
          <span>${error.message}</span>
        </td>
      </tr>
    `;
    emptyState.hidden = true;
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "Tải lại đơn";
  }
}

function renderOrders() {
  const totalAmount = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);
  const contacting = orders.filter((order) => order.status === "contacting").length;
  const awaitingPayment = orders.filter((order) => order.status === "awaiting_payment").length;

  metricTotal.textContent = orders.length;
  metricRevenue.textContent = currency.format(totalAmount);
  metricContacting.textContent = contacting;
  metricPayment.textContent = awaitingPayment;

  emptyState.hidden = orders.length > 0;

  ordersTableBody.innerHTML = orders
    .map((order) => {
      const isActive = order.orderCode === selectedOrderCode;
      const customer = order.customerSnapshot || order.customerId || {};
      const project = order.projectSnapshot || order.projectId || {};
      const packageInfo = order.packageSnapshot || {};

      return `
        <tr class="${isActive ? "active" : ""}" data-order-code="${order.orderCode}">
          <td>
            <strong>${order.orderCode}</strong>
            <span>${order.payment?.status || "pending"}</span>
          </td>
          <td>
            <strong>${customer.fullName || "Chưa có tên"}</strong>
            <span>${customer.phone || ""}</span>
          </td>
          <td>
            <strong>${project.name || "Dự án"}</strong>
            <span>${project.category || ""}</span>
          </td>
          <td>
            <strong>${packageInfo.label || "Gói đầu tư"}</strong>
            <span>${deliveryLabels[order.delivery?.method] || "Chưa chọn"}</span>
          </td>
          <td><strong>${currency.format(order.amount || 0)}</strong></td>
          <td><span class="status-pill ${order.status}">${statusLabels[order.status] || order.status}</span></td>
          <td><strong>${formatDate(order.createdAt)}</strong></td>
        </tr>
      `;
    })
    .join("");

  renderOrderDetail(orders.find((order) => order.orderCode === selectedOrderCode));
}

async function fetchProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects?limit=100`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải dự án");
    }

    projects = data.projects || [];
    renderProjectsAdmin();
    renderProjectUpdateOptions();
  } catch (error) {
    projectsTableBody.innerHTML = `
      <tr><td colspan="5"><strong>Không thể tải dự án</strong><span>${error.message}</span></td></tr>
    `;
  }
}

function renderProjectUpdateOptions() {
  if (!projectUpdateForm) return;
  const select = projectUpdateForm.elements.projectId;
  select.innerHTML = projects
    .map((project) => `<option value="${project._id}">${project.name}</option>`)
    .join("");
}

function renderProjectsAdmin() {
  projectsTableBody.innerHTML = projects
    .map(
      (project) => `
        <tr data-project-id="${project._id}">
          <td>
            <strong>${project.name}</strong>
            <span>${project.location?.district || ""}, ${project.location?.province || ""}</span>
          </td>
          <td><strong>${project.category}</strong></td>
          <td>
            <strong>${currency.format(project.capitalRequired || 0)}</strong>
            <span>Đã gọi: ${currency.format(project.funded || 0)}</span>
          </td>
          <td><span class="status-pill ${project.status}">${project.status}</span></td>
          <td>${
            getAccess().canEditProjects
              ? `<button class="ghost-button" type="button" data-edit-project="${project._id}">Sửa</button>`
              : "Chỉ xem"
          }</td>
        </tr>
      `,
    )
    .join("");
}

function buildDefaultPackages(category) {
  const rewards = {
    "Bưởi da xanh": ["20-25kg bưởi da xanh loại 1", "45-55kg bưởi da xanh loại 1", "120-140kg bưởi da xanh loại 1"],
    Gạo: ["60-70kg gạo sạch", "130-150kg gạo sạch", "350-400kg gạo sạch"],
    "Mật ong dú": ["8-10 hũ mật ong dú", "18-22 hũ mật ong dú", "50-60 hũ mật ong dú"],
    "Sữa chua": ["80-100 hũ sữa chua", "180-220 hũ sữa chua", "500-560 hũ sữa chua"],
  }[category] || ["Sản phẩm theo mùa vụ", "Sản phẩm ưu tiên", "Sản phẩm premium"];

  return [
    { key: "goi-1", label: "Gói 1", amount: 10000000, rewardDescription: rewards[0], deliveryForms: ["home_delivery", "farm_pickup"] },
    { key: "goi-2", label: "Gói 2", amount: 20000000, rewardDescription: rewards[1], deliveryForms: ["home_delivery", "farm_pickup"] },
    { key: "goi-3", label: "Gói 3", amount: 50000000, rewardDescription: rewards[2], deliveryForms: ["home_delivery", "farm_pickup"] },
    { key: "custom", label: "Khác", amount: 0, isCustom: true, rewardDescription: "Sản phẩm được quy đổi theo giá trị đầu tư thực tế", deliveryForms: ["home_delivery", "farm_pickup"] },
  ];
}

async function saveProject(event) {
  event.preventDefault();

  if (!getAccess().canEditProjects) {
    projectStatus.textContent = "Vai trò hiện tại không có quyền lưu dự án.";
    projectStatus.dataset.state = "error";
    return;
  }

  const token = getToken();
  const formData = new FormData(projectForm);
  const projectId = formData.get("projectId");
  const category = formData.get("category");
  const capitalRequired = Number(formData.get("capitalRequired") || 0);
  const funded = Number(formData.get("funded") || 0);
  const imageFile = formData.get("imageFile");
  let image = String(formData.get("image") || "").trim();
  const payload = {
    name: formData.get("name"),
    category,
    location: {
      province: formData.get("province"),
      district: formData.get("district"),
    },
    capitalRequired,
    funded,
    fundingPercentage: capitalRequired ? Math.min(100, Math.round((funded / capitalRequired) * 100)) : 0,
    duration: formData.get("duration"),
    expectedReturnRate: formData.get("expectedReturnRate"),
    riskLevel: formData.get("riskLevel"),
    status: formData.get("status"),
    images: image ? [image] : [],
    producer: formData.get("producer"),
    logo: formData.get("logo"),
    facebookUrl: formData.get("facebookUrl"),
    productIntro: formData.get("productIntro"),
    qualityNotes: formData.get("qualityNotes"),
    specs: {
      packaging: formData.get("packaging"),
      referencePrice: formData.get("referencePrice"),
      shelfLife: formData.get("shelfLife"),
      storage: formData.get("storage"),
      deliveryPlan: formData.get("deliveryPlan"),
      returnPolicy: formData.get("returnPolicy"),
    },
    highlights: String(formData.get("highlights") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    farmerStory: formData.get("farmerStory"),
    riskDisclosure: formData.get("riskDisclosure"),
    investmentPackages: buildDefaultPackages(category),
    sales: {
      allowCustomAmount: true,
      hotline: "",
    },
  };

  projectStatus.textContent = "Đang lưu dự án...";
  projectStatus.dataset.state = "";

  try {
    if (imageFile?.size) {
      image = await uploadFile(imageFile, "projects");
      payload.images = [image];
    }

    const response = await fetch(`${API_BASE_URL}/projects${projectId ? `/${projectId}` : ""}`, {
      method: projectId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể lưu dự án");
    }

    projectStatus.textContent = "Đã lưu dự án.";
    projectStatus.dataset.state = "success";
    projectForm.reset();
    projectForm.elements.projectId.value = "";
    await fetchProjects();
  } catch (error) {
    projectStatus.textContent = error.message;
    projectStatus.dataset.state = "error";
  }
}

function editProject(projectId) {
  if (!getAccess().canEditProjects) return;
  const project = projects.find((item) => item._id === projectId);
  if (!project) return;

  projectForm.elements.projectId.value = project._id;
  projectForm.elements.name.value = project.name || "";
  projectForm.elements.category.value = project.category || "Bưởi da xanh";
  projectForm.elements.province.value = project.location?.province || "";
  projectForm.elements.district.value = project.location?.district || "";
  projectForm.elements.capitalRequired.value = project.capitalRequired || 0;
  projectForm.elements.funded.value = project.funded || 0;
  projectForm.elements.duration.value = project.duration || "";
  projectForm.elements.expectedReturnRate.value = project.expectedReturnRate || "";
  projectForm.elements.riskLevel.value = project.riskLevel || "Thấp";
  projectForm.elements.status.value = project.status || "drafting";
  projectForm.elements.image.value = project.images?.[0] || "";
  projectForm.elements.producer.value = project.producer || "";
  projectForm.elements.logo.value = project.logo || "";
  projectForm.elements.facebookUrl.value = project.facebookUrl || "";
  projectForm.elements.productIntro.value = project.productIntro || "";
  projectForm.elements.qualityNotes.value = project.qualityNotes || "";
  projectForm.elements.packaging.value = project.specs?.packaging || "";
  projectForm.elements.referencePrice.value = project.specs?.referencePrice || "";
  projectForm.elements.shelfLife.value = project.specs?.shelfLife || "";
  projectForm.elements.storage.value = project.specs?.storage || "";
  projectForm.elements.deliveryPlan.value = project.specs?.deliveryPlan || "";
  projectForm.elements.returnPolicy.value = project.specs?.returnPolicy || "";
  projectForm.elements.highlights.value = (project.highlights || []).join(", ");
  projectForm.elements.tags.value = (project.tags || []).join(", ");
  projectForm.elements.shortDescription.value = project.shortDescription || "";
  projectForm.elements.description.value = project.description || "";
  projectForm.elements.farmerStory.value = project.farmerStory || "";
  projectForm.elements.riskDisclosure.value = project.riskDisclosure || "";
  projectStatus.textContent = `Đang sửa: ${project.name}`;
  projectStatus.dataset.state = "";
}

async function fetchCustomers() {
  const search = customerSearchInput.value.trim();
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  try {
    const response = await fetch(`${API_BASE_URL}/checkout/admin/customers?${params.toString()}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải khách hàng");
    }

    customers = data.customers || [];
    renderCustomers();
  } catch (error) {
    customersTableBody.innerHTML = `
      <tr><td colspan="5"><strong>Không thể tải khách hàng</strong><span>${error.message}</span></td></tr>
    `;
  }
}

function renderCustomers() {
  customersTableBody.innerHTML = customers
    .map(
      (customer) => `
        <tr>
          <td><strong>${customer.fullName}</strong><span>${customer.source || "website"}</span></td>
          <td><strong>${customer.phone}</strong><span>${customer.email || ""}</span></td>
          <td><strong>${customer.stats?.orderCount || 0}</strong></td>
          <td><strong>${currency.format(customer.stats?.totalAmount || 0)}</strong></td>
          <td><span class="status-pill ${customer.status}">${customer.status}</span></td>
        </tr>
      `,
    )
    .join("");
}

async function fetchAnalytics() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/sales`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải analytics");
    }

    const eventCards = (data.events || []).map((item) => ({
      label: item._id,
      value: item.count,
    }));
    const orderCards = (data.orderStats || []).map((item) => ({
      label: statusLabels[item._id] || item._id,
      value: `${item.count} đơn - ${currency.format(item.amount || 0)}`,
    }));
    analyticsGrid.innerHTML = [...eventCards, ...orderCards]
      .map(
        (item) => `
          <article>
            <span>${item.label}</span>
            <strong>${item.value}</strong>
          </article>
        `,
      )
      .join("");
  } catch (error) {
    analyticsGrid.innerHTML = `
      <article><span>Lỗi</span><strong>${error.message}</strong></article>
    `;
  }
}

async function fetchSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/admin`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải cấu hình");
    }

    const settings = data.settings || {};
    settingsForm.elements.bankName.value = settings.payment?.bankName || "";
    settingsForm.elements.bankCode.value = settings.payment?.bankCode || "";
    settingsForm.elements.accountNumber.value = settings.payment?.accountNumber || "";
    settingsForm.elements.accountName.value = settings.payment?.accountName || "";
    settingsForm.elements.hotline.value = settings.marketing?.hotline || "";
    settingsForm.elements.zaloUrl.value = settings.marketing?.zaloUrl || "";
    settingsForm.elements.googleAnalyticsId.value = settings.marketing?.googleAnalyticsId || "";
    settingsForm.elements.metaPixelId.value = settings.marketing?.metaPixelId || "";
    settingsForm.elements.supportEmail.value = settings.operations?.supportEmail || "";
    settingsForm.elements.businessAddress.value = settings.operations?.businessAddress || "";
    settingsForm.elements.ecommerceNoticeStatus.value = settings.legal?.ecommerceNoticeStatus || "preparing";
  } catch (error) {
    settingsStatus.textContent = error.message;
    settingsStatus.dataset.state = "error";
  }
}

async function saveProjectUpdate(event) {
  event.preventDefault();

  if (!getAccess().canCreateProjectUpdates) {
    projectUpdateStatus.textContent = "Vai trò hiện tại không có quyền lưu nhật ký mùa vụ.";
    projectUpdateStatus.dataset.state = "error";
    return;
  }

  const formData = new FormData(projectUpdateForm);
  const projectId = formData.get("projectId");

  if (!projectId) {
    projectUpdateStatus.textContent = "Vui lòng chọn dự án.";
    projectUpdateStatus.dataset.state = "error";
    return;
  }

  projectUpdateStatus.textContent = "Đang lưu nhật ký mùa vụ...";
  projectUpdateStatus.dataset.state = "";

  try {
    const uploadedImage = await uploadFile(formData.get("updateImageFile"), "project-updates");
    const payload = {
      type: formData.get("type"),
      title: formData.get("title"),
      description: formData.get("description"),
      orderCode: String(formData.get("orderCode") || "").trim().toUpperCase(),
      farmUnitCode: String(formData.get("farmUnitCode") || "").trim().toUpperCase(),
      images: uploadedImage ? [uploadedImage] : [],
      metrics: {
        growthStage: formData.get("growthStage"),
        temperatureAvg: formData.get("temperatureAvg") ? Number(formData.get("temperatureAvg")) : undefined,
        rainfall: formData.get("rainfall") ? Number(formData.get("rainfall")) : undefined,
        pestCondition: formData.get("pestCondition"),
        estimatedYield: formData.get("estimatedYield") ? Number(formData.get("estimatedYield")) : undefined,
      },
    };

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/updates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể lưu nhật ký mùa vụ");
    }

    projectUpdateStatus.textContent = "Đã lưu nhật ký mùa vụ.";
    projectUpdateStatus.dataset.state = "success";
    projectUpdateForm.reset();
    renderProjectUpdateOptions();
  } catch (error) {
    projectUpdateStatus.textContent = error.message;
    projectUpdateStatus.dataset.state = "error";
  }
}

async function fetchAuditLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/audit/logs?limit=80`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải nhật ký hệ thống");
    }

    auditLogs = data.logs || [];
    renderAuditLogs();
  } catch (error) {
    auditTableBody.innerHTML = `
      <tr><td colspan="5"><strong>Không thể tải audit log</strong><span>${error.message}</span></td></tr>
    `;
  }
}

function renderAuditLogs() {
  auditTableBody.innerHTML = auditLogs.length
    ? auditLogs
        .map((log) => {
          const actor = log.actorSnapshot || log.actorId || {};
          return `
            <tr>
              <td><strong>${formatDate(log.createdAt)}</strong></td>
              <td><strong>${actor.fullName || "Hệ thống/khách"}</strong><span>${actor.role || actor.email || ""}</span></td>
              <td><span class="status-pill">${log.action}</span></td>
              <td><strong>${log.entityType}</strong><span>${log.entityId || ""}</span></td>
              <td><span>${log.metadata ? JSON.stringify(log.metadata) : ""}</span></td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="5"><strong>Chưa có nhật ký</strong><span>Các thay đổi mới sẽ xuất hiện tại đây.</span></td></tr>`;
}

async function changePassword(event) {
  event.preventDefault();

  const formData = new FormData(passwordForm);
  passwordStatus.textContent = "Đang đổi mật khẩu...";
  passwordStatus.dataset.state = "";

  try {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể đổi mật khẩu");
    }

    passwordStatus.textContent = "Đã đổi mật khẩu. Hãy dùng mật khẩu mới ở lần đăng nhập sau.";
    passwordStatus.dataset.state = "success";
    passwordForm.reset();
  } catch (error) {
    passwordStatus.textContent = error.message;
    passwordStatus.dataset.state = "error";
  }
}

async function saveSettings(event) {
  event.preventDefault();
  if (!getAccess().canEditSettings) {
    settingsStatus.textContent = "Vai trò hiện tại chỉ được xem cấu hình, không được chỉnh sửa.";
    settingsStatus.dataset.state = "error";
    return;
  }

  const formData = new FormData(settingsForm);

  settingsStatus.textContent = "Đang lưu cấu hình...";
  settingsStatus.dataset.state = "";

  try {
    const response = await fetch(`${API_BASE_URL}/settings/admin`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        payment: {
          bankName: formData.get("bankName"),
          bankCode: formData.get("bankCode"),
          accountNumber: formData.get("accountNumber"),
          accountName: formData.get("accountName"),
          transferPrefix: "AGS",
          vietQrEnabled: true,
        },
        marketing: {
          hotline: formData.get("hotline"),
          zaloUrl: formData.get("zaloUrl"),
          googleAnalyticsId: formData.get("googleAnalyticsId"),
          metaPixelId: formData.get("metaPixelId"),
        },
        legal: {
          ecommerceNoticeStatus: formData.get("ecommerceNoticeStatus"),
        },
        operations: {
          supportEmail: formData.get("supportEmail"),
          businessAddress: formData.get("businessAddress"),
        },
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể lưu cấu hình");
    }

    settingsStatus.textContent = "Đã lưu cấu hình.";
    settingsStatus.dataset.state = "success";
  } catch (error) {
    settingsStatus.textContent = error.message;
    settingsStatus.dataset.state = "error";
  }
}

function renderOrderDetail(order) {
  if (!order) {
    orderDetail.innerHTML = `
      <p class="eyebrow">Chi tiết đơn</p>
      <h2>Chọn một đơn để xem</h2>
      <p>Thông tin khách hàng, gói đầu tư, giao hàng và timeline xử lý sẽ hiển thị ở đây.</p>
    `;
    return;
  }

  const customer = order.customerSnapshot || order.customerId || {};
  const project = order.projectSnapshot || order.projectId || {};
  const packageInfo = order.packageSnapshot || {};

  orderDetail.innerHTML = `
    <p class="eyebrow">Chi tiết đơn</p>
    <h2>${order.orderCode}</h2>
    <span class="status-pill ${order.status}">${statusLabels[order.status] || order.status}</span>

    <div class="detail-block">
      <h3>Khách hàng</h3>
      <ul class="detail-list">
        <li><span>Họ tên</span><strong>${customer.fullName || "Chưa có"}</strong></li>
        <li><span>Điện thoại</span><strong>${customer.phone || "Chưa có"}</strong></li>
        <li><span>Email</span><strong>${customer.email || "Chưa có"}</strong></li>
        <li><span>Địa chỉ</span><strong>${customer.address || order.delivery?.address || "Chưa có"}</strong></li>
      </ul>
    </div>

    <div class="detail-block">
      <h3>Đầu tư</h3>
      <ul class="detail-list">
        <li><span>Dự án</span><strong>${project.name || "Chưa có"}</strong></li>
        <li><span>Danh mục</span><strong>${project.category || "Chưa có"}</strong></li>
        <li><span>Gói</span><strong>${packageInfo.label || "Gói đầu tư"}</strong></li>
        <li><span>Số tiền</span><strong>${currency.format(order.amount || 0)}</strong></li>
        <li><span>Quyền lợi</span><strong>${packageInfo.rewardDescription || "Theo gói đầu tư đã xác nhận"}</strong></li>
      </ul>
    </div>

    <div class="detail-block">
      <h3>Giao nhận và thanh toán</h3>
      <ul class="detail-list">
        <li><span>Nhận hàng</span><strong>${deliveryLabels[order.delivery?.method] || "Chưa chọn"}</strong></li>
        <li><span>Trạng thái giao</span><strong>${order.delivery?.status || "not_scheduled"}</strong></li>
        <li><span>Đơn vị giao</span><strong>${order.delivery?.provider || "Chưa có"}</strong></li>
        <li><span>Mã vận đơn</span><strong>${order.delivery?.trackingNumber || "Chưa có"}</strong></li>
        <li><span>Ngày hẹn</span><strong>${formatDate(order.delivery?.preferredDate)}</strong></li>
        <li><span>Số người</span><strong>${order.delivery?.participants || 1}</strong></li>
        <li><span>Thanh toán</span><strong>${paymentLabels[order.payment?.method] || "Chưa chọn"}</strong></li>
        <li><span>Biên lai</span><strong>${order.payment?.receiptUrl ? `<a href="${order.payment.receiptUrl}" target="_blank" rel="noreferrer">Xem biên lai</a>` : "Chưa có"}</strong></li>
        <li><span>Biên nhận</span><strong><a href="${API_BASE_URL}/checkout/orders/${encodeURIComponent(order.orderCode)}/receipt" target="_blank" rel="noreferrer">In/Lưu PDF</a></strong></li>
        <li><span>Ghi chú</span><strong>${order.delivery?.note || order.internalNote || "Không có"}</strong></li>
      </ul>
    </div>

    <div class="detail-block">
      <h3>Timeline xử lý</h3>
      <ul class="timeline-list">
        ${(order.timeline || [])
          .map(
            (item) => `
              <li class="${item.status}">
                <strong>${item.title}</strong>
                <span>${item.description || ""}</span>
              </li>
            `,
          )
          .join("")}
      </ul>
    </div>

    ${getAccess().canEditOrders ? `<form class="order-action-form" data-order-id="${order._id}">
      <h3>Xử lý đơn</h3>
      <label>
        Trạng thái đơn
        <select name="status">
          ${Object.entries(statusLabels)
            .map(
              ([value, label]) =>
                `<option value="${value}" ${order.status === value ? "selected" : ""}>${label}</option>`,
            )
            .join("")}
        </select>
      </label>
      <label>
        Trạng thái thanh toán
        <select name="paymentStatus">
          <option value="pending" ${order.payment?.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="awaiting_payment" ${order.payment?.status === "awaiting_payment" ? "selected" : ""}>Chờ thanh toán</option>
          <option value="paid" ${order.payment?.status === "paid" ? "selected" : ""}>Đã thanh toán</option>
          <option value="refunded" ${order.payment?.status === "refunded" ? "selected" : ""}>Đã hoàn tiền</option>
          <option value="failed" ${order.payment?.status === "failed" ? "selected" : ""}>Thanh toán lỗi</option>
        </select>
      </label>
      <label>
        Mã giao dịch/biên nhận
        <input name="paymentReference" type="text" value="${order.payment?.reference || ""}" placeholder="VD: VCB-AGS..." />
      </label>
      <label>
        Link biên lai
        <input name="receiptUrl" type="url" value="${order.payment?.receiptUrl || ""}" placeholder="Link ảnh biên lai hoặc chứng từ" />
      </label>
      <label>
        Upload biên lai/chứng từ
        <input name="receiptFile" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" />
      </label>
      <label>
        Trạng thái giao hàng/farm
        <select name="deliveryStatus">
          ${["not_scheduled", "scheduled", "packing", "shipping", "delivered", "failed", "farm_visit_booked", "checked_in"]
            .map((value) => `<option value="${value}" ${order.delivery?.status === value ? "selected" : ""}>${value}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        Đơn vị vận chuyển
        <input name="deliveryProvider" type="text" value="${order.delivery?.provider || ""}" placeholder="VD: GHTK, Viettel Post, tự giao" />
      </label>
      <label>
        Mã vận đơn
        <input name="trackingNumber" type="text" value="${order.delivery?.trackingNumber || ""}" />
      </label>
      <label>
        Lịch giao/đến farm
        <input name="scheduledAt" type="datetime-local" />
      </label>
      <label>
        Ghi chú nội bộ
        <textarea name="internalNote" rows="3" placeholder="Thông tin tư vấn, lịch gọi lại, yêu cầu đặc biệt...">${order.internalNote || ""}</textarea>
      </label>
      <button class="primary-button" type="submit">Lưu cập nhật đơn</button>
      <p class="action-status" role="status"></p>
    </form>` : `<div class="detail-block"><h3>Quyền thao tác</h3><p>Bạn chỉ có quyền xem đơn, không thể cập nhật trạng thái.</p></div>`}
  `;
}

async function updateSelectedOrder(event) {
  event.preventDefault();

  const form = event.target.closest(".order-action-form");
  const token = getToken();
  const status = form.querySelector(".action-status");
  const formData = new FormData(form);

  status.textContent = "Đang lưu cập nhật...";
  status.dataset.state = "";

  try {
    const uploadedReceipt = await uploadFile(formData.get("receiptFile"), "receipts");
    const response = await fetch(`${API_BASE_URL}/checkout/admin/orders/${form.dataset.orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: formData.get("status"),
        paymentStatus: formData.get("paymentStatus"),
        paymentReference: formData.get("paymentReference"),
        receiptUrl: uploadedReceipt || formData.get("receiptUrl"),
        internalNote: formData.get("internalNote"),
        deliveryStatus: formData.get("deliveryStatus"),
        deliveryProvider: formData.get("deliveryProvider"),
        trackingNumber: formData.get("trackingNumber"),
        scheduledAt: formData.get("scheduledAt"),
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể cập nhật đơn");
    }

    status.textContent = "Đã cập nhật đơn.";
    status.dataset.state = "success";
    await fetchOrders();
  } catch (error) {
    status.textContent = error.message;
    status.dataset.state = "error";
  }
}

function exportOrders() {
  if (!orders.length) return;

  const rows = [
    ["Ma don", "Khach hang", "So dien thoai", "Du an", "Goi", "Gia tri", "Trang thai", "Thanh toan", "Ngay tao"],
    ...orders.map((order) => {
      const customer = order.customerSnapshot || {};
      const project = order.projectSnapshot || {};
      const packageInfo = order.packageSnapshot || {};

      return [
        order.orderCode,
        customer.fullName || "",
        customer.phone || "",
        project.name || "",
        packageInfo.label || "",
        order.amount || 0,
        statusLabels[order.status] || order.status,
        order.payment?.status || "",
        formatDate(order.createdAt),
      ];
    }),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `agrishare-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatDate(value) {
  if (!value) return "Chưa có";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa có";
  return dateFormatter.format(date);
}

loginForm.addEventListener("submit", login);
logoutButton.addEventListener("click", clearSession);
adminNavLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    switchView(link.dataset.adminView);
  });
});
statusFilter.addEventListener("change", fetchOrders);
searchInput.addEventListener("input", () => {
  window.clearTimeout(searchInput._timer);
  searchInput._timer = window.setTimeout(fetchOrders, 350);
});
refreshButton.addEventListener("click", fetchOrders);
exportButton.addEventListener("click", exportOrders);
projectForm.addEventListener("submit", saveProject);
projectUpdateForm.addEventListener("submit", saveProjectUpdate);
resetProjectFormButton.addEventListener("click", () => {
  projectForm.reset();
  projectForm.elements.projectId.value = "";
  projectStatus.textContent = "";
});
projectsTableBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-edit-project]");
  if (button) editProject(button.dataset.editProject);
});
refreshCustomersButton.addEventListener("click", fetchCustomers);
customerSearchInput.addEventListener("input", () => {
  window.clearTimeout(customerSearchInput._timer);
  customerSearchInput._timer = window.setTimeout(fetchCustomers, 350);
});
refreshAnalyticsButton.addEventListener("click", fetchAnalytics);
refreshAuditButton.addEventListener("click", fetchAuditLogs);
settingsForm.addEventListener("submit", saveSettings);
passwordForm.addEventListener("submit", changePassword);

ordersTableBody.addEventListener("click", (event) => {
  const row = event.target.closest("[data-order-code]");
  if (!row) return;

  selectedOrderCode = row.dataset.orderCode;
  renderOrders();
});

orderDetail.addEventListener("submit", updateSelectedOrder);

renderSession();
