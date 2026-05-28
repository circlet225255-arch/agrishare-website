const projects = [
  {
    id: 1,
    name: "Vườn xoài Hòa Lộc An Giang",
    category: "Cây ăn trái",
    location: "An Giang",
    image: "assets/agrishare-concept-01.jpg",
    capital: 320000000,
    funded: 72,
    duration: "9 tháng",
    returnRate: "12-16%",
    risk: "Trung bình",
    tags: ["Camera", "GPS", "Escrow"],
    summary:
      "Tái canh tác 4ha xoài Hòa Lộc, tiêu chuẩn VietGAP, thu hoạch theo hợp đồng bán sỉ và kênh quà tặng doanh nghiệp.",
  },
  {
    id: 2,
    name: "Nhà kính rau sạch Đà Lạt",
    category: "Rau sạch",
    location: "Lâm Đồng",
    image: "assets/agrishare-concept-03.jpg",
    capital: 180000000,
    funded: 58,
    duration: "6 tháng",
    returnRate: "8-12%",
    risk: "Thấp",
    tags: ["Nhà kính", "QA/QC", "Nhật ký"],
    summary:
      "Mở rộng nhà kính rau ăn lá, có cảm biến độ ẩm, lịch giao hàng hằng tuần cho nhà hàng và người dùng thành thị.",
  },
  {
    id: 3,
    name: "Farmstay vườn trái cây Bến Tre",
    category: "Farmstay",
    location: "Bến Tre",
    image: "assets/agrishare-concept-02.jpg",
    capital: 520000000,
    funded: 31,
    duration: "12 tháng",
    returnRate: "14-20%",
    risk: "Cao",
    tags: ["Du lịch", "Nông sản", "Cộng đồng"],
    summary:
      "Kết hợp đầu tư vườn dừa, trái cây theo mùa và trải nghiệm lưu trú cuối tuần cho gia đình, doanh nghiệp.",
  },
  {
    id: 4,
    name: "Vườn bưởi hữu cơ miền Tây",
    category: "Cây ăn trái",
    location: "Vĩnh Long",
    image: "assets/agrishare-concept-01.jpg",
    capital: 260000000,
    funded: 84,
    duration: "8 tháng",
    returnRate: "10-14%",
    risk: "Trung bình",
    tags: ["Hữu cơ", "Truy xuất", "Bảo hiểm"],
    summary:
      "Đầu tư chăm sóc vườn bưởi đã vào giai đoạn cho trái, sản lượng dự kiến được bao tiêu một phần.",
  },
  {
    id: 5,
    name: "Tổ hợp tác rau thủy canh",
    category: "Rau sạch",
    location: "Đồng Nai",
    image: "assets/agrishare-concept-03.jpg",
    capital: 140000000,
    funded: 65,
    duration: "5 tháng",
    returnRate: "7-11%",
    risk: "Thấp",
    tags: ["Thủy canh", "Bán lẻ", "Đơn hàng"],
    summary:
      "Tài trợ vật tư và mở rộng kênh bán lẻ cho tổ hợp tác rau thủy canh gần khu đô thị.",
  },
  {
    id: 6,
    name: "Trang trại giáo dục trẻ em",
    category: "Farmstay",
    location: "Củ Chi",
    image: "assets/agrishare-concept-02.jpg",
    capital: 390000000,
    funded: 46,
    duration: "10 tháng",
    returnRate: "11-17%",
    risk: "Trung bình",
    tags: ["Giáo dục", "Trải nghiệm", "CSR"],
    summary:
      "Xây dựng khu trải nghiệm nông nghiệp cho trường học, kết hợp bán nông sản và gói CSR doanh nghiệp.",
  },
];

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const projectGrid = document.querySelector("#projectGrid");
const dialog = document.querySelector("#projectDialog");
const dialogContent = document.querySelector("#dialogContent");
const calculator = document.querySelector("#calculator");
const calcResults = document.querySelector("#calcResults");

function renderProjects(filter = "all") {
  const visibleProjects =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  projectGrid.innerHTML = visibleProjects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-image">
            <img src="${project.image}" alt="${project.name}" />
          </div>
          <div class="project-body">
            <div class="project-meta">
              <span>${project.category}</span>
              <span>${project.location}</span>
              <span>${project.risk}</span>
            </div>
            <h3>${project.name}</h3>
            <p>${project.summary}</p>
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
              Xem hồ sơ dự án
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function openProject(projectId) {
  const project = projects.find((item) => item.id === Number(projectId));
  if (!project) return;

  dialogContent.innerHTML = `
    <div class="dialog-cover">
      <img src="${project.image}" alt="${project.name}" />
    </div>
    <div class="dialog-body">
      <p class="eyebrow">${project.category} tại ${project.location}</p>
      <h3>${project.name}</h3>
      <p>${project.summary}</p>
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
      <a class="btn btn-primary" href="#calculator">Tính khoản đầu tư mẫu</a>
    </div>
  `;

  dialog.showModal();
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
  if (button) openProject(button.dataset.projectId);
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());

calculator.addEventListener("input", updateCalculator);

renderProjects();
updateCalculator();
