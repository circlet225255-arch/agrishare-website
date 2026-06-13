const API_BASE_URL = window.AGRISHARE_CONFIG?.API_BASE_URL || "http://localhost:5000/api/v1";
const detailRoot = document.querySelector("#projectDetail");

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const CREDIT_VALUE = 100000;

const detailProjects = {
  "buoi-da-xanh-song-xoai": {
    id: "buoi-da-xanh-song-xoai",
    name: "Bưởi da xanh Sông Xoài",
    category: "Bưởi da xanh",
    location: "Sông Xoài",
    image: "assets/product-buoi-song-xoai-v2.png",
    logo: "assets/logo-buoi-song-xoai.jpg",
    producer: "Bưởi da xanh Sông Xoài",
    facebookUrl: "https://www.facebook.com/share/1DAv6TPQSd/?mibextid=wwXIfr",
    website: "https://htxbuoidaxanhsongxoai.vn/tuyen-dung",
    summary: "Đồng hành theo sản lượng bưởi thật, theo dõi một phần vườn và nhận trái theo mùa thu hoạch.",
    productIntro:
      "Bưởi da xanh tuyển chọn từ vùng Sông Xoài, phù hợp người tiêu dùng thông thái muốn sở hữu một mảnh vườn theo mùa.",
    investmentIntro:
      "Khách chọn số kg bưởi muốn đặt. AgriShare quy đổi sản lượng đó thành Agricoin mùa vụ và phần vườn dự kiến để cập nhật nhật ký chăm sóc.",
    farmerInfo: "Chủ hộ kinh doanh Hồ Hoàng Kha trực tiếp phát triển vườn bưởi da xanh tại Sông Xoài, định hướng sản xuất ổn định và bán trực tiếp đến khách hàng.",
    certificateStatus: "Đã cập nhật 2 giấy tờ kiểm định/chứng nhận cho hồ sơ bưởi da xanh Sông Xoài.",
    certificateImages: [
      {
        src: "assets/buoi-kiem-dinh-01.png",
        title: "Giấy kiểm định chất lượng 01",
        caption: "Tài liệu kiểm định/chứng nhận do chủ vườn cung cấp.",
      },
      {
        src: "assets/buoi-kiem-dinh-02.png",
        title: "Giấy kiểm định chất lượng 02",
        caption: "Tài liệu bổ sung cho hồ sơ minh bạch sản phẩm bưởi.",
      },
    ],
    farmerProfile: {
      owner: "Hồ Hoàng Kha",
      role: "Chủ hộ kinh doanh",
      phone: "093 745 77 42",
      email: "khahosx@gmail.com",
      website: "https://htxbuoidaxanhsongxoai.vn/tuyen-dung",
      fanpage: "https://www.facebook.com/share/1DAv6TPQSd/?mibextid=wwXIfr",
      address: "Tổ 2, Ấp 3, phường Tân Thành, TP.HCM",
    },
    farmExperience: "Đặt Agricoin để trải nghiệm vườn bưởi, tham quan quy trình chăm sóc và nhận sản phẩm tại farm.",
    farmTour: {
      title: "Mini farm tour cuối vụ tại vườn bưởi",
      subtitle: "Chạm vào thiên nhiên - thu hoạch tận tay - nhận đúng phần giá trị đã đồng hành.",
      heroLabel: "Nhận bưởi tại farm",
      heroSummary: "Check-in, hái bưởi, cân sản lượng và nhận sản phẩm ngay tại vườn.",
      guestSteps: [
        "Check-in tại vườn bưởi và nhận mã đơn/Agricoin",
        "Nghe giới thiệu lịch sử vườn, quy trình canh tác",
        "Tham quan cây/lô đang theo dõi trong mùa vụ",
        "Trực tiếp hái bưởi, cân sản lượng và đóng gói",
        "Thưởng thức bưởi tại vườn và mua thêm đặc sản",
      ],
      farmerSteps: [
        "Đón khách và đối chiếu thông tin đơn",
        "Giới thiệu đặc trưng giống bưởi da xanh Sông Xoài",
        "Chia sẻ kỹ thuật chăm sóc, ra hoa, dưỡng trái",
        "Hỗ trợ thu hoạch, phân loại và bàn giao sản phẩm",
      ],
    },
    unitPrice: 30000,
    unitLabel: "kg bưởi",
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
    summary: "Đồng hành theo kg gạo, theo dõi mùa vụ lúa và nhận gạo sạch theo lịch giao đã xác nhận.",
    productIntro:
      "Gạo Tám Á phù hợp gia đình muốn mua tận gốc, nhận gạo sạch theo đợt và theo dõi nguồn gốc rõ ràng.",
    investmentIntro:
      "Khách chọn số kg gạo muốn đặt. Sản lượng được quy đổi thành Agricoin mùa vụ và diện tích ruộng dự kiến để theo dõi gieo trồng.",
    farmerInfo: "Chủ hộ kinh doanh Trần Quang phụ trách sản phẩm gạo, tập trung nguồn gạo sạch dùng hằng ngày và đóng gói rõ nguồn gốc.",
    certificateStatus: "Đã cập nhật giấy chứng nhận nhãn hiệu Xuân Tiến và báo cáo kết quả thử nghiệm gạo hữu cơ ST25.",
    certificateImages: [
      {
        src: "assets/gao-kiem-dinh-01.png",
        title: "Giấy chứng nhận đăng ký nhãn hiệu Xuân Tiến",
        caption: "Tài liệu nhận diện nhãn hiệu gạo sạch Xuân Tiến.",
      },
      {
        src: "assets/gao-kiem-dinh-02.png",
        title: "Báo cáo kết quả thử nghiệm gạo hữu cơ ST25",
        caption: "Báo cáo phân tích mẫu do đơn vị kiểm nghiệm cung cấp.",
      },
    ],
    farmerProfile: {
      owner: "Trần Quang",
      role: "Chủ hộ kinh doanh",
      phone: "0988651128",
    },
    farmExperience: "Đặt Agricoin để trải nghiệm đồng lúa, xem quy trình canh tác và nhận gạo tại farm/điểm sản xuất.",
    farmTour: {
      title: "Mini farm tour cuối vụ tại ruộng lúa",
      subtitle: "Theo dấu hạt gạo từ ruộng lúa đến bao gạo sạch trao tận tay người tiêu dùng thông thái.",
      heroLabel: "Nhận gạo tại farm/điểm sản xuất",
      heroSummary: "Check-in lô ruộng, theo dõi thu hoạch hoặc đóng gói và nhận gạo theo sản lượng đã đặt.",
      guestSteps: [
        "Check-in tại ruộng/lô gạo và đối chiếu mã đơn Agricoin",
        "Nghe giới thiệu giống lúa, lịch gieo sạ và phương pháp chăm sóc",
        "Tham quan khu ruộng đang theo dõi trong mùa vụ",
        "Trải nghiệm thu hoạch, phơi/sấy, xay xát hoặc đóng gói theo điều kiện thực tế",
        "Nhận gạo tại farm/điểm sản xuất hoặc xác nhận lịch giao về nhà",
      ],
      farmerSteps: [
        "Đón khách và xác nhận thông tin đơn",
        "Giới thiệu quy trình canh tác, nhật ký mùa vụ và tiêu chuẩn chất lượng",
        "Hướng dẫn khách quan sát lúa, hạt gạo và khâu sơ chế",
        "Bàn giao gạo theo sản lượng đã đặt hoặc hẹn lịch giao theo đợt",
      ],
    },
    unitPrice: 25000,
    unitLabel: "kg gạo",
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
    website: "https://winsfarm.netzeronomy.com",
    summary: "Đồng hành theo lít mật, quy đổi số tổ ong dú và theo dõi quá trình chăm sóc, khai thác.",
    productIntro:
      "Mật ong dú Win's Farm là đặc sản sản lượng giới hạn, phù hợp khách muốn theo dõi tổ ong và nhận mật theo đợt khai thác.",
    investmentIntro:
      "Khách chọn số lít mật muốn đặt. AgriShare quy đổi sản lượng thành Agricoin mùa vụ và số tổ ong dú dự kiến.",
    farmerInfo: "Chủ hộ kinh doanh Nguyễn Thị Ngọc Phượng phát triển thương hiệu Ong dú Win's Farm, tập trung mô hình ong dú bản địa, trải nghiệm farm và chất lượng từng lô mật.",
    certificateStatus: "Đã cập nhật 2 hình ảnh kết quả kiểm nghiệm sản phẩm mật ong dú Win's Farm.",
    certificateImages: [
      {
        src: "assets/mat-ong-du-kiem-dinh-01.png",
        title: "Kết quả kiểm nghiệm mật ong dú",
        caption: "Phiếu phân tích thành phần mẫu mật ong của hộ kinh doanh Ong dú Win's Farm.",
      },
      {
        src: "assets/mat-ong-du-kiem-dinh-02.png",
        title: "Kết quả kiểm nghiệm - trang mẫu sản phẩm",
        caption: "Trang kiểm nghiệm có hình ảnh mẫu mật ong dú Win's Farm.",
      },
    ],
    farmerProfile: {
      owner: "Nguyễn Thị Ngọc Phượng",
      role: "Chủ hộ kinh doanh",
      brand: "Ong dú Win's Farm",
      phone: "0969174177",
      email: "ongduwinsfarm@gmail.com",
      website: "https://winsfarm.netzeronomy.com",
      address: "Cơ sở 1: Ấp Liên Hiệp, Xã Châu Đức, TP Hồ Chí Minh. Cơ sở 2: Ấp Tam Long, Xã Kim Long, TP Hồ Chí Minh",
    },
    farmExperience: "Đặt Agricoin để trải nghiệm farm ong dú, tìm hiểu tổ ong và quy trình khai thác mật.",
    farmTour: {
      title: "Mini farm tour trải nghiệm ong dú Win's Farm",
      subtitle: "Khách tham quan mô hình ong dú, quan sát tổ ong, nếm thử mật và truy xuất nguồn gốc tại farm.",
      heroLabel: "Nhận tổ ong dú/mật tại farm",
      heroSummary: "Check-in, quan sát tổ ong dú, truy xuất nguồn gốc và nhận phần tổ hoặc mật theo đợt khai thác.",
      guestSteps: [
        "Đặt lịch và xác nhận nhóm",
        "Check-in và briefing an toàn",
        "Giới thiệu ong dú",
        "Quan sát tổ ong và quy trình nuôi",
        "Trải nghiệm tương tác",
        "Nếm thử và truy xuất nguồn gốc",
        "Check-out",
      ],
      farmerSteps: [
        "Tiếp nhận đặt lịch",
        "Xác nhận và sắp xếp lịch tham quan",
        "Chuẩn bị khu vực trải nghiệm",
        "Đón tiếp và phổ biến an toàn",
        "Hướng dẫn tham quan mô hình ong dú",
        "Tổ chức hoạt động trải nghiệm",
        "Giới thiệu sản phẩm và bán hàng",
        "Thu thập phản hồi khách hàng",
      ],
    },
    unitPrice: 2000000,
    unitLabel: "lít mật",
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
    facebookUrl: "https://www.facebook.com/share/1KrpeNodBE/?mibextid=wwXIfr",
    website: "https://suaboongnhiem.com/",
    summary: "Đồng hành theo mẻ sản xuất, nhận sữa chua tươi định kỳ hoặc trải nghiệm tại điểm sản xuất.",
    productIntro:
      "Sữa chua Ông Nhiệm phù hợp khách muốn đặt sản phẩm tươi định kỳ cho gia đình, văn phòng hoặc quà tặng.",
    investmentIntro:
      "Khách chọn số thùng muốn đặt. Sản lượng được quy đổi thành Agricoin mùa vụ và mẻ sản xuất dự kiến để theo dõi quy trình lạnh.",
    farmerInfo: "Chủ hộ kinh doanh Nguyễn Văn Nhiệm trực tiếp phụ trách sản phẩm sữa chua Ông Nhiệm, tập trung sản phẩm tươi, giao định kỳ và kiểm soát bảo quản lạnh.",
    certificateStatus: "Đã cập nhật giấy chứng nhận đăng ký nhãn hiệu và phiếu kết quả kiểm nghiệm sản phẩm sữa chua.",
    certificateImages: [
      {
        src: "assets/sua-chua-kiem-dinh-01.png",
        title: "Phiếu kết quả kiểm nghiệm sữa chua",
        caption: "Báo cáo kiểm nghiệm mẫu sữa chua do đơn vị kiểm nghiệm cung cấp.",
      },
      {
        src: "assets/sua-chua-kiem-dinh-02.png",
        title: "Giấy chứng nhận đăng ký nhãn hiệu",
        caption: "Tài liệu sở hữu trí tuệ cho hộ kinh doanh Nguyễn Văn Nhiệm.",
      },
    ],
    farmerProfile: {
      owner: "Nguyễn Văn Nhiệm",
      role: "Chủ hộ kinh doanh",
      phone: "0989 816 181",
      email: "nhiemnguyencp@gmail.com",
      website: "https://suaboongnhiem.com/",
      fanpage: "https://www.facebook.com/share/1KrpeNodBE/?mibextid=wwXIfr",
      address: "Tổ 1, Ấp Tân Lễ A, Xã Châu Pha, TP Hồ Chí Minh",
    },
    farmExperience: "Đặt Agricoin để trải nghiệm điểm sản xuất, xem quy trình làm sữa chua và nhận sản phẩm tươi.",
    farmTour: {
      title: "Mini farm tour tại điểm sản xuất sữa chua",
      subtitle: "Theo dõi mẻ sữa chua từ nguyên liệu, ủ lạnh, đóng gói đến lúc nhận sản phẩm tươi.",
      heroLabel: "Nhận mẻ sữa chua",
      heroSummary: "Check-in, theo dõi mẻ sản xuất, đóng hũ và nhận mẻ sữa chua tươi theo lịch đã đặt.",
      guestSteps: [
        "Check-in tại điểm sản xuất và đối chiếu mã đơn Agricoin",
        "Nghe giới thiệu nguồn nguyên liệu, quy trình ủ và kiểm soát lạnh",
        "Tham quan khu chuẩn bị nguyên liệu, đóng hũ và bảo quản lạnh",
        "Trải nghiệm phân loại, đóng gói hoặc nhận sản phẩm theo lịch mẻ sản xuất",
        "Nhận sữa chua tươi tại điểm sản xuất hoặc xác nhận lịch giao về nhà",
      ],
      farmerSteps: [
        "Đón khách và xác nhận thông tin đơn",
        "Giới thiệu tiêu chuẩn vệ sinh, hạn dùng và quy trình bảo quản lạnh",
        "Chia sẻ nhật ký mẻ sản xuất, thời gian ủ và lịch giao định kỳ",
        "Bàn giao sản phẩm theo số lượng đã đặt hoặc hẹn lịch nhận theo đợt",
      ],
    },
    unitPrice: 180000,
    unitLabel: "thùng sữa chua",
    quantityOptions: [
      { label: "10 thùng sữa chua", amount: 10, unit: "thùng", seasonUnit: "khoảng 2 mẻ sản xuất theo dõi" },
      { label: "25 thùng sữa chua", amount: 25, unit: "thùng", seasonUnit: "khoảng 5 mẻ sản xuất theo dõi" },
      { label: "50 thùng sữa chua", amount: 50, unit: "thùng", seasonUnit: "khoảng 10 mẻ sản xuất theo dõi" },
    ],
    milestones: ["Ghi nhận mẻ sản xuất", "Cập nhật nguyên liệu", "Báo lịch làm lạnh", "Giao định kỳ"],
  },
};

detailProjects["6a17d9d1820432c45fd474fa"] = detailProjects["buoi-da-xanh-song-xoai"];
detailProjects["6a181aa6820432c45fd47f26"] = detailProjects["sua-chua-ong-nhiem"];
detailProjects["6a181aa6820432c45fd47f27"] = detailProjects["mat-ong-du-wins-farm"];

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

function calculateCredits(project, amount) {
  const value = Number(amount || 0) * Number(project.unitPrice || CREDIT_VALUE);
  return Math.ceil(value / CREDIT_VALUE);
}

function renderCreditLine(project, amount) {
  const credits = calculateCredits(project, amount);
  const value = Number(amount || 0) * Number(project.unitPrice || CREDIT_VALUE);
  return `${credits.toLocaleString("vi-VN")} Agricoin - ${currency.format(value)}`;
}

function calculateOrderValue(project, amount) {
  return Number(amount || 0) * Number(project.unitPrice || CREDIT_VALUE);
}

function formatCreditRatio(value) {
  const credits = Number(value || CREDIT_VALUE) / CREDIT_VALUE;
  return credits.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

function parseCustomQuantity(value) {
  const normalized = String(value || "")
    .replace(/\./g, "")
    .replace(",", ".")
    .match(/\d+(\.\d+)?/);

  return normalized ? Number(normalized[0]) : 0;
}

async function resolveBackendProjectId(projectSlug) {
  const response = await fetch(`${API_BASE_URL}/projects/${encodeURIComponent(projectSlug)}`);
  const data = await response.json();

  if (!response.ok || !data.success || !data.project?._id) {
    throw new Error(data.message || "Chưa tìm thấy sản phẩm này trong database. Vui lòng seed/cập nhật dự án ở backend.");
  }

  return data.project._id;
}

function renderCertificateCard(project) {
  if (!project.certificateImages?.length) {
    return `
      <article class="detail-card placeholder-card">
        <span>Ô cập nhật</span>
        <h2>Giấy kiểm định chất lượng</h2>
        <p>${project.certificateStatus}</p>
        <div class="empty-upload-slot">Chưa có file kiểm định</div>
      </article>
    `;
  }

  return `
    <article class="detail-card placeholder-card certificate-card">
      <span>Đã cập nhật</span>
      <h2>Giấy kiểm định chất lượng</h2>
      <p>${project.certificateStatus}</p>
      <div class="certificate-gallery">
        ${project.certificateImages
          .map(
            (item) => `
              <a class="certificate-item" href="${item.src}" target="_blank" rel="noreferrer">
                <img src="${item.src}" alt="${item.title}" />
                <strong>${item.title}</strong>
                <small>${item.caption}</small>
              </a>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderFarmerCard(project) {
  const profile = project.farmerProfile;

  if (!profile) {
    return `
      <article class="detail-card placeholder-card">
        <span>Ô cập nhật</span>
        <h2>Thông tin Chủ vườn</h2>
        <p>${project.farmerInfo}</p>
        <div class="empty-upload-slot">Chưa có hồ sơ chi tiết</div>
      </article>
    `;
  }

  const profileRows = [
    ["Tên thương hiệu", profile.brand],
    ["Vai trò", profile.role],
    ["Số điện thoại", profile.phone, profile.phone ? `tel:${profile.phone.replace(/\s+/g, "")}` : ""],
    ["Gmail", profile.email, profile.email ? `mailto:${profile.email}` : ""],
    ["Website", profile.website ? "Mở website" : "", profile.website],
    ["Fanpage", profile.fanpage ? "Xem fanpage" : "", profile.fanpage],
    ["Địa chỉ", profile.address],
  ].filter(([, value]) => value);

  return `
    <article class="detail-card placeholder-card farmer-profile-card">
      <span>Chủ vườn tâm huyết</span>
      <h2>${profile.owner}</h2>
      <p>${project.farmerInfo}</p>
      <div class="farmer-profile-grid">
        ${profileRows
          .map(
            ([label, value, href]) => `
              <div>
                <span>${label}</span>
                <strong>${href ? `<a href="${href}" target="${href.startsWith("http") ? "_blank" : "_self"}" rel="noreferrer">${value}</a>` : value}</strong>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderFarmExperience(project) {
  if (!project.farmTour) {
    return `
      <article class="detail-card">
        <p class="eyebrow">Trải nghiệm farm</p>
        <h2>${project.farmExperience}</h2>
        <div class="farm-photo-grid">
          <div>Ảnh trải nghiệm 1</div>
          <div>Ảnh trải nghiệm 2</div>
          <div>Ảnh trải nghiệm 3</div>
        </div>
      </article>
    `;
  }

  const heroLabel = project.farmTour.heroLabel || "Nhận sản phẩm tại farm";
  const heroSummary = project.farmTour.heroSummary || project.farmExperience;

  return `
    <article class="detail-card farm-tour-card">
      <p class="eyebrow">Trải nghiệm farm cuối vụ</p>
      <h2>${project.farmTour.title}</h2>
      <p>${project.farmTour.subtitle}</p>
      <div class="farm-tour-hero">
        <img src="${project.image}" alt="${project.farmTour.title}" />
        <div>
          <span>${heroLabel}</span>
          <strong>${heroSummary}</strong>
        </div>
      </div>
      <div class="farm-tour-layout">
        <div>
          <h3>Du khách</h3>
          <ol class="tour-step-list">
            ${project.farmTour.guestSteps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
        <div>
          <h3>Nhà vườn</h3>
          <ol class="tour-step-list">
            ${project.farmTour.farmerSteps.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
      </div>
    </article>
  `;
}

function getOrderFlowCopy(project) {
  const flows = {
    "buoi-da-xanh-song-xoai": {
      homeTitle: "Nhận bưởi tại nhà",
      homeDescription: "AgriShare xác nhận sản lượng bưởi, lịch thu hoạch và địa chỉ giao theo mùa vụ.",
      tourTitle: "Đăng ký Farm tour vườn bưởi",
      tourDescription: "Đến vườn bưởi Sông Xoài, tham quan lô theo dõi và nhận bưởi tại farm.",
      guestLabel: "Số lượng khách tham quan vườn bưởi",
      dateLabel: "Ngày muốn đến vườn bưởi",
      notePlaceholder: "VD: muốn nhận bưởi tại nhà hay đi farm tour cùng gia đình...",
    },
    "gao-tam-a": {
      homeTitle: "Nhận gạo tại nhà",
      homeDescription: "AgriShare xác nhận số kg gạo, lịch đóng gói và lịch giao theo đợt.",
      tourTitle: "Đăng ký Farm tour ruộng lúa",
      tourDescription: "Tham quan ruộng/lô gạo, theo dõi khâu thu hoạch hoặc đóng gói và nhận gạo.",
      guestLabel: "Số lượng khách tham quan ruộng lúa",
      dateLabel: "Ngày muốn tham quan ruộng/điểm sản xuất",
      notePlaceholder: "VD: muốn chia gạo thành nhiều đợt giao hoặc nhận tại điểm sản xuất...",
    },
    "mat-ong-du-wins-farm": {
      homeTitle: "Nhận mật ong tại nhà",
      homeDescription: "AgriShare xác nhận số lít mật, lô khai thác và lịch giao sản phẩm.",
      tourTitle: "Đăng ký Farm tour ong dú",
      tourDescription: "Tham quan mô hình ong dú Win's Farm, quan sát tổ ong và nhận tổ/mật theo đợt khai thác.",
      guestLabel: "Số lượng khách tham quan farm ong dú",
      dateLabel: "Ngày muốn tham quan farm ong dú",
      notePlaceholder: "VD: muốn nhận mật theo chai, nhận tổ ong dú hoặc đi farm tour theo nhóm...",
    },
    "sua-chua-ong-nhiem": {
      homeTitle: "Nhận sữa chua tại nhà",
      homeDescription: "AgriShare xác nhận số thùng, lịch mẻ sản xuất và lịch giao lạnh phù hợp.",
      tourTitle: "Đăng ký Farm tour điểm sản xuất",
      tourDescription: "Tham quan quy trình làm sữa chua, theo dõi mẻ sản xuất và nhận mẻ sữa chua tươi.",
      guestLabel: "Số lượng khách tham quan điểm sản xuất",
      dateLabel: "Ngày muốn tham quan điểm sản xuất",
      notePlaceholder: "VD: muốn nhận mẻ sữa chua theo tuần hoặc đăng ký tham quan cùng gia đình...",
    },
  };

  return flows[project.id] || {
    homeTitle: "Nhận sản phẩm tại nhà",
    homeDescription: "AgriShare xác nhận sản lượng, lịch bàn giao và địa chỉ nhận sản phẩm.",
    tourTitle: "Đăng ký Farm tour",
    tourDescription: project.farmExperience,
    guestLabel: "Số lượng khách tham quan",
    dateLabel: "Ngày muốn đăng ký",
    notePlaceholder: "Số lượng muốn đặt, nhận hàng tại nhà hay trải nghiệm farm...",
  };
}

function renderOrderConfirmation(project) {
  const copy = getOrderFlowCopy(project);
  const firstOption = project.quantityOptions[0];
  const firstOrderValue = calculateOrderValue(project, firstOption.amount);

  return `
    <section class="detail-card order-flow-card" id="orderConfirm">
      <div class="order-flow-head">
        <p class="eyebrow">Cách nhận giá trị</p>
        <h2>Chọn cách nhận trước khi xác nhận đơn ${project.name}.</h2>
        <p>Người tiêu dùng thông thái có thể nhận sản phẩm tại nhà hoặc đăng ký trải nghiệm farm tour theo đặc thù từng sản phẩm.</p>
      </div>

      <form
        class="detail-interest-form order-confirmation-form"
        data-current-fulfillment="home"
        data-project-slug="${project.id}"
        data-unit-price="${project.unitPrice || CREDIT_VALUE}"
        data-selected-quantity="${firstOption.label}"
        data-selected-order-value="${firstOrderValue}"
      >
        <input type="hidden" name="product" value="${project.name}" />
        <input type="hidden" name="fulfillment" value="home" />

        <div class="checkout-layout">
          <div class="checkout-main">
            <div class="checkout-section">
              <div class="checkout-section-heading">
                <span>01</span>
                <div>
                  <h3>Chọn cách nhận</h3>
                  <p>Chọn nhận tại nhà hoặc đăng ký farm tour trước khi xác nhận đơn.</p>
                </div>
              </div>
              <div class="fulfillment-choice" role="radiogroup" aria-label="Chọn cách nhận sản phẩm">
                <button class="fulfillment-option active" type="button" data-fulfillment="home" aria-pressed="true">
                  <span>Nhận sản phẩm tại nhà</span>
                  <strong>${copy.homeTitle}</strong>
                  <small>${copy.homeDescription}</small>
                </button>
                <button class="fulfillment-option" type="button" data-fulfillment="farm" aria-pressed="false">
                  <span>Đăng ký Farm tour</span>
                  <strong>${copy.tourTitle}</strong>
                  <small>${copy.tourDescription}</small>
                </button>
              </div>
            </div>

            <div class="checkout-section">
              <div class="checkout-section-heading">
                <span>02</span>
                <div>
                  <h3>Thông tin khách hàng</h3>
                  <p>AgriShare dùng thông tin này để tư vấn, xác nhận thanh toán và lịch nhận sản phẩm.</p>
                </div>
              </div>
              <div class="order-form-grid">
                <label>
                  Tên khách hàng
                  <input name="customerName" type="text" placeholder="Nguyễn Văn A" required />
                </label>
                <label>
                  Số điện thoại
                  <input name="phone" type="tel" placeholder="090..." required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" placeholder="email@example.com" required />
                </label>
                <label>
                  Địa chỉ nhận sản phẩm
                  <input name="address" type="text" placeholder="Số nhà, phường/xã, tỉnh/thành" />
                </label>
              </div>
            </div>

            <div class="farm-tour-fields" hidden>
              <div class="checkout-section">
                <div class="checkout-section-heading">
                  <span>03</span>
                  <div>
                    <h3>Thông tin Farm tour</h3>
                    <p>Chỉ cần điền khi khách chọn đăng ký trải nghiệm tại farm.</p>
                  </div>
                </div>
                <div class="order-form-grid">
                  <label>
                    ${copy.guestLabel}
                    <input name="guestCount" type="number" min="1" max="50" placeholder="VD: 4" />
                  </label>
                  <label>
                    ${copy.dateLabel}
                    <input name="farmDate" type="date" />
                  </label>
                </div>
              </div>
            </div>

            <div class="checkout-section">
              <div class="checkout-section-heading">
                <span>04</span>
                <div>
                  <h3>Ghi chú cho AgriShare</h3>
                  <p>Thêm nhu cầu nhận hàng, thời gian liên hệ hoặc yêu cầu riêng nếu có.</p>
                </div>
              </div>
              <label>
                Ghi chú cho AgriShare
                <textarea name="note" rows="3" placeholder="${copy.notePlaceholder}"></textarea>
              </label>
            </div>
          </div>

          <aside class="order-sidebar" aria-label="Tóm tắt đơn Agricoin">
            <div class="order-sidebar-title">
              <span class="order-cart-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="20" r="1.6" />
                  <circle cx="18" cy="20" r="1.6" />
                  <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6.1" />
                </svg>
              </span>
              <div>
                <h3>Đơn Agricoin của bạn</h3>
                <p>1 sản phẩm</p>
              </div>
            </div>
            <div class="order-product-preview">
              <img src="${project.image}" alt="${project.name}" />
              <div>
                <strong>${project.name}</strong>
                <span>${currency.format(project.unitPrice || CREDIT_VALUE)} / ${project.unitLabel || project.category}</span>
              </div>
            </div>
            <div class="order-summary-strip">
              <div>
                <span>Sản phẩm</span>
                <strong>${project.name}</strong>
              </div>
              <div>
                <span>Sản lượng đã chọn</span>
                <strong id="orderQuantity">${firstOption.label}</strong>
              </div>
              <div>
                <span>Agricoin dự kiến</span>
                <strong id="orderCredit">${renderCreditLine(project, firstOption.amount)}</strong>
              </div>
            </div>
            <p class="order-assurance">Sau khi gửi đơn, AgriShare tạo mã đơn để khách tra cứu thanh toán, lịch nhận hàng và nhật ký mùa vụ.</p>
            <button class="primary-button order-submit-button" type="submit">Xác nhận đơn ${project.name}</button>
            <p class="form-status" role="status"></p>
          </aside>
        </div>
      </form>
    </section>
  `;
}

function renderInterestForm(buttonLabel) {
  return `
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
      <button class="primary-button" type="submit">${buttonLabel}</button>
      <p class="form-status" role="status"></p>
    </form>
  `;
}

function renderProject(project) {
  const producerUrl = project.facebookUrl || project.website;

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
          <a class="primary-button" href="#investmentOrder">Chọn Agricoin mùa vụ</a>
          ${producerUrl ? `<a class="secondary-button" href="${producerUrl}" target="_blank" rel="noreferrer">Xem kênh Chủ vườn</a>` : ""}
        </div>
      </article>
    </section>

    <section class="detail-grid">
      ${renderCertificateCard(project)}
      ${renderFarmerCard(project)}
    </section>

    <section class="detail-card credit-explainer">
      <div>
        <p class="eyebrow">Cơ chế Agricoin</p>
        <h2>1 Agricoin = ${currency.format(CREDIT_VALUE)}</h2>
        <p>${project.investmentIntro} Gói đầu tư tối thiểu bắt đầu từ 10 Agricoin = ${currency.format(CREDIT_VALUE * 10)}.</p>
      </div>
      <div class="credit-facts">
        <article>
          <span>Giá tham chiếu</span>
          <strong>${currency.format(project.unitPrice || CREDIT_VALUE)} / ${project.unitLabel || project.category}</strong>
        </article>
        <article>
          <span>Quy đổi mẫu</span>
          <strong>1 ${project.unitLabel || "đơn vị"} = ${formatCreditRatio(project.unitPrice || CREDIT_VALUE)} Agricoin</strong>
        </article>
        <article>
          <span>Giá trị nhận lại</span>
          <strong>Nông sản thật hoặc trải nghiệm farm</strong>
        </article>
      </div>
    </section>

    <section class="detail-two-column" id="investmentOrder">
      <article class="detail-card">
        <p class="eyebrow">Chọn Agricoin mùa vụ</p>
        <h2>Sản lượng đặt mua sẽ được quy đổi thành mảnh vườn theo dõi.</h2>
        <div class="quantity-grid">
          ${project.quantityOptions
            .map(
              (item, index) => `
                <button
                  class="quantity-option ${index === 0 ? "active" : ""}"
                  type="button"
                  data-quantity="${item.label}"
                  data-season="${item.seasonUnit}"
                  data-credit="${renderCreditLine(project, item.amount)}"
                  data-amount="${item.amount}"
                  data-order-value="${calculateOrderValue(project, item.amount)}"
                >
                  <strong>${item.label}</strong>
                  <span>${item.seasonUnit}</span>
                  <em>${renderCreditLine(project, item.amount)}</em>
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
          <p>${renderCreditLine(project, project.quantityOptions[0].amount)}. ${project.quantityOptions[0].seasonUnit}. Đây là cơ sở để AgriShare cập nhật nhật ký vườn cho người tiêu dùng thông thái.</p>
        </div>
      </article>

      ${renderFarmExperience(project)}
    </section>

    ${renderOrderConfirmation(project)}
  `;
}

detailRoot.addEventListener("click", (event) => {
  const option = event.target.closest(".quantity-option");
  if (option) {
    detailRoot.querySelectorAll(".quantity-option").forEach((item) => item.classList.toggle("active", item === option));
    const selectedSeason = detailRoot.querySelector("#selectedSeason");
    selectedSeason.innerHTML = `
      <span>Sản lượng đang chọn</span>
      <strong>${option.dataset.quantity}</strong>
      <p>${option.dataset.credit}. ${option.dataset.season}. Đây là cơ sở để AgriShare cập nhật nhật ký vườn cho người tiêu dùng thông thái.</p>
    `;

    const orderQuantity = detailRoot.querySelector("#orderQuantity");
    const orderCredit = detailRoot.querySelector("#orderCredit");
    const form = detailRoot.querySelector(".order-confirmation-form");
    if (orderQuantity) orderQuantity.textContent = option.dataset.quantity;
    if (orderCredit) orderCredit.textContent = option.dataset.credit;
    if (form) {
      form.dataset.selectedQuantity = option.dataset.quantity;
      form.dataset.selectedOrderValue = option.dataset.orderValue;
    }
    return;
  }

  const fulfillment = event.target.closest(".fulfillment-option");
  if (!fulfillment) return;

  const mode = fulfillment.dataset.fulfillment;
  detailRoot.querySelectorAll(".fulfillment-option").forEach((item) => {
    const isActive = item === fulfillment;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  const form = detailRoot.querySelector(".order-confirmation-form");
  const farmFields = detailRoot.querySelector(".farm-tour-fields");
  const hiddenInput = form?.querySelector('input[name="fulfillment"]');
  const guestInput = form?.querySelector('input[name="guestCount"]');
  const farmDateInput = form?.querySelector('input[name="farmDate"]');
  const isFarmTour = mode === "farm";

  if (form) form.dataset.currentFulfillment = mode;
  if (hiddenInput) hiddenInput.value = mode;
  if (farmFields) farmFields.hidden = !isFarmTour;
  if (guestInput) guestInput.required = isFarmTour;
  if (farmDateInput) farmDateInput.required = isFarmTour;
  if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
});

detailRoot.addEventListener("input", (event) => {
  const customQuantity = event.target.closest(".detail-input input");
  if (!customQuantity) return;

  const value = customQuantity.value.trim();
  const orderQuantity = detailRoot.querySelector("#orderQuantity");
  const orderCredit = detailRoot.querySelector("#orderCredit");

  if (!value) {
    const activeOption = detailRoot.querySelector(".quantity-option.active");
    if (orderQuantity && activeOption) orderQuantity.textContent = activeOption.dataset.quantity;
    if (orderCredit && activeOption) orderCredit.textContent = activeOption.dataset.credit;
    const form = detailRoot.querySelector(".order-confirmation-form");
    if (form && activeOption) {
      form.dataset.selectedQuantity = activeOption.dataset.quantity;
      form.dataset.selectedOrderValue = activeOption.dataset.orderValue;
    }
    return;
  }

  const form = detailRoot.querySelector(".order-confirmation-form");
  const customAmount = parseCustomQuantity(value);
  const unitPrice = Number(form?.dataset.unitPrice || CREDIT_VALUE);
  const orderValue = customAmount * unitPrice;

  if (orderQuantity) orderQuantity.textContent = value;
  if (orderCredit) {
    orderCredit.textContent = orderValue
      ? `${Math.ceil(orderValue / CREDIT_VALUE).toLocaleString("vi-VN")} Agricoin - ${currency.format(orderValue)}`
      : "AgriShare xác nhận theo số lượng tùy chọn";
  }
  if (form) {
    form.dataset.selectedQuantity = value;
    form.dataset.selectedOrderValue = String(orderValue || 0);
  }
});

detailRoot.addEventListener("submit", async (event) => {
  const form = event.target.closest(".detail-interest-form");
  if (!form) return;
  event.preventDefault();
  const status = form.querySelector(".form-status");
  if (form.classList.contains("order-confirmation-form")) {
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const isFarmTour = form.dataset.currentFulfillment === "farm";
    const orderValue = Number(form.dataset.selectedOrderValue || 0);

    if (!orderValue || orderValue < 1000000) {
      status.textContent = "Giá trị đơn tối thiểu là 10 Agricoin = 1.000.000đ. Vui lòng chọn sản lượng lớn hơn.";
      status.dataset.state = "error";
      return;
    }

    status.textContent = "Đang gửi đơn vào hệ thống AgriShare...";
    status.dataset.state = "";
    if (submitButton) submitButton.disabled = true;

    try {
      const backendProjectId = await resolveBackendProjectId(form.dataset.projectSlug);
      const quantityText = form.dataset.selectedQuantity || "Sản lượng tùy chọn";
      const deliveryNote = [
        `Sản lượng khách chọn: ${quantityText}`,
        formData.get("note"),
      ]
        .filter(Boolean)
        .join(" | ");

      const response = await fetch(`${API_BASE_URL}/checkout/investment-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: backendProjectId,
          packageKey: "custom",
          customAmount: orderValue,
          customer: {
            fullName: formData.get("customerName"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            address: formData.get("address"),
          },
          deliveryMethod: isFarmTour ? "farm_pickup" : "home_delivery",
          delivery: {
            address: formData.get("address"),
            preferredDate: isFarmTour ? formData.get("farmDate") : "",
            participants: isFarmTour ? Number(formData.get("guestCount") || 1) : 1,
            note: deliveryNote,
          },
          paymentMethod: "bank_transfer",
          note: deliveryNote,
          consentAccepted: true,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Không thể tạo đơn đầu tư");
      }

      status.textContent = "Đã tạo đơn. Đang chuyển sang trang xác nhận thanh toán...";
      status.dataset.state = "success";
      window.location.href = `thank-you.html?code=${encodeURIComponent(data.order.orderCode)}`;
    } catch (error) {
      status.textContent = error.message;
      status.dataset.state = "error";
      if (submitButton) submitButton.disabled = false;
    }
  } else {
    status.textContent = "Đã ghi nhận nhu cầu mẫu. Khi kết nối backend, form này sẽ lưu thành đơn tư vấn.";
    status.dataset.state = "success";
  }
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
