const API_BASE_URL = window.AGRISHARE_CONFIG?.API_BASE_URL || "http://localhost:5000/api/v1";
const detailRoot = document.querySelector("#projectDetail");

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

async function loadProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    detailRoot.innerHTML = `<article class="detail-card"><h1>Thiếu mã dự án</h1><p>Vui lòng quay lại Marketplace để chọn dự án.</p></article>`;
    return;
  }

  try {
    const [projectResponse, updatesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/projects/${encodeURIComponent(id)}`),
      fetch(`${API_BASE_URL}/projects/${encodeURIComponent(id)}/updates`),
    ]);
    const projectData = await projectResponse.json();
    const updatesData = await updatesResponse.json();

    if (!projectResponse.ok || !projectData.success) {
      throw new Error(projectData.message || "Không thể tải dự án");
    }

    renderProject(projectData.project, updatesData.updates || []);
    trackEvent("project_detail_view", { projectId: projectData.project._id });
  } catch (error) {
    detailRoot.innerHTML = `<article class="detail-card"><h1>Không thể tải dự án</h1><p>${error.message}</p></article>`;
  }
}

function renderProject(project, updates) {
  const image = project.images?.[0] || "assets/agrishare-concept-01.jpg";
  const location = [project.location?.district, project.location?.province].filter(Boolean).join(", ");

  detailRoot.innerHTML = `
    <section class="detail-hero">
      <div class="detail-hero-media">
        <img src="${image}" alt="${project.name}" />
      </div>
      <article class="detail-card detail-hero-card">
        <p class="eyebrow">${project.category} tại ${location}</p>
        <h1>${project.name}</h1>
        <p>${project.shortDescription || project.description}</p>
        <p><strong>${project.producer || project.name}</strong></p>
        <div class="summary-grid">
          <div><span>Vốn cần gọi</span><strong>${currency.format(project.capitalRequired || 0)}</strong></div>
          <div><span>Đã gọi</span><strong>${project.fundingPercentage || 0}%</strong></div>
          <div><span>Thời gian</span><strong>${project.duration || "Theo hồ sơ dự án"}</strong></div>
          <div><span>Lợi nhuận dự kiến</span><strong>${project.expectedReturnRate || "Theo hồ sơ dự án"}</strong></div>
        </div>
        <div class="detail-actions">
          <a class="primary-button" href="index.html#projects">Lựa chọn gói đầu tư</a>
          ${project.facebookUrl ? `<a class="secondary-button" href="${project.facebookUrl}" target="_blank" rel="noreferrer">Xem Facebook nhà sản xuất</a>` : ""}
        </div>
      </article>
    </section>

    <section class="detail-grid">
      <article class="detail-card">
        <h2>Câu chuyện farm</h2>
        <p>${project.farmerStory || "AgriShare đang cập nhật thêm hồ sơ farm và năng lực sản xuất."}</p>
      </article>
      <article class="detail-card">
        <h2>Cảnh báo rủi ro</h2>
        <p>${project.riskDisclosure || "Nông nghiệp có rủi ro về thời tiết, sâu bệnh, sản lượng và logistics. AgriShare theo dõi bằng nhật ký và QA/QC."}</p>
      </article>
      <article class="detail-card">
        <h2>Kiểm soát chất lượng</h2>
        <p>${project.qualityNotes || "Hồ sơ dự án ưu tiên nhật ký mùa vụ, phân loại sản phẩm, truy xuất lô và cập nhật bằng chứng hình ảnh."}</p>
        <ul class="quality-list">
          ${(project.highlights || []).map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
      <article class="detail-card">
        <h2>Quy cách bán hàng</h2>
        <ul class="quality-list">
          <li><strong>Đóng gói:</strong> ${project.specs?.packaging || "Cập nhật theo từng lô."}</li>
          <li><strong>Giá tham chiếu:</strong> ${project.specs?.referencePrice || "Xác nhận theo mùa vụ."}</li>
          <li><strong>Hạn dùng:</strong> ${project.specs?.shelfLife || "Theo bao bì hoặc xác nhận đơn."}</li>
          <li><strong>Bảo quản:</strong> ${project.specs?.storage || "Theo hướng dẫn của từng sản phẩm."}</li>
          <li><strong>Giao nhận:</strong> ${project.specs?.deliveryPlan || "Theo lịch đã xác nhận với khách hàng."}</li>
          <li><strong>Đổi/bù:</strong> ${project.specs?.returnPolicy || "Xử lý khi sản phẩm sai quy cách hoặc hư hỏng do giao nhận."}</li>
        </ul>
      </article>
    </section>

    <section class="detail-two-column">
      <article class="detail-card">
        <h2>Gói đầu tư và quyền lợi</h2>
        <ul class="package-list">
          ${(project.investmentPackages || [])
            .map(
              (item) => `
                <li>
                  <strong>${item.label || item.key}</strong>
                  <span>${item.isCustom ? "Tùy chọn đầu tư" : currency.format(item.amount || 0)}</span>
                  <p>${item.rewardDescription || item.description || "Quyền lợi được xác nhận khi tư vấn."}</p>
                </li>
              `,
            )
            .join("")}
        </ul>
      </article>

      <article class="detail-card">
        <h2>Nhật ký mùa vụ</h2>
        <ul class="update-list">
          ${
            updates.length
              ? updates
                  .map(
                    (item) => `
                      <li>
                        <strong>${item.title}</strong>
                        <span>${item.type}</span>
                        <p>${item.description || ""}</p>
                      </li>
                    `,
                  )
                  .join("")
              : "<li>Chưa có nhật ký mới. Admin/Farm sẽ cập nhật trong quá trình vận hành.</li>"
          }
        </ul>
      </article>
    </section>
  `;
}

function getSessionId() {
  const key = "agrishare_session_id";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

function trackEvent(type, metadata = {}) {
  fetch(`${API_BASE_URL}/analytics/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      page: "project-detail.html",
      metadata,
      sessionId: getSessionId(),
    }),
  }).catch(() => {});
}

loadProjectDetail();
