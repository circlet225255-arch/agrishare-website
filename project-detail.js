const API_BASE_URL = window.AGRISHARE_CONFIG?.API_BASE_URL || "http://localhost:5000/api/v1";
const detailRoot = document.querySelector("#projectDetail");

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const detailProjects = {
  "buoi-da-xanh-song-xoai": {
    id: "buoi-da-xanh-song-xoai",
    name: "Bưởi da xanh Sông Xoài",
    category: "Bưởi da xanh",
    location: "Sông Xoài",
    image: "assets/product-buoi-song-xoai-v2.png",
    logo: "assets/logo-buoi-song-xoai.jpg",
    producer: "HTX Bưởi da xanh Sông Xoài",
    facebookUrl:
      "https://facebook.com/htxbuoidaxanhsongxoaitanthanh?mibextid=wwXIfr&rdid=FnB3W6UFXdJYiR2T&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1bZEJ69iCj%2F%3Fmibextid%3DwwXIfr",
    summary: "Đầu tư theo sản lượng bưởi thật, theo dõi một phần vườn và nhận trái theo mùa thu hoạch.",
    productIntro:
      "Bưởi da xanh tuyển chọn từ vùng Sông Xoài, phù hợp khách muốn đầu tư theo sản lượng thật và nhận trái theo mùa.",
    investmentIntro:
      "Khách chọn số kg bưởi muốn đặt. AgriShare quy đổi sản lượng đó thành phần vườn dự kiến để cập nhật nhật ký chăm sóc, hình ảnh và mốc thu hoạch.",
    farmerInfo: "HTX chuyên canh bưởi da xanh, định hướng sản xuất ổn định và bán trực tiếp đến khách hàng.",
    certificateStatus: "Ô giấy kiểm định chất lượng đang chờ cập nhật.",
    farmExperience: "Đặt đầu tư để trải nghiệm vườn bưởi, tham quan quy trình chăm sóc và nhận sản phẩm tại farm.",
    quantityOptions: [
      { label: "100kg bưởi", amount: 100, unit: "kg", seasonUnit: "khoảng 0,05 mẫu vườn theo dõi" },
      { label: "250kg bưởi", amount: 250, unit: "kg", seasonUnit: "khoảng 0,12 mẫu vườn theo dõi" },
      { label: "500kg bưởi", amount: 500, unit: "kg", seasonUnit: "khoảng 0,25 mẫu vườn theo dõi" },
    ],
    milestones: ["Ghi nhận lô vườn", "Cập nhật chăm sóc", "Báo mốc thu hoạch", "Giao bưởi hoặc hẹn farm"],
  },
  "gao-tam-a": {
    id: "gao-tam-a",
    name: "Gạo Tám Á",
    category: "Gạo",
    location: "Việt Nam",
    image: "assets/product-gao-tam-a-v2.png",
    logo: "assets/logo-gao-tam-a.jpg",
    producer: "Gạo Tám Á",
    facebookUrl: "https://www.facebook.com/profile.php?id=61565116450494",
    summary: "Đầu tư theo kg gạo, theo dõi mùa vụ lúa và nhận gạo sạch theo lịch giao đã xác nhận.",
    productIntro:
      "Gạo Tám Á phù hợp khách muốn đầu tư vào mùa vụ lúa, nhận gạo sạch theo đợt và theo dõi nguồn gốc rõ ràng.",
    investmentIntro:
      "Khách chọn số kg gạo muốn đặt. Sản lượng được quy đổi thành diện tích ruộng dự kiến để theo dõi gieo trồng, thu hoạch và đóng gói.",
    farmerInfo: "Đơn vị sản xuất gạo địa phương, tập trung nguồn gạo dùng hằng ngày và đóng gói sạch.",
    certificateStatus: "Ô giấy kiểm định chất lượng đang chờ cập nhật.",
    farmExperience: "Đặt đầu tư để trải nghiệm đồng lúa, xem quy trình canh tác và nhận gạo tại farm/điểm sản xuất.",
    quantityOptions: [
      { label: "100kg gạo", amount: 100, unit: "kg", seasonUnit: "khoảng 0,04 mẫu ruộng theo dõi" },
      { label: "300kg gạo", amount: 300, unit: "kg", seasonUnit: "khoảng 0,12 mẫu ruộng theo dõi" },
      { label: "600kg gạo", amount: 600, unit: "kg", seasonUnit: "khoảng 0,24 mẫu ruộng theo dõi" },
    ],
    milestones: ["Ghi nhận ruộng/lô", "Cập nhật gieo trồng", "Báo thu hoạch", "Xay xát và giao gạo"],
  },
  "mat-ong-du-wins-farm": {
    id: "mat-ong-du-wins-farm",
    name: "Mật ong dú Win's Farm",
    category: "Mật ong dú",
    location: "Win's Farm",
    image: "assets/product-mat-ong-du-wins-farm-v2.png",
    logo: "assets/logo-mat-ong-du-wins-farm.jpg",
    producer: "Mật ong dú Win's Farm",
    facebookUrl: "https://www.facebook.com/profile.php?id=61587362812412",
    summary: "Đầu tư theo lít mật, quy đổi số tổ ong dú và theo dõi quá trình chăm sóc, khai thác.",
    productIntro:
      "Mật ong dú Win's Farm là đặc sản sản lượng giới hạn, phù hợp khách muốn đầu tư theo tổ ong và nhận mật theo đợt khai thác.",
    investmentIntro:
      "Khách chọn số lít mật muốn đặt. AgriShare quy đổi sản lượng thành số tổ ong dú dự kiến để cập nhật chăm sóc, khai thác và đóng chai.",
    farmerInfo: "Win's Farm phát triển mô hình ong dú bản địa, khai thác theo đợt và ưu tiên chất lượng từng lô mật.",
    certificateStatus: "Ô giấy kiểm định chất lượng đang chờ cập nhật.",
    farmExperience: "Đặt đầu tư để trải nghiệm farm ong dú, tìm hiểu tổ ong và quy trình khai thác mật.",
    quantityOptions: [
      { label: "20 lít mật", amount: 20, unit: "lít", seasonUnit: "khoảng 4 tổ ong dú theo dõi" },
      { label: "50 lít mật", amount: 50, unit: "lít", seasonUnit: "khoảng 10 tổ ong dú theo dõi" },
      { label: "100 lít mật", amount: 100, unit: "lít", seasonUnit: "khoảng 20 tổ ong dú theo dõi" },
    ],
    milestones: ["Ghi nhận tổ ong", "Cập nhật chăm sóc", "Báo đợt khai thác", "Đóng chai và giao mật"],
  },
  "sua-chua-ong-nhiem": {
    id: "sua-chua-ong-nhiem",
    name: "Sữa chua Ông Nhiệm",
    category: "Sữa chua",
    location: "Ông Nhiệm",
    image: "assets/product-sua-chua-ong-nhiem-v2.png",
    logo: "assets/logo-sua-chua-ong-nhiem.jpg",
    producer: "Sữa chua Ông Nhiệm",
    facebookUrl: "https://www.facebook.com/suabotuoiongnhiem/?locale=vi_VN",
    summary: "Đầu tư theo mẻ sản xuất, nhận sữa chua tươi định kỳ hoặc trải nghiệm tại điểm sản xuất.",
    productIntro:
      "Sữa chua Ông Nhiệm phù hợp khách muốn đầu tư sản xuất theo mẻ, nhận sản phẩm tươi định kỳ cho gia đình hoặc văn phòng.",
    investmentIntro:
      "Khách chọn số thùng muốn đặt. Sản lượng được quy đổi thành mẻ sản xuất dự kiến để theo dõi nguyên liệu, quy trình lạnh và lịch giao.",
    farmerInfo: "Cơ sở sữa chua địa phương, tập trung sản phẩm tươi, giao định kỳ và kiểm soát bảo quản lạnh.",
    certificateStatus: "Ô giấy kiểm định chất lượng đang chờ cập nhật.",
    farmExperience: "Đặt đầu tư để trải nghiệm điểm sản xuất, xem quy trình làm sữa chua và nhận sản phẩm tươi.",
    quantityOptions: [
      { label: "10 thùng sữa chua", amount: 10, unit: "thùng", seasonUnit: "khoảng 2 mẻ sản xuất theo dõi" },
      { label: "25 thùng sữa chua", amount: 25, unit: "thùng", seasonUnit: "khoảng 5 mẻ sản xuất theo dõi" },
      { label: "50 thùng sữa chua", amount: 50, unit: "thùng", seasonUnit: "khoảng 10 mẻ sản xuất theo dõi" },
    ],
    milestones: ["Ghi nhận mẻ sản xuất", "Cập nhật nguyên liệu", "Báo lịch làm lạnh", "Giao định kỳ"],
  },
};

async function loadProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    detailRoot.innerHTML = `<article class="detail-card"><h1>Thiếu mã sản phẩm</h1><p>Vui lòng quay lại Marketplace để chọn sản phẩm.</p></article>`;
    return;
  }

  const fallbackProject = detailProjects[id];
  if (fallbackProject) {
    renderProject(fallbackProject);
    trackEvent("project_detail_view", { projectId: id, source: "static" });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(id)}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể tải sản phẩm");
    }

    renderProject(normalizeApiProject(data.project));
    trackEvent("project_detail_view", { projectId: data.project._id, source: "api" });
  } catch (error) {
    detailRoot.innerHTML = `<article class="detail-card"><h1>Không thể tải sản phẩm</h1><p>${error.message}</p></article>`;
  }
}

function normalizeApiProject(project) {
  const fallback = Object.values(detailProjects).find((item) => item.name === project.name || item.category === project.category);
  return {
    ...fallback,
    id: project._id || project.id || fallback?.id,
    name: project.name || fallback?.name,
    category: project.category || fallback?.category,
    image: project.images?.[0] || fallback?.image,
    producer: project.producer || fallback?.producer,
    summary: project.shortDescription || fallback?.summary,
    productIntro: project.description || fallback?.productIntro,
    farmerInfo: project.farmerStory || fallback?.farmerInfo,
    certificateStatus: project.certificateStatus || fallback?.certificateStatus,
  };
}

function renderProject(project) {
  detailRoot.innerHTML = `
    <section class="detail-hero">
      <div class="detail-hero-media">
        <img src="${project.image}" alt="${project.name}" />
        <span class="detail-logo"><img src="${project.logo}" alt="Logo ${project.producer}" /></span>
      </div>
      <article class="detail-card detail-hero-card">
        <p class="eyebrow">${project.category} tại ${project.location}</p>
        <h1>${project.name}</h1>
        <p>${project.summary}</p>
        <p>${project.productIntro}</p>
        <div class="detail-actions">
          <a class="primary-button" href="#investmentOrder">Đặt đầu tư sản phẩm này</a>
          ${project.facebookUrl ? `<a class="secondary-button" href="${project.facebookUrl}" target="_blank" rel="noreferrer">Xem kênh nhà nông</a>` : ""}
        </div>
      </article>
    </section>

    <section class="detail-grid">
      <article class="detail-card placeholder-card">
        <span>Ô cập nhật</span>
        <h2>Giấy kiểm định chất lượng</h2>
        <p>${project.certificateStatus}</p>
        <div class="empty-upload-slot">Chưa có file kiểm định</div>
      </article>
      <article class="detail-card placeholder-card">
        <span>Ô cập nhật</span>
        <h2>Thông tin nhà nông</h2>
        <p>${project.farmerInfo}</p>
        <div class="empty-upload-slot">Chưa có hồ sơ chi tiết</div>
      </article>
    </section>

    <section class="detail-two-column" id="investmentOrder">
      <article class="detail-card">
        <p class="eyebrow">Chọn số lượng muốn đặt</p>
        <h2>Sản lượng đặt mua sẽ được quy đổi thành mùa vụ theo dõi.</h2>
        <div class="quantity-grid">
          ${project.quantityOptions
            .map(
              (item, index) => `
                <button class="quantity-option ${index === 0 ? "active" : ""}" type="button" data-quantity="${item.label}" data-season="${item.seasonUnit}">
                  <strong>${item.label}</strong>
                  <span>${item.seasonUnit}</span>
                </button>
              `,
            )
            .join("")}
        </div>
        <label class="detail-input">
          Số lượng tùy chọn
          <input type="text" placeholder="VD: 150kg, 35 lít, 20 thùng..." />
        </label>
        <div class="selected-season" id="selectedSeason">
          <span>Sản lượng đang chọn</span>
          <strong>${project.quantityOptions[0].label}</strong>
          <p>${project.quantityOptions[0].seasonUnit}. Đây sẽ là cơ sở để AgriShare cập nhật tiến độ mùa vụ cho nhà đầu tư.</p>
        </div>
      </article>

      <article class="detail-card">
        <p class="eyebrow">Trải nghiệm farm</p>
        <h2>${project.farmExperience}</h2>
        <div class="farm-photo-grid">
          <div>Ảnh trải nghiệm 1</div>
          <div>Ảnh trải nghiệm 2</div>
          <div>Ảnh trải nghiệm 3</div>
        </div>
        <form class="detail-interest-form">
          <label>
            Họ tên
            <input type="text" placeholder="Nguyễn Văn A" />
          </label>
          <label>
            Số điện thoại
            <input type="tel" placeholder="090..." />
          </label>
          <label>
            Ghi chú nhu cầu
            <textarea rows="3" placeholder="Số lượng muốn đặt, nhận hàng tại nhà hay trải nghiệm farm..."></textarea>
          </label>
          <button class="primary-button" type="submit">Gửi nhu cầu tư vấn</button>
          <p class="form-status" role="status"></p>
        </form>
      </article>
    </section>
  `;
}

detailRoot.addEventListener("click", (event) => {
  const option = event.target.closest(".quantity-option");
  if (!option) return;

  detailRoot.querySelectorAll(".quantity-option").forEach((item) => item.classList.toggle("active", item === option));
  const selectedSeason = detailRoot.querySelector("#selectedSeason");
  selectedSeason.innerHTML = `
    <span>Sản lượng đang chọn</span>
    <strong>${option.dataset.quantity}</strong>
    <p>${option.dataset.season}. Đây sẽ là cơ sở để AgriShare cập nhật tiến độ mùa vụ cho nhà đầu tư.</p>
  `;
});

detailRoot.addEventListener("submit", (event) => {
  const form = event.target.closest(".detail-interest-form");
  if (!form) return;
  event.preventDefault();
  const status = form.querySelector(".form-status");
  status.textContent = "Đã ghi nhận nhu cầu mẫu. Khi kết nối backend, form này sẽ lưu thành đơn tư vấn.";
  status.dataset.state = "success";
});

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
