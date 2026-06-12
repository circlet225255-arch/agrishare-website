# Thiết Kế Database MongoDB - AgriShare Platform

## Mục Tiêu
AgriShare là nền tảng marketplace đầu tư nông nghiệp kết nối nông dân, nhà đầu tư, người tiêu dùng, đơn vị kiểm định và cộng đồng. Database MongoDB được thiết kế để quản lý:
- Người dùng và xác thực
- Dự án đầu tư nông nghiệp
- Danh mục đầu tư
- Giao dịch và thanh toán
- QA/QC và truy xuất sản phẩm
- Quản lý rủi ro (escrow)
- Báo cáo tiến độ dự án

---

## Kiến Trúc Collections

### 1. **users** - Quản Lý Người Dùng

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { bsonType: "string" },
        password: { bsonType: "string" }, // hashed
        fullName: { bsonType: "string" },
        phone: { bsonType: "string" },
        role: { 
          enum: ["investor", "farmer", "consumer", "auditor", "community", "admin"]
        },
        avatar: { bsonType: "string" }, // URL
        kyc: {
          bsonType: "object",
          properties: {
            status: { enum: ["pending", "verified", "rejected"] },
            identityNumber: { bsonType: "string" },
            verifiedAt: { bsonType: "date" },
            documents: { bsonType: "array" }
          }
        },
        wallet: {
          bsonType: "object",
          properties: {
            balance: { bsonType: "double" },
            currency: { bsonType: "string" },
            accountNumber: { bsonType: "string" },
            bankName: { bsonType: "string" }
          }
        },
        preferences: {
          bsonType: "object",
          properties: {
            categories: { bsonType: "array" },
            riskLevel: { enum: ["low", "medium", "high"] },
            notifications: { bsonType: "bool" }
          }
        },
        status: { enum: ["active", "suspended", "inactive"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 2. **projects** - Dự Án Đầu Tư

```javascript
db.createCollection("projects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "farmerId", "category", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        farmerId: { bsonType: "objectId" }, // reference to users
        category: { 
          enum: ["Gạo", "Mật ong dú", "Bưởi da xanh", "Rau sạch", "Cà phê", "Sữa"]
        },
        location: {
          bsonType: "object",
          properties: {
            province: { bsonType: "string" },
            district: { bsonType: "string" },
            coordinates: {
              bsonType: "object",
              properties: {
                lat: { bsonType: "double" },
                lng: { bsonType: "double" }
              }
            }
          }
        },
        images: {
          bsonType: "array",
          items: { bsonType: "string" }
        },
        capitalRequired: { bsonType: "double" }, // tổng vốn cần
        funded: { bsonType: "double" }, // tổng vốn đã gây quỹ
        fundingPercentage: { bsonType: "int" },
        investmentPackages: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              packageId: { bsonType: "objectId" },
              amount: { bsonType: "double" },
              description: { bsonType: "string" },
              expectedReturn: { bsonType: "double" }, // sản lượng/sản phẩm nhận
              deliveryForm: { enum: ["home_delivery", "farm_pickup"] }
            }
          }
        },
        duration: { bsonType: "string" }, // "6 tháng", "12 tháng"
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
        expectedReturnRate: { bsonType: "string" }, // "8-12%"
        riskLevel: { enum: ["Thấp", "Trung bình", "Cao", "Ổn định chất lượng"] },
        tags: { 
          bsonType: "array",
          items: { bsonType: "string" }
        },
        status: { 
          enum: ["drafting", "active", "funding", "ongoing", "harvest", "completed", "failed"]
        },
        qa_qc: {
          bsonType: "object",
          properties: {
            auditerId: { bsonType: "objectId" },
            status: { enum: ["pending", "passed", "failed"] },
            reports: { bsonType: "array" }
          }
        },
        metrics: {
          bsonType: "object",
          properties: {
            expectedYield: { bsonType: "double" }, // sản lượng dự kiến
            actualYield: { bsonType: "double" }, // sản lượng thực tế
            qualityScore: { bsonType: "double" } // điểm chất lượng
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 3. **investments** - Quản Lý Danh Mục Đầu Tư

```javascript
db.createCollection("investments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["investorId", "projectId", "packageId", "amount", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        investorId: { bsonType: "objectId" }, // reference to users
        projectId: { bsonType: "objectId" }, // reference to projects
        packageId: { bsonType: "objectId" },
        amount: { bsonType: "double" }, // số tiền đầu tư
        status: { 
          enum: ["pending", "confirmed", "escrow", "earning", "completed", "cancelled"]
        },
        investmentDate: { bsonType: "date" },
        expectedReturnDate: { bsonType: "date" },
        actualReturnDate: { bsonType: "date" },
        returnAmount: { bsonType: "double" }, // số tiền/sản phẩm nhận được
        returnForm: { enum: ["cash", "product", "mixed"] },
        escrowInfo: {
          bsonType: "object",
          properties: {
            escrowId: { bsonType: "objectId" },
            holdAmount: { bsonType: "double" },
            releaseDate: { bsonType: "date" },
            conditions: { bsonType: "array" }
          }
        },
        documents: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { enum: ["contract", "receipt", "delivery_proof"] },
              url: { bsonType: "string" },
              uploadedAt: { bsonType: "date" }
            }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 4. **transactions** - Ghi Chép Giao Dịch

```javascript
db.createCollection("transactions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "amount", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        type: { 
          enum: ["deposit", "withdrawal", "investment", "return", "fee", "refund"]
        },
        amount: { bsonType: "double" },
        currency: { bsonType: "string" },
        status: { enum: ["pending", "processing", "completed", "failed", "cancelled"] },
        description: { bsonType: "string" },
        relatedInvestmentId: { bsonType: "objectId" },
        paymentMethod: {
          bsonType: "object",
          properties: {
            method: { enum: ["bank_transfer", "e_wallet", "credit_card"] },
            provider: { bsonType: "string" },
            reference: { bsonType: "string" }
          }
        },
        fees: { bsonType: "double" },
        receiptUrl: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        completedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 5. **escrows** - Quản Lý Tiền Ký Quỹ

```javascript
db.createCollection("escrows", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["investmentId", "amount", "status", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        investmentId: { bsonType: "objectId" },
        projectId: { bsonType: "objectId" },
        investorId: { bsonType: "objectId" },
        farmerId: { bsonType: "objectId" },
        amount: { bsonType: "double" },
        status: { enum: ["held", "released", "returned", "dispute"] },
        releaseConditions: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              condition: { bsonType: "string" },
              verified: { bsonType: "bool" },
              verifiedBy: { bsonType: "objectId" },
              verifiedAt: { bsonType: "date" }
            }
          }
        },
        heldAt: { bsonType: "date" },
        releaseDate: { bsonType: "date" },
        releaseReason: { bsonType: "string" },
        dispute: {
          bsonType: "object",
          properties: {
            reason: { bsonType: "string" },
            raisedBy: { bsonType: "objectId" },
            status: { enum: ["open", "investigating", "resolved"] },
            resolution: { bsonType: "string" }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 6. **quality_audits** - Quản Lý QA/QC

```javascript
db.createCollection("quality_audits", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["projectId", "auditerId", "type", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        projectId: { bsonType: "objectId" },
        auditerId: { bsonType: "objectId" }, // reference to auditor user
        type: { enum: ["input_control", "production_monitoring", "output_quality", "traceability"] },
        status: { enum: ["pending", "in_progress", "completed", "rejected"] },
        auditDate: { bsonType: "date" },
        findings: {
          bsonType: "object",
          properties: {
            score: { bsonType: "double" }, // 0-100
            passed: { bsonType: "bool" },
            issues: { bsonType: "array" },
            recommendations: { bsonType: "array" }
          }
        },
        documents: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { bsonType: "string" },
              url: { bsonType: "string" }
            }
          }
        },
        photos: { bsonType: "array" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 7. **traceability** - Truy Xuất Sản Phẩm

```javascript
db.createCollection("traceability", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["projectId", "batchId", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        projectId: { bsonType: "objectId" },
        batchId: { bsonType: "string" }, // mã lô sản xuất
        productName: { bsonType: "string" },
        quantity: { bsonType: "double" },
        unit: { bsonType: "string" }, // kg, lít, v.v.
        harvestDate: { bsonType: "date" },
        processingDate: { bsonType: "date" },
        packagingDate: { bsonType: "date" },
        qualityMetrics: {
          bsonType: "object",
          properties: {
            moisture: { bsonType: "double" },
            purity: { bsonType: "double" },
            defects: { bsonType: "double" },
            certification: { bsonType: "string" } // "Organic", "Fair Trade"
          }
        },
        distribution: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              investorId: { bsonType: "objectId" },
              investmentId: { bsonType: "objectId" },
              quantity: { bsonType: "double" },
              deliveredAt: { bsonType: "date" },
              deliveryForm: { enum: ["home_delivery", "farm_pickup"] },
              trackingNumber: { bsonType: "string" }
            }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 8. **project_updates** - Nhật Ký Tiến Độ Dự Án

```javascript
db.createCollection("project_updates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["projectId", "type", "title", "updateWeek", "images", "videos", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        projectId: { bsonType: "objectId" },
        type: { 
          enum: ["season_log", "growth_update", "harvest_report", "quality_report", "milestone"]
        },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        images: { bsonType: "array" },
        videos: { bsonType: "array" },
        updateWeek: {
          bsonType: "string",
          description: "Tuần ISO, ví dụ 2026-W24"
        },
        weekStart: { bsonType: "date" },
        weekEnd: { bsonType: "date" },
        orderCode: { bsonType: "string" },
        farmUnitCode: { bsonType: "string" },
        visibility: { enum: ["project", "order"] },
        metrics: {
          bsonType: "object",
          properties: {
            growthStage: { bsonType: "string" },
            temperatureAvg: { bsonType: "double" },
            rainfall: { bsonType: "double" },
            pestCondition: { bsonType: "string" },
            estimatedYield: { bsonType: "double" }
          }
        },
        createdBy: { bsonType: "objectId" }, // farmer
        createdAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 9. **community_posts** - Cộng Đồng & Tin Tức

```javascript
db.createCollection("community_posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "title", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        projectId: { bsonType: "objectId" }, // optional, if related to project
        title: { bsonType: "string" },
        content: { bsonType: "string" },
        images: { bsonType: "array" },
        type: { enum: ["news", "discussion", "success_story", "tip"] },
        likes: { bsonType: "int" },
        likedBy: { 
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        comments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              commentId: { bsonType: "objectId" },
              userId: { bsonType: "objectId" },
              content: { bsonType: "string" },
              createdAt: { bsonType: "date" }
            }
          }
        },
        status: { enum: ["published", "draft", "archived"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});
```

---

### 10. **partner_profiles** - Hồ Sơ Đối Tác

```javascript
db.createCollection("partner_profiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string" },
        type: { enum: ["supplier", "distributor", "logistics", "insurance", "bank"] },
        description: { bsonType: "string" },
        logo: { bsonType: "string" },
        website: { bsonType: "string" },
        contact: {
          bsonType: "object",
          properties: {
            email: { bsonType: "string" },
            phone: { bsonType: "string" },
            address: { bsonType: "string" }
          }
        },
        projects: {
          bsonType: "array",
          items: { bsonType: "objectId" }
        },
        rating: { bsonType: "double" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});
```

---

## Indexes - Tối Ưu Hiệu Suất

```javascript
// users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, status: 1 });

// projects collection
db.projects.createIndex({ farmerId: 1, status: 1 });
db.projects.createIndex({ category: 1, status: 1 });
db.projects.createIndex({ location.province: 1, status: 1 });
db.projects.createIndex({ createdAt: -1 });

// investments collection
db.investments.createIndex({ investorId: 1, status: 1 });
db.investments.createIndex({ projectId: 1, status: 1 });
db.investments.createIndex({ createdAt: -1 });

// transactions collection
db.transactions.createIndex({ userId: 1, createdAt: -1 });
db.transactions.createIndex({ status: 1, createdAt: -1 });
db.transactions.createIndex({ type: 1, createdAt: -1 });

// escrows collection
db.escrows.createIndex({ investmentId: 1 }, { unique: true });
db.escrows.createIndex({ projectId: 1, status: 1 });
db.escrows.createIndex({ status: 1 });

// quality_audits collection
db.quality_audits.createIndex({ projectId: 1, auditDate: -1 });
db.quality_audits.createIndex({ auditerId: 1, status: 1 });

// traceability collection
db.traceability.createIndex({ projectId: 1, batchId: 1 });
db.traceability.createIndex({ batchId: 1 }, { unique: true });

// project_updates collection
db.project_updates.createIndex({ projectId: 1, createdAt: -1 });
db.project_updates.createIndex({ projectId: 1, updateWeek: -1, farmUnitCode: 1, orderCode: 1 });

// community_posts collection
db.community_posts.createIndex({ userId: 1, createdAt: -1 });
db.community_posts.createIndex({ projectId: 1, createdAt: -1 });

// partner_profiles collection
db.partner_profiles.createIndex({ type: 1, name: 1 });
```

---

## Ví Dụ Dữ Liệu Mẫu

### 1. User - Nhà Đầu Tư

```javascript
db.users.insertOne({
  _id: ObjectId(),
  email: "investor@example.com",
  password: "hashed_password_here",
  fullName: "Nguyễn Văn A",
  phone: "0901234567",
  role: "investor",
  avatar: "https://example.com/avatar.jpg",
  kyc: {
    status: "verified",
    identityNumber: "123456789",
    verifiedAt: new Date("2025-01-15"),
    documents: ["id_front.jpg", "id_back.jpg"]
  },
  wallet: {
    balance: 1000000000, // 1 tỷ đồng
    currency: "VND",
    accountNumber: "123456789",
    bankName: "Vietcombank"
  },
  preferences: {
    categories: ["Gạo", "Bưởi da xanh"],
    riskLevel: "medium",
    notifications: true
  },
  status: "active",
  createdAt: new Date("2024-12-01"),
  updatedAt: new Date("2025-01-20")
});
```

### 2. Project - Dự Án Bưởi Da Xanh

```javascript
db.projects.insertOne({
  _id: ObjectId("project_001"),
  name: "Bưởi da xanh Sông Xoài",
  description: "Đầu tư chăm sóc vùng bưởi da xanh Sông Xoài, duy trì chất lượng mùa vụ ổn định",
  farmerId: ObjectId("farmer_001"),
  category: "Bưởi da xanh",
  location: {
    province: "Tây Ninh",
    district: "Sông Xoài",
    coordinates: {
      lat: 11.0000,
      lng: 105.5000
    }
  },
  images: ["hero.jpg", "field1.jpg", "field2.jpg"],
  capitalRequired: 260000000,
  funded: 218400000,
  fundingPercentage: 84,
  investmentPackages: [
    {
      packageId: ObjectId(),
      amount: 10000000,
      description: "Gói nhỏ - 10 triệu đồng",
      expectedReturn: 15, // kg
      deliveryForm: "home_delivery"
    },
    {
      packageId: ObjectId(),
      amount: 20000000,
      description: "Gói vừa - 20 triệu đồng",
      expectedReturn: 32, // kg
      deliveryForm: "home_delivery"
    }
  ],
  duration: "8 tháng",
  startDate: new Date("2025-05-01"),
  endDate: new Date("2025-12-31"),
  expectedReturnRate: "10-14%",
  riskLevel: "Ổn định chất lượng",
  tags: ["Chất lượng", "Mùa vụ ổn định"],
  status: "funding",
  qa_qc: {
    auditerId: ObjectId("auditor_001"),
    status: "passed",
    reports: []
  },
  metrics: {
    expectedYield: 500, // tấn
    actualYield: null,
    qualityScore: null
  },
  createdAt: new Date("2025-04-01"),
  updatedAt: new Date("2025-04-20")
});
```

### 3. Investment - Khoản Đầu Tư

```javascript
db.investments.insertOne({
  _id: ObjectId("investment_001"),
  investorId: ObjectId("investor_001"),
  projectId: ObjectId("project_001"),
  packageId: ObjectId("package_001"),
  amount: 20000000,
  status: "escrow",
  investmentDate: new Date("2025-04-15"),
  expectedReturnDate: new Date("2025-12-31"),
  actualReturnDate: null,
  returnAmount: 32, // kg
  returnForm: "product",
  escrowInfo: {
    escrowId: ObjectId("escrow_001"),
    holdAmount: 20000000,
    releaseDate: new Date("2025-05-01"),
    conditions: ["Farm registration verified", "QA/QC passed"]
  },
  documents: [
    {
      type: "contract",
      url: "https://example.com/contract_001.pdf",
      uploadedAt: new Date("2025-04-15")
    }
  ],
  createdAt: new Date("2025-04-15"),
  updatedAt: new Date("2025-04-20")
});
```

### 4. Transaction - Ghi Chép Giao Dịch

```javascript
db.transactions.insertOne({
  _id: ObjectId(),
  userId: ObjectId("investor_001"),
  type: "investment",
  amount: 20000000,
  currency: "VND",
  status: "completed",
  description: "Đầu tư vào Bưởi da xanh Sông Xoài",
  relatedInvestmentId: ObjectId("investment_001"),
  paymentMethod: {
    method: "bank_transfer",
    provider: "Vietcombank",
    reference: "TRANSFER20250415001"
  },
  fees: 100000,
  receiptUrl: "https://example.com/receipt_001.pdf",
  createdAt: new Date("2025-04-15"),
  completedAt: new Date("2025-04-15")
});
```

---

## Mối Quan Hệ Giữa Collections

```
users (investor, farmer, auditor)
  ↓
  ├─→ projects (farmerId)
  │    ├─→ investments (projectId)
  │    ├─→ quality_audits (projectId, auditerId)
  │    ├─→ traceability (projectId)
  │    └─→ project_updates (projectId)
  │
  ├─→ investments (investorId, projectId)
  │    └─→ escrows (investmentId)
  │
  ├─→ transactions (userId)
  │    └─→ investments (relatedInvestmentId)
  │
  └─→ community_posts (userId, projectId)

partner_profiles
  └─→ projects (many-to-many)
```

---

## Chiến Lược Sao Lưu & Bảo Mật

### Sao Lưu
- **Hàng ngày**: Full backup
- **Hàng giờ**: Incremental backup
- **Lưu trữ**: Multiple regions (replicas)

### Bảo Mật
- **Authentication**: MongoDB Enterprise với xác thực LDAP
- **Encryption**: Data at rest (AES-256) + in transit (TLS)
- **Access Control**: Role-based access control (RBAC)
- **Audit**: Ghi log tất cả hoạt động quản trị

---

## Tối Ưu Hiệu Suất

### Sharding Strategy
Nếu dữ liệu vượt quá 100GB, chia shard theo `projectId`:
```javascript
db.investments.createIndex({ projectId: 1 });
```

### Aggregation Pipeline - Ví Dụ Phân Tích

```javascript
// Tổng đầu tư theo danh mục
db.investments.aggregate([
  {
    $lookup: {
      from: "projects",
      localField: "projectId",
      foreignField: "_id",
      as: "project"
    }
  },
  {
    $group: {
      _id: "$project.category",
      totalInvested: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { totalInvested: -1 } }
]);

// ROI theo nhà đầu tư
db.investments.aggregate([
  {
    $match: { status: "completed" }
  },
  {
    $group: {
      _id: "$investorId",
      totalInvested: { $sum: "$amount" },
      totalReturned: { $sum: "$returnAmount" },
      roiPercent: {
        $multiply: [
          { $divide: [
            { $subtract: ["$totalReturned", "$totalInvested"] },
            "$totalInvested"
          ]},
          100
        ]
      }
    }
  }
]);
```

---

## Nguyên Tắc Thiết Kế MongoDB

1. **Denormalization**: Lưu trữ dữ liệu thường xuyên truy cập cùng nhau
2. **Referencing**: Sử dụng ObjectId khi có nhiều tài liệu liên kết
3. **Embedding**: Nhúng tài liệu khi mối quan hệ 1-1 hoặc 1-few
4. **Scalability**: Tính toán từ trước khi có thể (pre-calculate metrics)
5. **Flexibility**: JSON schema cho phép thêm field mới dễ dàng

---

## Kết Luận

Database MongoDB này được thiết kế để:
✅ Quản lý linh hoạt dữ liệu nông nghiệp phức tạp
✅ Hỗ trợ mở rộng khi có nhiều dự án & nhà đầu tư
✅ Đảm bảo tính toàn vẹn & bảo mật dữ liệu tài chính
✅ Cung cấp khả năng truy xuất & phân tích dữ liệu mạnh mẽ
