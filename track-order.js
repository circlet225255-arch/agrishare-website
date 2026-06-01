const API_BASE_URL = window.AGRISHARE_CONFIG?.API_BASE_URL || "http://localhost:5000/api/v1";

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

const paymentLabels = {
  pending: "Pending",
  awaiting_payment: "Chờ thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
  failed: "Thanh toán lỗi",
};

const deliveryLabels = {
  home_delivery: "Nhận hàng tại nhà",
  farm_pickup: "Trải nghiệm và nhận sản phẩm tại Farm",
};

const deliveryStatusLabels = {
  not_scheduled: "Chưa lên lịch",
  scheduled: "Đã lên lịch",
  packing: "Đang đóng gói",
  shipping: "Đang giao",
  delivered: "Đã nhận hàng",
  failed: "Giao thất bại",
  farm_visit_booked: "Đã đặt lịch farm",
  checked_in: "Đã check-in farm",
};

const trackingForm = document.querySelector("#trackingForm");
const trackingStatus = document.querySelector("#trackingStatus");
const trackingResult = document.querySelector("#trackingResult");

function formatDate(value) {
  if (!value) return "Chưa có";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa có";
  return dateFormatter.format(date);
}

function renderSeasonUpdates(updates = []) {
  if (!updates.length) {
    return `
      <div class="farm-update-empty">
        <strong>Chưa có nhật ký mùa vụ mới.</strong>
        <span>Admin AgriShare và nhà nông sẽ cập nhật hình ảnh, video, lịch chăm sóc và mốc thu hoạch khi có dữ liệu từ vườn.</span>
      </div>
    `;
  }

  return `
    <div class="farm-update-grid">
      ${updates
        .map(
          (update) => `
            <article class="farm-update-card">
              <div>
                <span>${formatDate(update.createdAt)}</span>
                <strong>${update.title || "Cập nhật mùa vụ"}</strong>
              </div>
              <p>${update.description || "AgriShare đang cập nhật thêm thông tin thực tế từ vườn."}</p>
              ${
                update.images?.length
                  ? `<div class="farm-update-images">
                      ${update.images
                        .slice(0, 4)
                        .map((image) => `<img src="${image}" alt="${update.title || "Nhật ký vườn"}" />`)
                        .join("")}
                    </div>`
                  : ""
              }
              <small>${[update.farmUnitCode, update.orderCode, update.createdBy?.fullName || "Admin AgriShare"].filter(Boolean).join(" - ")}</small>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

async function lookupOrder(event) {
  event.preventDefault();

  const formData = new FormData(trackingForm);
  const orderCode = String(formData.get("orderCode") || "").trim().toUpperCase();

  if (!orderCode) return;

  trackingStatus.textContent = "Đang tra cứu đơn...";
  trackingStatus.dataset.state = "";
  trackingResult.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${encodeURIComponent(orderCode)}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không tìm thấy đơn đầu tư");
    }

    renderOrder(data.order);
    trackingStatus.textContent = "Đã tìm thấy đơn đầu tư.";
    trackingStatus.dataset.state = "success";
  } catch (error) {
    trackingStatus.textContent = error.message;
    trackingStatus.dataset.state = "error";
  }
}

function renderOrder(order) {
  const customer = order.customerSnapshot || {};
  const project = order.projectSnapshot || order.projectId || {};
  const packageInfo = order.packageSnapshot || {};

  trackingResult.hidden = false;
  trackingResult.innerHTML = `
    <div>
      <p class="eyebrow">Mã đơn ${order.orderCode}</p>
      <h2>${project.name || "Đơn đầu tư AgriShare"}</h2>
      <span class="status-pill ${order.status}">${statusLabels[order.status] || order.status}</span>
    </div>

    <div class="summary-grid">
      <div>
        <span>Khách hàng</span>
        <strong>${customer.fullName || "Chưa có"} - ${customer.phone || "Chưa có"}</strong>
      </div>
      <div>
        <span>Gói đầu tư</span>
        <strong>${packageInfo.label || "Gói đầu tư"} - ${currency.format(order.amount || 0)}</strong>
      </div>
      <div>
        <span>Thanh toán</span>
        <strong>${paymentLabels[order.payment?.status] || "Chưa cập nhật"}</strong>
      </div>
      <div>
        <span>Nhận sản phẩm</span>
        <strong>${deliveryLabels[order.delivery?.method] || "Chưa chọn"}</strong>
      </div>
      <div>
        <span>Trạng thái giao hàng/farm</span>
        <strong>${deliveryStatusLabels[order.delivery?.status] || "Chưa cập nhật"}</strong>
      </div>
      <div>
        <span>Mã vận đơn</span>
        <strong>${order.delivery?.trackingNumber || "Chưa có"}</strong>
      </div>
      <div>
        <span>Ngày tạo đơn</span>
        <strong>${formatDate(order.createdAt)}</strong>
      </div>
      <div>
        <span>Ngày hẹn</span>
        <strong>${formatDate(order.delivery?.preferredDate)}</strong>
      </div>
      <div>
        <span>Biên nhận</span>
        <strong><a href="${API_BASE_URL}/checkout/orders/${encodeURIComponent(order.orderCode)}/receipt" target="_blank" rel="noreferrer">In/Lưu PDF</a></strong>
      </div>
    </div>

    <div>
      <p class="eyebrow">Quyền lợi</p>
      <p>${packageInfo.rewardDescription || "AgriShare sẽ xác nhận quyền lợi cụ thể khi tư vấn."}</p>
    </div>

    <div>
      <p class="eyebrow">Timeline xử lý</p>
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

    <div>
      <p class="eyebrow">Nhật ký vườn từ AgriShare</p>
      ${renderSeasonUpdates(order.seasonUpdates || [])}
    </div>
  `;
}

const params = new URLSearchParams(window.location.search);
const codeFromUrl = params.get("code");

if (codeFromUrl) {
  trackingForm.elements.orderCode.value = codeFromUrl;
}

trackingForm.addEventListener("submit", lookupOrder);
