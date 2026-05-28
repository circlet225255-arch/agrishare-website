require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

const User = require('../models/User');
const Project = require('../models/Project');
const Customer = require('../models/Customer');
const InvestmentOrder = require('../models/InvestmentOrder');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const PlatformSetting = require('../models/PlatformSetting');

const shouldReset = process.argv.includes('--reset');

const createPackages = (category) => {
  const rewardMap = {
    'Bưởi da xanh': ['20-25kg bưởi da xanh loại 1', '45-55kg bưởi da xanh loại 1', '120-140kg bưởi da xanh loại 1'],
    Gạo: ['60-70kg gạo sạch', '130-150kg gạo sạch', '350-400kg gạo sạch'],
    'Mật ong dú': ['8-10 hũ mật ong dú', '18-22 hũ mật ong dú', '50-60 hũ mật ong dú'],
    'Sữa chua': ['80-100 hũ sữa chua', '180-220 hũ sữa chua', '500-560 hũ sữa chua'],
  };

  const rewards = rewardMap[category] || ['Sản phẩm theo mùa vụ', 'Sản phẩm ưu tiên', 'Sản phẩm premium'];

  return [
    {
      _id: new mongoose.Types.ObjectId(),
      key: 'goi-1',
      label: 'Gói 1',
      amount: 10000000,
      description: 'Gói đầu tư 10 triệu đồng',
      expectedReturn: 10,
      rewardDescription: rewards[0],
      deliveryForm: 'home_delivery',
      deliveryForms: ['home_delivery', 'farm_pickup'],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      key: 'goi-2',
      label: 'Gói 2',
      amount: 20000000,
      description: 'Gói đầu tư 20 triệu đồng',
      expectedReturn: 20,
      rewardDescription: rewards[1],
      deliveryForm: 'home_delivery',
      deliveryForms: ['home_delivery', 'farm_pickup'],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      key: 'goi-3',
      label: 'Gói 3',
      amount: 50000000,
      description: 'Gói đầu tư 50 triệu đồng',
      expectedReturn: 50,
      rewardDescription: rewards[2],
      deliveryForm: 'home_delivery',
      deliveryForms: ['home_delivery', 'farm_pickup'],
    },
    {
      _id: new mongoose.Types.ObjectId(),
      key: 'custom',
      label: 'Khác',
      amount: 0,
      isCustom: true,
      description: 'Tùy chọn đầu tư của khách hàng',
      expectedReturn: 0,
      rewardDescription: 'Sản phẩm được quy đổi theo giá trị đầu tư thực tế',
      deliveryForm: 'home_delivery',
      deliveryForms: ['home_delivery', 'farm_pickup'],
    },
  ];
};

const seedDatabase = async () => {
  try {
    const connection = await connectDB();

    if (!connection) {
      throw new Error('Không thể seed vì MongoDB chưa kết nối');
    }

    console.log('🌱 Seeding database...');

    if (shouldReset) {
      await User.deleteMany({});
      await Project.deleteMany({});
      await Customer.deleteMany({});
      await InvestmentOrder.deleteMany({});
      await AnalyticsEvent.deleteMany({});
      await PlatformSetting.deleteMany({});
      console.log('🗑️  Đã xóa dữ liệu cũ vì có tham số --reset');
    }

    const userSeeds = [
      {
        email: 'farmer1@agrishare.com',
        password: 'password123',
        fullName: 'Trần Văn Nông',
        phone: '0901234567',
        role: 'farmer',
        kyc: {
          status: 'verified',
          identityNumber: '123456789',
          verifiedAt: new Date(),
        },
      },
      {
        email: 'investor1@agrishare.com',
        password: 'password123',
        fullName: 'Nguyễn Văn A',
        phone: '0987654321',
        role: 'investor',
        wallet: {
          balance: 1000000000,
          currency: 'VND',
          accountNumber: '123456789',
          bankName: 'Vietcombank',
        },
        kyc: {
          status: 'verified',
          identityNumber: '987654321',
          verifiedAt: new Date(),
        },
      },
      {
        email: 'admin@agrishare.com',
        password: 'admin123',
        fullName: 'Admin AgriShare',
        phone: '0905555555',
        role: 'admin',
      },
      {
        email: 'sale@agrishare.com',
        password: 'sale123',
        fullName: 'Sale AgriShare',
        phone: '0906666666',
        role: 'sale',
      },
      {
        email: 'farm@agrishare.com',
        password: 'farm123',
        fullName: 'Vận hành Farm AgriShare',
        phone: '0907777777',
        role: 'farm',
      },
      {
        email: 'auditor@agrishare.com',
        password: 'audit123',
        fullName: 'QA Auditor AgriShare',
        phone: '0908888888',
        role: 'auditor',
      },
    ];

    let createdUsers = 0;

    for (const userData of userSeeds) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        createdUsers += 1;
      }
    }

    const farmer = await User.findOne({ email: 'farmer1@agrishare.com' });

    const sampleProjects = [
      {
        name: 'Bưởi da xanh Sông Xoài',
        slug: 'buoi-da-xanh-song-xoai',
        description: 'Đầu tư chăm sóc vùng bưởi da xanh Sông Xoài, duy trì chất lượng mùa vụ ổn định và kiểm soát đầu ra minh bạch.',
        shortDescription: 'Vùng bưởi da xanh ổn định chất lượng, phù hợp khách muốn nhận sản phẩm theo mùa vụ.',
        farmerStory: 'Nhà vườn Sông Xoài tập trung kiểm soát chất lượng trái, lịch chăm sóc và đầu ra để khách hàng có thể theo dõi từng mốc mùa vụ.',
        riskDisclosure: 'Rủi ro chính gồm thời tiết, sâu bệnh và biến động sản lượng. AgriShare theo dõi bằng nhật ký mùa vụ, QA/QC và kế hoạch bàn giao sản phẩm theo thực tế thu hoạch.',
        producer: 'HTX Bưởi da xanh Sông Xoài',
        logo: 'assets/logo-buoi-song-xoai.jpg',
        facebookUrl: 'https://facebook.com/htxbuoidaxanhsongxoaitanthanh?mibextid=wwXIfr&rdid=FnB3W6UFXdJYiR2T&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1bZEJ69iCj%2F%3Fmibextid%3DwwXIfr',
        productIntro: 'Bưởi da xanh vùng Sông Xoài, định hướng chất lượng ổn định, trái đẹp, phù hợp làm quà biếu và tiêu dùng gia đình.',
        highlights: ['Vườn chuyên canh', 'Trái tuyển chọn', 'Theo dõi mùa vụ', 'Truy xuất lô'],
        qualityNotes: 'Ưu tiên lô trái đồng đều, vỏ xanh, tép mọng, vị ngọt thanh; lịch giao theo mùa thu hoạch thực tế.',
        specs: {
          packaging: 'Thùng 5-10kg, phân loại theo size và độ đồng đều của trái',
          referencePrice: 'Theo giá mùa vụ tại thời điểm xác nhận đơn',
          shelfLife: '7-14 ngày tùy độ chín và điều kiện bảo quản',
          storage: 'Để nơi khô mát, tránh nắng trực tiếp, không xếp đè mạnh',
          deliveryPlan: 'Giao theo đợt thu hoạch, ưu tiên khách đã xác nhận thanh toán',
          returnPolicy: 'Đổi/bù nếu trái dập hỏng do vận chuyển hoặc sai quy cách đã xác nhận',
        },
        farmerId: farmer._id,
        category: 'Bưởi da xanh',
        location: { province: 'Bà Rịa - Vũng Tàu', district: 'Sông Xoài', coordinates: { lat: 10.68, lng: 107.15 } },
        images: ['assets/product-buoi-song-xoai.png'],
        capitalRequired: 260000000,
        funded: 218400000,
        fundingPercentage: 84,
        duration: '8 tháng',
        expectedReturnRate: '10-14%',
        riskLevel: 'Ổn định chất lượng',
        tags: ['Chất lượng', 'Mùa vụ ổn định', 'Ổn định chất lượng'],
        status: 'funding',
        faq: [
          { question: 'Khi nào nhận sản phẩm?', answer: 'AgriShare xác nhận lịch theo mốc thu hoạch thực tế của vườn.' },
          { question: 'Có thể đến farm không?', answer: 'Có, khách có thể chọn trải nghiệm và nhận sản phẩm tại farm.' },
        ],
      },
      {
        name: 'Gạo Tám Á',
        slug: 'gao-tam-a',
        description: 'Đầu tư mùa vụ gạo Tám Á, theo dõi nguồn cung, kiểm soát đóng gói và nhận sản phẩm gạo sạch theo lịch.',
        shortDescription: 'Gạo ngon hằng ngày, đóng gói sạch, phù hợp gia đình và nhận định kỳ.',
        farmerStory: 'Gạo Tám Á được đưa vào AgriShare như một sản phẩm nông sản thiết yếu, dễ theo dõi đầu ra và phù hợp mô hình nhận sản phẩm theo đợt.',
        riskDisclosure: 'Rủi ro chính gồm biến động mùa vụ, độ mới của gạo và chi phí đóng gói/giao nhận. AgriShare kiểm soát bằng lịch nhận hàng, nhật ký nguồn cung và phản hồi chất lượng.',
        producer: 'Gạo Tám Á',
        logo: 'assets/logo-gao-tam-a.jpg',
        facebookUrl: 'https://www.facebook.com/profile.php?id=61565116450494',
        productIntro: 'Gạo Tám Á hướng tới nhóm khách cần nguồn gạo ngon, ổn định, đóng gói sạch và có câu chuyện vùng trồng rõ ràng.',
        highlights: ['Gạo ngon hằng ngày', 'Đóng gói sạch', 'Nguồn cung ổn định', 'Phù hợp gia đình'],
        qualityNotes: 'Ưu tiên lô gạo mới, hạt đều, mùi thơm tự nhiên; sản phẩm có thể chia nhiều đợt giao để giữ độ tươi.',
        specs: {
          packaging: 'Túi 5kg hoặc 10kg, đóng gói sạch và niêm phong',
          referencePrice: 'Theo bảng giá lô gạo tại thời điểm xác nhận đơn',
          shelfLife: '3-6 tháng trong điều kiện bảo quản khô mát',
          storage: 'Để nơi thoáng, tránh ẩm, đóng kín sau khi mở túi',
          deliveryPlan: 'Có thể chia nhiều đợt giao để giữ độ mới của gạo',
          returnPolicy: 'Đổi/bù nếu bao bì rách, ẩm mốc hoặc sản phẩm không đúng lô đã xác nhận',
        },
        farmerId: farmer._id,
        category: 'Gạo',
        location: { province: 'Việt Nam', district: 'Tám Á', coordinates: { lat: 10.77, lng: 106.7 } },
        images: ['assets/product-gao-tam-a.png'],
        capitalRequired: 180000000,
        funded: 104400000,
        fundingPercentage: 58,
        duration: '6 tháng',
        expectedReturnRate: '8-12%',
        riskLevel: 'Thấp',
        tags: ['Gạo ngon', 'Đóng gói sạch', 'Nguồn cung ổn định'],
        status: 'funding',
      },
      {
        name: "Mật ong dú Win's Farm",
        slug: 'mat-ong-du-wins-farm',
        description: "Đầu tư vùng khai thác mật ong dú Win's Farm, kiểm soát sản lượng theo đợt và đóng gói thành phẩm minh bạch.",
        shortDescription: 'Mật ong dú đặc sản, sản lượng giới hạn, phù hợp quà tặng sức khỏe.',
        farmerStory: "Win's Farm phát triển mật ong dú như một dòng sản phẩm đặc sản có câu chuyện khai thác theo đợt và cần kiểm soát chất lượng chặt.",
        riskDisclosure: 'Rủi ro chính gồm sản lượng giới hạn, thời tiết và thời điểm khai thác. AgriShare theo dõi bằng nhật ký farm, ảnh minh chứng và kế hoạch đóng gói.',
        producer: "Mật ong dú Win's Farm",
        logo: 'assets/logo-mat-ong-du-wins-farm.jpg',
        facebookUrl: 'https://www.facebook.com/profile.php?id=61587362812412',
        productIntro: "Mật ong dú Win's Farm là dòng đặc sản có sản lượng giới hạn, phù hợp quà tặng sức khỏe và trải nghiệm nông nghiệp bản địa.",
        highlights: ['Mật ong dú', 'Sản lượng giới hạn', 'Quà tặng cao cấp', 'Khai thác theo đợt'],
        qualityNotes: 'Ưu tiên hũ mật trong, thơm, vị chua ngọt đặc trưng; cần kiểm soát thời điểm khai thác và bảo quản.',
        specs: {
          packaging: 'Hũ thủy tinh hoặc chai nhỏ, niêm phong theo lô khai thác',
          referencePrice: 'Theo sản lượng khai thác và quy cách đóng hũ thực tế',
          shelfLife: '12 tháng nếu bảo quản đúng điều kiện',
          storage: 'Đậy kín, để nơi khô mát, tránh nhiệt cao và ánh nắng trực tiếp',
          deliveryPlan: 'Giao theo đợt khai thác, số lượng có thể giới hạn theo mùa',
          returnPolicy: 'Đổi/bù nếu hũ vỡ, rò rỉ hoặc sai quy cách đóng gói đã xác nhận',
        },
        farmerId: farmer._id,
        category: 'Mật ong dú',
        location: { province: 'Việt Nam', district: "Win's Farm", coordinates: { lat: 10.03, lng: 105.78 } },
        images: ['assets/product-mat-ong-du-wins-farm.png'],
        capitalRequired: 520000000,
        funded: 161200000,
        fundingPercentage: 31,
        duration: '12 tháng',
        expectedReturnRate: '14-20%',
        riskLevel: 'Trung bình',
        tags: ['Mật ong dú', 'Đặc sản', 'Sản lượng giới hạn'],
        status: 'funding',
      },
      {
        name: 'Sữa chua Ông Nhiệm',
        slug: 'sua-chua-ong-nhiem',
        description: 'Đầu tư sản xuất và phân phối sữa chua Ông Nhiệm, nhận sản phẩm tươi theo đợt hoặc trải nghiệm tại điểm sản xuất.',
        shortDescription: 'Sữa chua tươi, dễ dùng, phù hợp nhận định kỳ cho gia đình và văn phòng.',
        farmerStory: 'Sữa chua Ông Nhiệm phù hợp mô hình bán hàng tươi, cần kiểm soát quy trình lạnh, hạn dùng và lịch giao theo đợt.',
        riskDisclosure: 'Rủi ro chính gồm bảo quản lạnh, hạn dùng ngắn và lịch giao nhận. AgriShare kiểm soát bằng quy trình giao định kỳ và phản hồi khách hàng.',
        producer: 'Sữa chua Ông Nhiệm',
        logo: 'assets/logo-sua-chua-ong-nhiem.jpg',
        facebookUrl: 'https://www.facebook.com/suabotuoiongnhiem/?locale=vi_VN',
        productIntro: 'Sữa chua Ông Nhiệm phù hợp mô hình nhận sản phẩm định kỳ, bán lẻ địa phương và quà tặng tươi cho gia đình/văn phòng.',
        highlights: ['Sữa chua tươi', 'Giao định kỳ', 'Sản phẩm dễ dùng', 'Phù hợp văn phòng'],
        qualityNotes: 'Ưu tiên quy trình lạnh, hạn dùng rõ ràng, giao theo đợt nhỏ để giữ chất lượng sản phẩm.',
        specs: {
          packaging: 'Hũ/cốc sữa chua theo lốc hoặc thùng, có ngày sản xuất và hạn dùng',
          referencePrice: 'Theo số lượng, vị sản phẩm và lịch giao đã xác nhận',
          shelfLife: 'Theo hạn dùng trên bao bì, ưu tiên dùng sớm sau khi nhận',
          storage: 'Bảo quản lạnh, tránh để ngoài nhiệt độ phòng quá lâu',
          deliveryPlan: 'Giao định kỳ theo tuần hoặc theo lịch đã hẹn với khách',
          returnPolicy: 'Đổi/bù nếu sản phẩm hỏng do giao nhận hoặc không đúng quy cách đã xác nhận',
        },
        farmerId: farmer._id,
        category: 'Sữa chua',
        location: { province: 'Việt Nam', district: 'Ông Nhiệm', coordinates: { lat: 10.82, lng: 106.63 } },
        images: ['assets/product-sua-chua-ong-nhiem.png'],
        capitalRequired: 140000000,
        funded: 91000000,
        fundingPercentage: 65,
        duration: '5 tháng',
        expectedReturnRate: '7-11%',
        riskLevel: 'Thấp',
        tags: ['Sữa chua tươi', 'Giao định kỳ', 'Bán lẻ'],
        status: 'funding',
      },
      {
        name: 'Cánh đồng gạo hữu cơ An Giang',
        slug: 'canh-dong-gao-huu-co-an-giang',
        description: 'Đầu tư mùa vụ gạo hữu cơ, theo dõi canh tác theo từng giai đoạn và kết nối đầu ra cho doanh nghiệp.',
        farmerId: farmer._id,
        category: 'Gạo',
        location: { province: 'An Giang', district: 'Châu Phú', coordinates: { lat: 10.58, lng: 105.18 } },
        images: ['assets/agrishare-concept-02.jpg'],
        capitalRequired: 390000000,
        funded: 179400000,
        fundingPercentage: 46,
        duration: '10 tháng',
        expectedReturnRate: '11-17%',
        riskLevel: 'Trung bình',
        tags: ['Hữu cơ', 'Mùa vụ', 'CSR'],
        status: 'funding',
      },
    ];

    for (const project of sampleProjects) {
      await Project.findOneAndUpdate(
        { name: project.name },
        { ...project, investmentPackages: createPackages(project.category) },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      );
    }

    await Project.updateMany(
      {
        name: {
          $nin: ['Bưởi da xanh Sông Xoài', 'Gạo Tám Á', "Mật ong dú Win's Farm", 'Sữa chua Ông Nhiệm'],
        },
        status: { $in: ['funding', 'active', 'ongoing'] },
      },
      { $set: { status: 'drafting' } },
    );

    await PlatformSetting.findOneAndUpdate(
      { key: 'default' },
      {
        key: 'default',
        payment: {
          bankName: 'Cấu hình trong Admin',
          bankCode: '',
          accountNumber: '',
          accountName: 'AGRISHARE',
          transferPrefix: 'AGS',
          vietQrEnabled: true,
        },
        marketing: {
          hotline: '',
          zaloUrl: '',
        },
        legal: {
          termsVersion: 'MVP-2026',
          privacyVersion: 'MVP-2026',
          riskVersion: 'MVP-2026',
          ecommerceNoticeStatus: 'preparing',
        },
        operations: {
          defaultDeliveryProvider: 'Tự vận hành',
          supportEmail: '',
          businessAddress: 'Cập nhật trong Admin',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    console.log(`✅ Users created/skipped: ${createdUsers}/${userSeeds.length}`);
    console.log(`✅ Projects upserted/updated: ${sampleProjects.length}`);
    console.log('\nSample credentials:');
    console.log('Farmer:   farmer1@agrishare.com / password123');
    console.log('Investor: investor1@agrishare.com / password123');
    console.log('Admin:    admin@agrishare.com / admin123');
    console.log('Sale:     sale@agrishare.com / sale123');
    console.log('Farm:     farm@agrishare.com / farm123');
    console.log('Auditor:  auditor@agrishare.com / audit123');
    console.log('\n✨ Database seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
