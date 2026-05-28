const API_BASE_URL = window.AGRISHARE_CONFIG?.API_BASE_URL || "http://localhost:5000/api/v1";
const API_ORIGIN = new URL(API_BASE_URL).origin;
const result = document.querySelector("#thankYouResult");
const receiptForm = document.querySelector("#receiptForm");
const receiptStatus = document.querySelector("#receiptStatus");
const params = new URLSearchParams(window.location.search);
const orderCode = params.get("code");
let publicSettings = null;

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function normalizeUploadedUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Không thể đọc file biên lai"));
    reader.readAsDataURL(file);
  });
}

async function uploadReceiptFile(file) {
  if (!file?.size) return "";

  const dataUrl = await fileToDataUrl(file);
  const response = await fetch(`${API_BASE_URL}/uploads/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataUrl,
      folder: "receipts",
      originalName: file.name,
    }),
  });
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Không thể upload biên lai");
  }

  return normalizeUploadedUrl(data.file.url);
}

async function loadOrder() {
  if (!orderCode) {
    result.innerHTML = `<h2>Thiếu mã đơn</h2><p>Vui lòng kiểm tra lại link xác nhận đơn.</p>`;
    receiptForm.hidden = true;
    return;
  }

  try {
    const [response, settingsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/checkout/orders/${encodeURIComponent(orderCode)}`),
      fetch(`${API_BASE_URL}/settings/public`),
    ]);
    const data = await response.json();
    const settingsData = await settingsResponse.json().catch(() => null);
    publicSettings = settingsData?.settings || null;

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không tìm thấy đơn đầu tư");
    }

    const order = data.order;
    const payment = publicSettings?.payment || {};
    const qrUrl =
      payment.vietQrEnabled && payment.bankCode && payment.accountNumber
        ? `https://img.vietqr.io/image/${encodeURIComponent(payment.bankCode)}-${encodeURIComponent(payment.accountNumber)}-compact2.png?amount=${encodeURIComponent(order.amount || 0)}&addInfo=${encodeURIComponent(order.orderCode)}&accountName=${encodeURIComponent(payment.accountName || '')}`
        : "";
    result.innerHTML = `
      <p class="eyebrow">Mã đơn ${order.orderCode}</p>
      <h2>${order.projectSnapshot?.name || "Đơn đầu tư AgriShare"}</h2>
      <div class="summary-grid">
        <div><span>Khách hàng</span><strong>${order.customerSnapshot?.fullName || ""}</strong></div>
        <div><span>Số tiền</span><strong>${currency.format(order.amount || 0)}</strong></div>
        <div><span>Nội dung chuyển khoản</span><strong>${order.orderCode}</strong></div>
        <div><span>Trạng thái</span><strong>${order.status}</strong></div>
        <div><span>Ngân hàng</span><strong>${payment.bankName || "Đang cập nhật"}</strong></div>
        <div><span>Số tài khoản</span><strong>${payment.accountNumber || "Đang cập nhật"}</strong></div>
      </div>
      ${qrUrl ? `<img src="${qrUrl}" alt="QR thanh toán ${order.orderCode}" style="width:min(280px,100%);border:1px solid var(--line);border-radius:8px" />` : ""}
      <p>Vui lòng chuyển khoản đúng số tiền và ghi nội dung là mã đơn. Sau khi gửi thông tin biên lai, admin sẽ xác nhận thanh toán.</p>
      <a class="primary-button" href="track-order.html?code=${encodeURIComponent(order.orderCode)}">Tra cứu tiến độ đơn</a>
    `;
    receiptForm.elements.paymentReference.value = order.orderCode;
  } catch (error) {
    result.innerHTML = `<h2>Không thể tải đơn</h2><p>${error.message}</p>`;
  }
}

async function submitReceipt(event) {
  event.preventDefault();

  const formData = new FormData(receiptForm);
  receiptStatus.textContent = "Đang gửi thông tin thanh toán...";
  receiptStatus.dataset.state = "";

  try {
    const uploadedReceiptUrl = await uploadReceiptFile(formData.get("receiptFile"));
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${encodeURIComponent(orderCode)}/payment-proof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentReference: formData.get("paymentReference"),
        receiptUrl: uploadedReceiptUrl || formData.get("receiptUrl"),
        receiptNote: formData.get("receiptNote"),
      }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể gửi biên lai");
    }

    receiptStatus.textContent = data.message;
    receiptStatus.dataset.state = "success";
  } catch (error) {
    receiptStatus.textContent = error.message;
    receiptStatus.dataset.state = "error";
  }
}

receiptForm.addEventListener("submit", submitReceipt);
loadOrder();
