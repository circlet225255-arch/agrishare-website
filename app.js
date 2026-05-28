const API_BASE_URL = window.AGRISHARE_CONFIG?.API_BASE_URL || "http://localhost:5000/api/v1";

const marketplaceProfiles = {
  "Bưởi da xanh": {
    logo: "assets/logo-buoi-song-xoai.jpg",
    facebookUrl:
      "https://facebook.com/htxbuoidaxanhsongxoaitanthanh?mibextid=wwXIfr&rdid=FnB3W6UFXdJYiR2T&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1bZEJ69iCj%2F%3Fmibextid%3DwwXIfr",
    producer: "HTX Bưởi da xanh Sông Xoài",
    productIntro:
      "Bưởi da xanh vùng Sông Xoài, định hướng chất lượng ổn định, trái đẹp, phù hợp làm quà biếu và tiêu dùng gia đình.",
    highlights: ["Vườn chuyên canh", "Trái tuyển chọn", "Theo dõi mùa vụ", "Truy xuất lô"],
    qualityNotes:
      "Ưu tiên lô trái đồng đều, vỏ xanh, tép mọng, vị ngọt thanh; lịch giao theo mùa thu hoạch thực tế.",
    specs: {
      packaging: "Thùng 5-10kg, phân loại theo size và độ đồng đều của trái",
      referencePrice: "Theo giá mùa vụ tại thời điểm xác nhận đơn",
      shelfLife: "7-14 ngày tùy độ chín và điều kiện bảo quản",
      storage: "Để nơi khô mát, tránh nắng trực tiếp, không xếp đè mạnh",
      deliveryPlan: "Giao theo đợt thu hoạch, ưu tiên khách đã xác nhận thanh toán",
      returnPolicy: "Đổi/bù nếu trái dập hỏng do vận chuyển hoặc sai quy cách đã xác nhận",
    },
  },
  Gạo: {
    logo: "assets/logo-gao-tam-a.jpg",
    facebookUrl: "https://www.facebook.com/profile.php?id=61565116450494",
    producer: "Gạo Tám Á",
    productIntro:
      "Gạo Tám Á hướng tới nhóm khách cần nguồn gạo ngon, ổn định, đóng gói sạch và có câu chuyện vùng trồng rõ ràng.",
    highlights: ["Gạo ngon hằng ngày", "Đóng gói sạch", "Nguồn cung ổn định", "Phù hợp gia đình"],
    qualityNotes:
      "Ưu tiên lô gạo mới, hạt đều, mùi thơm tự nhiên; sản phẩm có thể chia nhiều đợt giao để giữ độ tươi.",
    specs: {
      packaging: "Túi 5kg hoặc 10kg, đóng gói sạch và niêm phong",
      referencePrice: "Theo bảng giá lô gạo tại thời điểm xác nhận đơn",
      shelfLife: "3-6 tháng trong điều kiện bảo quản khô mát",
      storage: "Để nơi thoáng, tránh ẩm, đóng kín sau khi mở túi",
      deliveryPlan: "Có thể chia nhiều đợt giao để giữ độ mới của gạo",
      returnPolicy: "Đổi/bù nếu bao bì rách, ẩm mốc hoặc sản phẩm không đúng lô đã xác nhận",
    },
  },
  "Mật ong dú": {
    logo: "assets/logo-mat-ong-du-wins-farm.jpg",
    facebookUrl: "https://www.facebook.com/profile.php?id=61587362812412",
    producer: "Mật ong dú Win's Farm",
    productIntro:
      "Mật ong dú Win's Farm là dòng đặc sản có sản lượng giới hạn, phù hợp quà tặng sức khỏe và trải nghiệm nông nghiệp bản địa.",
    highlights: ["Mật ong dú", "Sản lượng giới hạn", "Quà tặng cao cấp", "Khai thác theo đợt"],
    qualityNotes:
      "Ưu tiên hũ mật trong, thơm, vị chua ngọt đặc trưng; cần kiểm soát thời điểm khai thác và bảo quản.",
    specs: {
      packaging: "Hũ thủy tinh hoặc chai nhỏ, niêm phong theo lô khai thác",
      referencePrice: "Theo sản lượng khai thác và quy cách đóng hũ thực tế",
      shelfLife: "12 tháng nếu bảo quản đúng điều kiện",
      storage: "Đậy kín, để nơi khô mát, tránh nhiệt cao và ánh nắng trực tiếp",
      deliveryPlan: "Giao theo đợt khai thác, số lượng có thể giới hạn theo mùa",
      returnPolicy: "Đổi/bù nếu hũ vỡ, rò rỉ hoặc sai quy cách đóng gói đã xác nhận",
    },
  },
  "Sữa chua": {
    logo: "assets/logo-sua-chua-ong-nhiem.jpg",
    facebookUrl: "https://www.facebook.com/suabotuoiongnhiem/?locale=vi_VN",
    producer: "Sữa chua Ông Nhiệm",
    productIntro:
      "Sữa chua Ông Nhiệm phù hợp mô hình nhận sản phẩm định kỳ, bán lẻ địa phương và quà tặng tươi cho gia đình/văn phòng.",
    highlights: ["Sữa chua tươi", "Giao định kỳ", "Sản phẩm dễ dùng", "Phù hợp văn phòng"],
    qualityNotes:
      "Ưu tiên quy trình lạnh, hạn dùng rõ ràng, giao theo đợt nhỏ để giữ chất lượng sản phẩm.",
    specs: {
      packaging: "Hũ/cốc sữa chua theo lốc hoặc thùng, có ngày sản xuất và hạn dùng",
      referencePrice: "Theo số lượng, vị sản phẩm và lịch giao đã xác nhận",
      shelfLife: "Theo hạn dùng trên bao bì, ưu tiên dùng sớm sau khi nhận",
      storage: "Bảo quản lạnh, tránh để ngoài nhiệt độ phòng quá lâu",
      deliveryPlan: "Giao định kỳ theo tuần hoặc theo lịch đã hẹn với khách",
      returnPolicy: "Đổi/bù nếu sản phẩm hỏng do giao nhận hoặc không đúng quy cách đã xác nhận",
    },
  },
};

const productPriority = {
  "Bưởi da xanh": 1,
  Gạo: 2,
  "Mật ong dú": 3,
  "Sữa chua": 4,
};

const fallbackProjects = [
  {
    id: "buoi-da-xanh-song-xoai",
    name: "Bưởi da xanh Sông Xoài",
    category: "Bưởi da xanh",
    location: "Sông Xoài",
    image: "assets/product-buoi-song-xoai.png",
    capital: 260000000,
    funded: 84,
    duration: "8 tháng",
    returnRate: "10-14%",
    risk: "Ổn định chất lượng",
    tags: ["Chất lượng", "Mùa vụ ổn định", "Ổn định chất lượng"],
    cta: "Lựa chọn gói đầu tư",
    summary:
      "Đầu tư chăm sóc vùng bưởi da xanh Sông Xoài, duy trì chất lượng mùa vụ ổn định và kiểm soát đầu ra minh bạch.",
    ...marketplaceProfiles["Bưởi da xanh"],
  },
  {
    id: "gao-tam-a",
    name: "Gạo Tám Á",
    category: "Gạo",
    location: "Việt Nam",
    image: "assets/product-gao-tam-a.png",
    capital: 180000000,
    funded: 58,
    duration: "6 tháng",
    returnRate: "8-12%",
    risk: "Thấp",
    tags: ["Gạo ngon", "Đóng gói sạch", "Nguồn cung ổn định"],
    summary:
      "Đầu tư mùa vụ gạo Tám Á, theo dõi nguồn cung, kiểm soát đóng gói và nhận sản phẩm gạo sạch theo lịch.",
    cta: "Lựa chọn gói đầu tư",
    ...marketplaceProfiles.Gạo,
  },
  {
    id: "mat-ong-du-wins-farm",
    name: "Mật ong dú Win's Farm",
    category: "Mật ong dú",
    location: "Win's Farm",
    image: "assets/product-mat-ong-du-wins-farm.png",
    capital: 520000000,
    funded: 31,
    duration: "12 tháng",
    returnRate: "14-20%",
    risk: "Trung bình",
    tags: ["Mật ong dú", "Đặc sản", "Sản lượng giới hạn"],
    summary:
      "Đầu tư vùng khai thác mật ong dú Win's Farm, kiểm soát sản lượng theo đợt và đóng gói thành phẩm minh bạch.",
    cta: "Lựa chọn gói đầu tư",
    ...marketplaceProfiles["Mật ong dú"],
  },
  {
    id: "sua-chua-ong-nhiem",
    name: "Sữa chua Ông Nhiệm",
    category: "Sữa chua",
    location: "Ông Nhiệm",
    image: "assets/product-sua-chua-ong-nhiem.png",
    capital: 140000000,
    funded: 65,
    duration: "5 tháng",
    returnRate: "7-11%",
    risk: "Thấp",
    tags: ["Sữa chua tươi", "Giao định kỳ", "Bán lẻ"],
    summary:
      "Đầu tư sản xuất và phân phối sữa chua Ông Nhiệm, nhận sản phẩm tươi theo đợt hoặc trải nghiệm tại điểm sản xuất.",
    cta: "Lựa chọn gói đầu tư",
    ...marketplaceProfiles["Sữa chua"],
  },
];

let projects = [...fallbackProjects];

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const investmentPackages = [
  { id: "goi-1", label: "Gói 1", amount: 10000000, note: "10 triệu" },
  { id: "goi-2", label: "Gói 2", amount: 20000000, note: "20 triệu" },
  { id: "goi-3", label: "Gói 3", amount: 50000000, note: "50 triệu" },
  { id: "custom", label: "Khác", amount: null, note: "Tùy chọn đầu tư" },
];

const rewardProfiles = {
  "Bưởi da xanh": {
    starter: "20-25kg bưởi da xanh loại 1 theo đợt thu hoạch",
    growth: "45-55kg bưởi da xanh loại 1, ưu tiên lô đẹp và có mã truy xuất",
    premium: "120-140kg bưởi da xanh loại 1, chia làm nhiều đợt giao trong mùa vụ",
    custom: "Sản lượng bưởi da xanh được quy đổi theo giá trị đầu tư thực tế",
    farm: "01 lượt trải nghiệm vườn bưởi, tham quan quy trình chăm sóc và nhận sản phẩm tại farm",
  },
  Gạo: {
    starter: "60-70kg gạo sạch sau mùa vụ, đóng túi và truy xuất lô sản xuất",
    growth: "130-150kg gạo sạch, chia nhiều lần giao để đảm bảo độ mới",
    premium: "350-400kg gạo sạch, ưu tiên lô chất lượng cao và hỗ trợ giao theo lịch",
    custom: "Sản lượng gạo được quy đổi theo giá trị đầu tư thực tế",
    farm: "01 lượt trải nghiệm đồng lúa, xem nhật ký canh tác và nhận gạo tại điểm farm",
  },
  "Mật ong dú": {
    starter: "8-10 hũ mật ong dú nguyên chất, đóng gói quà tặng",
    growth: "18-22 hũ mật ong dú, kèm chứng nhận nguồn gốc và nhật ký khai thác",
    premium: "50-60 hũ mật ong dú, ưu tiên lô khai thác đẹp và hỗ trợ quà tặng doanh nghiệp",
    custom: "Số lượng mật ong dú được quy đổi theo giá trị đầu tư thực tế",
    farm: "01 lượt trải nghiệm vùng nuôi ong dú, tìm hiểu khai thác mật và nhận sản phẩm tại farm",
  },
  "Sữa chua": {
    starter: "80-100 hũ sữa chua nông trại, giao theo lịch để đảm bảo độ tươi",
    growth: "180-220 hũ sữa chua, chia nhiều đợt giao và ưu tiên vị theo mùa",
    premium: "500-560 hũ sữa chua, phù hợp gia đình, văn phòng hoặc quà tặng định kỳ",
    custom: "Số lượng sữa chua được quy đổi theo giá trị đầu tư thực tế",
    farm: "01 lượt trải nghiệm nông trại sữa, xem quy trình sản xuất và nhận sản phẩm tại farm",
  },
};

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const projectGrid = document.querySelector("#projectGrid");
const dialog = document.querySelector("#projectDialog");
const dialogContent = document.querySelector("#dialogContent");
const calculator = document.querySelector("#calculator");
const calcResults = document.querySelector("#calcResults");
const homeTrackingForm = document.querySelector("#homeTrackingForm");
const homeTrackingStatus = document.querySelector("#homeTrackingStatus");
const homeTrackingResult = document.querySelector("#homeTrackingResult");

const orderStatusLabels = {
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

const paymentStatusLabels = {
  pending: "Chờ cập nhật",
  awaiting_payment: "Chờ thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
  failed: "Thanh toán lỗi",
};

const deliveryMethodLabels = {
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

const shortDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

function enrichMarketplaceProject(project) {
  const profile = marketplaceProfiles[project.category] || {};
  const fallback = fallbackProjects.find(
    (item) => item.name === project.name || item.category === project.category,
  );

  return {
    ...project,
    ...fallback,
    id: project.id || fallback?.id,
    packages: project.packages || fallback?.packages,
    image: fallback?.image || project.image,
    tags: fallback?.tags || project.tags || [],
    summary: fallback?.summary || project.summary,
    cta: "Lựa chọn gói đầu tư",
    ...profile,
  };
}

function sortProjectsByPriority(projectList) {
  return [...projectList].sort(
    (a, b) => (productPriority[a.category] || 99) - (productPriority[b.category] || 99),
  );
}

function formatTrackingDate(value) {
  if (!value) return "Chưa có";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có";
  return shortDateFormatter.format(date);
}

function renderHomepageOrder(order) {
  const customer = order.customerSnapshot || {};
  const project = order.projectSnapshot || order.projectId || {};
  const packageInfo = order.packageSnapshot || {};

  homeTrackingResult.innerHTML = `
    <div class="tracking-result-card">
      <div class="tracking-result-head">
        <div>
          <p class="eyebrow">Mã đơn ${order.orderCode}</p>
          <h3>${project.name || "Đơn đầu tư AgriShare"}</h3>
        </div>
        <span class="status-pill ${order.status}">${orderStatusLabels[order.status] || order.status}</span>
      </div>
      <div class="order-summary-grid">
        <div><span>Khách hàng</span><strong>${customer.fullName || "Chưa có"}</strong></div>
        <div><span>Gói đầu tư</span><strong>${packageInfo.label || "Gói đầu tư"} - ${currency.format(order.amount || 0)}</strong></div>
        <div><span>Thanh toán</span><strong>${paymentStatusLabels[order.payment?.status] || "Chưa cập nhật"}</strong></div>
        <div><span>Nhận sản phẩm</span><strong>${deliveryMethodLabels[order.delivery?.method] || "Chưa chọn"}</strong></div>
        <div><span>Trạng thái giao/farm</span><strong>${deliveryStatusLabels[order.delivery?.status] || "Chưa cập nhật"}</strong></div>
        <div><span>Ngày hẹn</span><strong>${formatTrackingDate(order.delivery?.preferredDate || order.delivery?.scheduledAt)}</strong></div>
      </div>
      <ul class="homepage-timeline">
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
      <div class="tracking-actions">
        <a class="text-link" href="track-order.html?code=${encodeURIComponent(order.orderCode)}">Mở trang tra cứu đầy đủ</a>
        <a class="text-link" href="${API_BASE_URL}/checkout/orders/${encodeURIComponent(order.orderCode)}/receipt" target="_blank" rel="noreferrer">In/Lưu biên nhận</a>
      </div>
    </div>
  `;
}

async function lookupHomepageOrder(event) {
  event.preventDefault();
  const formData = new FormData(homeTrackingForm);
  const orderCode = String(formData.get("orderCode") || "").trim().toUpperCase();

  if (!orderCode) return;

  homeTrackingStatus.textContent = "Đang tra cứu đơn...";
  homeTrackingStatus.dataset.state = "";

  try {
    const response = await fetch(`${API_BASE_URL}/checkout/orders/${encodeURIComponent(orderCode)}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không tìm thấy đơn đầu tư");
    }

    renderHomepageOrder(data.order);
    homeTrackingStatus.textContent = "Đã tìm thấy đơn đầu tư.";
    homeTrackingStatus.dataset.state = "success";
    trackEvent("homepage_order_lookup", { orderCode });
  } catch (error) {
    homeTrackingStatus.textContent = error.message;
    homeTrackingStatus.dataset.state = "error";
  }
}

function renderProjects(filter = "all") {
  const visibleProjects = sortProjectsByPriority(
    filter === "all" ? projects : projects.filter((project) => project.category === filter),
  );

  projectGrid.innerHTML = visibleProjects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-image">
            <img src="${project.image}" alt="${project.name}" />
            <div class="project-header">
              <h3>${project.name}</h3>
              <span class="project-logo-badge">
                <img src="${project.logo}" alt="Logo ${project.producer || project.name}" />
              </span>
            </div>
          </div>
          <div class="project-body">
            <span class="producer-pill">${project.producer || project.category}</span>
            <div class="project-meta">
              <span>${project.category}</span>
              <span>${project.location}</span>
              <span>${project.risk}</span>
            </div>
            <p>${project.summary}</p>
            <p class="product-intro">${project.productIntro || ""}</p>
            <div class="tag-row">
              ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <div class="project-stats">
              <div>
                <span>Vốn cần gọi</span>
                <strong>${currency.format(project.capital)}</strong>
              </div>
              <div>
                <span>Đã tài trợ</span>
                <strong>${project.funded}%</strong>
              </div>
              <div>
                <span>Lợi nhuận dự kiến</span>
                <strong>${project.returnRate}</strong>
              </div>
            </div>
            <button class="card-action" type="button" data-project-id="${project.id}">
              ${project.cta || "Xem hồ sơ dự án"}
            </button>
            <a class="project-detail-link" href="project-detail.html?id=${encodeURIComponent(project.id)}">
              Xem chi tiết dự án
            </a>
            <a class="facebook-link" href="${project.facebookUrl}" target="_blank" rel="noreferrer">
              Xem Facebook nhà sản xuất
            </a>
          </div>
        </article>
      `,
    )
    .join("");
}

async function loadMarketplaceProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/marketplace`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
      const curatedNames = new Set(fallbackProjects.map((project) => project.name));
      const curatedCategories = new Set(fallbackProjects.map((project) => project.category));
      projects = data.projects
        .filter((project) => curatedNames.has(project.name) || curatedCategories.has(project.category))
        .map(enrichMarketplaceProject)
        .slice(0, 4);

      if (projects.length < 4) {
        const existingCategories = new Set(projects.map((project) => project.category));
        fallbackProjects.forEach((project) => {
          if (!existingCategories.has(project.category)) projects.push(project);
        });
      }
      projects = sortProjectsByPriority(projects);
      renderProjects(document.querySelector(".filter-btn.active")?.dataset.filter || "all");
    }
  } catch (error) {
    console.info("Đang dùng dữ liệu tĩnh vì backend MongoDB chưa sẵn sàng:", error.message);
  }
}

function openProject(projectId) {
  const project = projects.find((item) => String(item.id) === String(projectId));
  if (!project) return;
  const packageOptions = getAvailablePackages(project);
  const defaultPackage = packageOptions[0];

  dialogContent.innerHTML = `
    <div class="dialog-cover">
      <img src="${project.image}" alt="${project.name}" />
    </div>
    <div class="dialog-body">
      <p class="eyebrow">${project.category} tại ${project.location}</p>
      <h3>${project.name}</h3>
      <p>${project.summary}</p>
      <div class="producer-panel">
        <span>Nhà sản xuất</span>
        <strong>${project.producer || project.name}</strong>
        <p>${project.productIntro || ""}</p>
        <a class="text-link" href="${project.facebookUrl}" target="_blank" rel="noreferrer">Xem kênh Facebook</a>
      </div>
      <div class="dialog-facts">
        <div>
          <span>Vốn cần gọi</span>
          <strong>${currency.format(project.capital)}</strong>
        </div>
        <div>
          <span>Thời gian</span>
          <strong>${project.duration}</strong>
        </div>
        <div>
          <span>Rủi ro</span>
          <strong>${project.risk}</strong>
        </div>
      </div>
      <p>
        Hồ sơ vận hành đề xuất: thẩm định thực địa, hợp đồng điện tử, escrow theo tiến độ,
        nhật ký sản xuất hằng tuần, bằng chứng hình ảnh và báo cáo sau thu hoạch.
      </p>
      <div class="quality-panel">
        <h4>Hồ sơ sản phẩm cần theo dõi</h4>
        <ul>
          ${(project.highlights || []).map((item) => `<li>${item}</li>`).join("")}
          <li>${project.qualityNotes || "Kiểm soát chất lượng theo từng lô sản phẩm."}</li>
        </ul>
      </div>
      <div class="quality-panel">
        <h4>Quy cách bán hàng</h4>
        <ul>
          <li><strong>Đóng gói:</strong> ${project.specs?.packaging || "Cập nhật theo từng lô sản phẩm."}</li>
          <li><strong>Giá tham chiếu:</strong> ${project.specs?.referencePrice || "Xác nhận theo mùa vụ."}</li>
          <li><strong>Hạn dùng:</strong> ${project.specs?.shelfLife || "Theo bao bì hoặc xác nhận đơn."}</li>
          <li><strong>Bảo quản:</strong> ${project.specs?.storage || "Theo hướng dẫn của từng sản phẩm."}</li>
          <li><strong>Giao nhận:</strong> ${project.specs?.deliveryPlan || "Theo lịch đã xác nhận với khách hàng."}</li>
          <li><strong>Đổi/bù:</strong> ${project.specs?.returnPolicy || "Xử lý khi sản phẩm sai quy cách hoặc hư hỏng do giao nhận."}</li>
        </ul>
      </div>
      <form class="investment-flow" data-project-id="${project.id}" data-selected-package="${defaultPackage.id}" data-selected-delivery="home_delivery">
        <div class="flow-header">
          <span>Đặt đầu tư thật</span>
          <h4>Khách hàng lựa chọn gói đầu tư</h4>
          <p>Thông tin bên dưới sẽ được gửi về MongoDB để AgriShare tư vấn, xác nhận thanh toán và theo dõi đơn.</p>
        </div>
        <div class="package-grid" role="group" aria-label="Lựa chọn gói đầu tư">
          ${packageOptions
            .map(
              (item) => `
                <button
                  class="package-option ${item.id === defaultPackage.id ? "active" : ""}"
                  type="button"
                  data-package-id="${item.id}"
                >
                  <span>${item.label}</span>
                  <strong>${item.note}</strong>
                </button>
              `,
            )
            .join("")}
        </div>
        <label class="custom-investment" data-custom-investment hidden>
          Số tiền tùy chọn của khách hàng
          <input id="customInvestmentAmount" name="customAmount" type="number" min="1000000" step="1000000" placeholder="Nhập số tiền đầu tư" />
        </label>
        <div class="reward-panel">
          <span>Quyền lợi</span>
          <h4>Giá trị sản phẩm nhận lại</h4>
          <ul id="packageBenefits">${renderBenefits(project, defaultPackage.id)}</ul>
        </div>
        <div class="delivery-panel">
          <span>Nhận sản phẩm</span>
          <h4>Chọn hình thức nhận sản phẩm</h4>
          <div class="delivery-grid" role="group" aria-label="Hình thức nhận sản phẩm">
            <button class="delivery-option active" type="button" data-delivery-method="home_delivery">
              <strong>Nhận hàng tại nhà</strong>
              <small>Lưu địa chỉ giao hàng, lịch giao theo mùa vụ và trạng thái đơn hàng.</small>
            </button>
            <button class="delivery-option" type="button" data-delivery-method="farm_pickup">
              <strong>Trải nghiệm và nhận sản phẩm tại Farm của nhà nông</strong>
              <small>Đặt lịch tham quan, xác nhận người tham dự và nhận sản phẩm trực tiếp tại farm.</small>
            </button>
          </div>
        </div>
        <div class="customer-panel">
          <span>Thông tin khách hàng</span>
          <h4>AgriShare liên hệ xác nhận đơn</h4>
          <div class="checkout-grid">
            <label>
              Họ và tên
              <input name="fullName" type="text" autocomplete="name" required placeholder="Nguyễn Văn A" />
            </label>
            <label>
              Số điện thoại
              <input name="phone" type="tel" autocomplete="tel" required placeholder="090..." />
            </label>
            <label>
              Email
              <input name="email" type="email" autocomplete="email" placeholder="email@domain.com" />
            </label>
            <label>
              Ngày mong muốn nhận hàng hoặc đi farm
              <input name="preferredDate" type="date" />
            </label>
            <label class="checkout-wide">
              Địa chỉ nhận hàng
              <input name="address" type="text" autocomplete="street-address" placeholder="Số nhà, phường/xã, tỉnh/thành" />
            </label>
            <label>
              Số người tham gia farm
              <input name="participants" type="number" min="1" value="1" />
            </label>
            <label class="checkout-wide">
              Ghi chú thêm
              <textarea name="note" rows="3" placeholder="Nhu cầu nhận hàng, thời gian liên hệ, yêu cầu hóa đơn..."></textarea>
            </label>
          </div>
          <label class="consent-line">
            <input name="consentAccepted" type="checkbox" checked />
            Tôi đồng ý để AgriShare lưu thông tin và liên hệ tư vấn đơn đầu tư này theo <a href="legal.html" target="_blank" rel="noreferrer">điều khoản và chính sách bảo mật</a>.
          </label>
        </div>
        <div class="checkout-actions">
          <button class="btn btn-primary" type="submit">Gửi đơn đầu tư</button>
          <p id="checkoutStatus" role="status"></p>
        </div>
      </form>
      <div id="orderResult" class="order-result" hidden></div>
    </div>
  `;

  dialog.showModal();
}

function getAvailablePackages(project) {
  if (!Array.isArray(project.packages) || project.packages.length === 0) {
    return investmentPackages;
  }

  return investmentPackages.map((item) => {
    const databasePackage = project.packages.find((packageItem) => packageItem.key === item.id);
    if (!databasePackage) return item;

    return {
      ...item,
      amount: databasePackage.isCustom ? null : Number(databasePackage.amount || item.amount),
      note: databasePackage.isCustom ? item.note : currency.format(databasePackage.amount || item.amount),
      rewardDescription: databasePackage.rewardDescription,
    };
  });
}

function getRewardTier(amount) {
  if (amount >= 50000000) return "premium";
  if (amount >= 20000000) return "growth";
  return "starter";
}

function renderBenefits(project, packageId, customAmount = 0) {
  const profile = rewardProfiles[project.category] || {
    starter: "Sản phẩm nông nghiệp theo mùa vụ, có kiểm soát chất lượng",
    growth: "Sản phẩm nông nghiệp theo mùa vụ, ưu tiên lô chất lượng cao",
    premium: "Sản phẩm nông nghiệp theo mùa vụ, chia nhiều đợt nhận",
    custom: "Sản phẩm được quy đổi theo giá trị đầu tư thực tế",
    farm: "01 lượt trải nghiệm farm và nhận sản phẩm trực tiếp tại nơi sản xuất",
  };
  const selectedPackage = investmentPackages.find((item) => item.id === packageId);
  const databasePackage = project.packages?.find((item) => item.key === packageId);
  const amount =
    databasePackage?.isCustom || packageId === "custom"
      ? Number(customAmount || 0)
      : Number(databasePackage?.amount || selectedPackage?.amount || 0);

  if (packageId === "custom" && !amount) {
    return `
      <li>Nhập số tiền đầu tư tùy chọn để hệ thống quy đổi sản phẩm nhận lại.</li>
      <li>Giữ nguyên quyền theo dõi nhật ký mùa vụ, chất lượng và tiến độ thu hoạch.</li>
      <li>Có thể chọn nhận hàng tại nhà hoặc trải nghiệm tại farm sau khi xác nhận gói.</li>
    `;
  }

  const productValue =
    databasePackage?.rewardDescription ||
    (packageId === "custom" ? profile.custom : profile[getRewardTier(amount)]);

  return `
    <li><strong>Sản phẩm nhận lại:</strong> ${productValue}.</li>
    <li><strong>Minh bạch mùa vụ:</strong> nhận nhật ký chăm sóc, hình ảnh cập nhật và mốc thu hoạch.</li>
    <li><strong>Kiểm soát chất lượng:</strong> sản phẩm được phân loại, đóng gói và truy xuất theo lô.</li>
    <li><strong>Trải nghiệm farm:</strong> ${profile.farm}.</li>
  `;
}

function updateInvestmentSelection(packageId) {
  const flow = dialogContent.querySelector(".investment-flow");
  if (!flow) return;
  const project = projects.find((item) => String(item.id) === String(flow.dataset.projectId));
  const customWrapper = flow.querySelector("[data-custom-investment]");
  const customInput = flow.querySelector("#customInvestmentAmount");

  flow.dataset.selectedPackage = packageId;

  flow.querySelectorAll(".package-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.packageId === packageId);
  });

  customWrapper.hidden = packageId !== "custom";
  flow.querySelector("#packageBenefits").innerHTML = renderBenefits(
    project,
    packageId,
    customInput?.value,
  );
}

function getSelectedInvestmentAmount(flow) {
  const packageId = flow.dataset.selectedPackage || "goi-1";
  const project = projects.find((item) => String(item.id) === String(flow.dataset.projectId));
  const databasePackage = project?.packages?.find((item) => item.key === packageId);
  const fallbackPackage = investmentPackages.find((item) => item.id === packageId);

  if (packageId === "custom" || databasePackage?.isCustom) {
    return Number(flow.querySelector("#customInvestmentAmount")?.value || 0);
  }

  return Number(databasePackage?.amount || fallbackPackage?.amount || 0);
}

async function submitInvestmentOrder(event) {
  event.preventDefault();

  const flow = event.target.closest(".investment-flow");
  const status = flow.querySelector("#checkoutStatus");
  const result = dialogContent.querySelector("#orderResult");
  const project = projects.find((item) => String(item.id) === String(flow.dataset.projectId));
  const formData = new FormData(flow);
  const amount = getSelectedInvestmentAmount(flow);

  if (!/^[a-f\d]{24}$/i.test(String(project.id))) {
    status.textContent = "Backend MongoDB cần chạy để ghi nhận đơn thật. Website đang dùng dữ liệu tĩnh.";
    status.dataset.state = "error";
    return;
  }

  if (!amount || amount < 1000000) {
    status.textContent = "Vui lòng nhập số tiền đầu tư tối thiểu 1.000.000đ.";
    status.dataset.state = "error";
    return;
  }

  const payload = {
    projectId: project.id,
    packageKey: flow.dataset.selectedPackage || "goi-1",
    customAmount: amount,
    deliveryMethod: flow.dataset.selectedDelivery || "home_delivery",
    paymentMethod: "bank_transfer",
    customer: {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
    },
    delivery: {
      address: formData.get("address"),
      preferredDate: formData.get("preferredDate"),
      participants: Number(formData.get("participants") || 1),
      note: formData.get("note"),
    },
    note: formData.get("note"),
    consentAccepted: formData.get("consentAccepted") === "on",
  };

  status.textContent = "Đang gửi đơn đầu tư về hệ thống...";
  status.dataset.state = "loading";
  flow.querySelector("[type='submit']").disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/checkout/investment-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Không thể ghi nhận đơn đầu tư");
    }

    status.textContent = "Đã ghi nhận đơn đầu tư.";
    status.dataset.state = "success";
    result.hidden = false;
    result.innerHTML = `
      <span>Đơn đã lưu vào MongoDB</span>
      <h4>Mã đơn: ${data.order.orderCode}</h4>
      <p>Khách hàng: ${data.order.customer.fullName} - ${data.order.customer.phone}</p>
      <p>Gói đầu tư: ${data.order.package.label} - ${currency.format(data.order.amount)}</p>
      <p><a class="text-link" href="track-order.html?code=${encodeURIComponent(data.order.orderCode)}">Tra cứu tiến độ đơn đầu tư</a></p>
      <ol>
        ${data.nextSteps.map((step) => `<li>${step}</li>`).join("")}
      </ol>
    `;
    window.setTimeout(() => {
      window.location.href = `thank-you.html?code=${encodeURIComponent(data.order.orderCode)}`;
    }, 900);
  } catch (error) {
    status.textContent = error.message;
    status.dataset.state = "error";
    flow.querySelector("[type='submit']").disabled = false;
  }
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
      page: window.location.pathname || "index.html",
      metadata,
      sessionId: getSessionId(),
    }),
  }).catch(() => {});
}

function updateCalculator() {
  const capital = Number(document.querySelector("#capitalInput").value || 0);
  const returnRate = Number(document.querySelector("#returnInput").value);
  const feeRate = Number(document.querySelector("#feeInput").value);
  const grossProfit = capital * returnRate;
  const platformFee = grossProfit * feeRate;
  const netProfit = grossProfit - platformFee;

  calcResults.innerHTML = `
    <div>
      <span>Lợi nhuận trước phí</span>
      <strong>${currency.format(grossProfit)}</strong>
    </div>
    <div>
      <span>Phí nền tảng</span>
      <strong>${currency.format(platformFee)}</strong>
    </div>
    <div>
      <span>Dự kiến nhận về</span>
      <strong>${currency.format(capital + netProfit)}</strong>
    </div>
  `;
}

document.addEventListener("scroll", () => {
  header.dataset.elevated = window.scrollY > 24 ? "true" : "false";
});

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  header.classList.toggle("nav-open");
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    header.classList.remove("nav-open");
  });
});

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

projectGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-id]");
  if (button) {
    trackEvent("project_cta_click", { projectId: button.dataset.projectId });
    openProject(button.dataset.projectId);
  }
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const packageButton = event.target.closest("[data-package-id]");
  if (packageButton) {
    updateInvestmentSelection(packageButton.dataset.packageId);
  }

  const deliveryButton = event.target.closest(".delivery-option");
  if (deliveryButton) {
    const flow = deliveryButton.closest(".investment-flow");
    if (flow) {
      flow.dataset.selectedDelivery = deliveryButton.dataset.deliveryMethod;
    }

    dialog.querySelectorAll(".delivery-option").forEach((button) => {
      button.classList.toggle("active", button === deliveryButton);
    });
  }
});

dialog.addEventListener("input", (event) => {
  if (event.target.id === "customInvestmentAmount") {
    updateInvestmentSelection("custom");
  }
});

dialog.addEventListener("submit", submitInvestmentOrder);

calculator.addEventListener("input", updateCalculator);
homeTrackingForm.addEventListener("submit", lookupHomepageOrder);

renderProjects();
loadMarketplaceProjects();
updateCalculator();
trackEvent("page_view", { page: "home" });
