# Huong dan dua AgriShare len online de khach hang dat don

Tai lieu nay dung cho ban production dau tien cua AgriShare: khach hang co the vao website, chon san pham, dat goi dau tu, gui bien lai, tra cuu tien do don; admin co the dang nhap va xu ly don.

## 1. Cac file quan trong

- Frontend: `index.html`, `admin.html`, `track-order.html`, `thank-you.html`, `project-detail.html`
- Cau hinh API frontend: `config.js`
- Giao dien: `styles.css`, `admin.css`, `track-order.css`, `project-detail.css`
- Backend API: `backend/server.js`
- Bien moi truong backend mau: `backend/.env.production.example`
- Cau hinh Render mau: `render.yaml`
- Cau hinh Netlify mau: `netlify.toml`

## 2. Tao MongoDB Atlas

1. Tao project MongoDB Atlas.
2. Tao cluster.
3. Tao database user rieng cho AgriShare.
4. Mo Network Access cho server deploy. Khi moi test co the dung `0.0.0.0/0`, khi van hanh that nen gioi han IP theo nha cung cap server.
5. Lay connection string dang:

```text
mongodb+srv://<username>:<password>@<cluster-url>/agrishare?retryWrites=true&w=majority
```

## 3. Deploy backend API

Co the dung Render, Railway hoac VPS. Neu dung Render:

1. Push project len GitHub.
2. Vao Render, tao Blueprint tu repo co file `render.yaml`, hoac tao Web Service thu cong.
3. Root directory: `backend`
4. Build command:

```bash
npm install
```

5. Start command:

```bash
npm start
```

6. Them environment variables:

```text
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=agrishare
NODE_ENV=production
HOST=0.0.0.0
API_PREFIX=/api/v1
JWT_SECRET=<chuoi-bi-mat-rat-dai>
JWT_EXPIRE=7d
CORS_ORIGIN=https://ten-frontend-cua-ban.netlify.app,https://agrishare.vn
```

7. Kiem tra backend online:

```text
https://ten-api-cua-ban.onrender.com/health
```

Ket qua dung phai co:

```json
{"success":true,"message":"Server is running","database":"connected"}
```

## 4. Seed du lieu ban dau len database online

Sau khi backend da co `MONGODB_URI` production, chay seed mot lan trong moi truong backend:

```bash
cd backend
npm run seed
```

Seed se tao du lieu san pham va tai khoan admin mau. Sau khi dang nhap lan dau, nen doi mat khau trong tab Tai khoan.

## 5. Deploy frontend

Co the dung Netlify, Vercel, GitHub Pages hoac hosting bat ky vi frontend la HTML/CSS/JS tinh.

Neu dung Netlify:

1. Chon repo GitHub cua project.
2. Publish directory: `.`
3. Build command: de trong.
4. Sau khi deploy, ban se co URL frontend, vi du:

```text
https://agrishare.netlify.app
```

## 6. Tro frontend ve API online

Mo file `config.js` va doi:

```js
window.AGRISHARE_CONFIG = {
  API_BASE_URL: "http://localhost:5000/api/v1",
};
```

thanh:

```js
window.AGRISHARE_CONFIG = {
  API_BASE_URL: "https://ten-api-cua-ban.onrender.com/api/v1",
};
```

Sau do commit va push lai len GitHub de Netlify/Vercel deploy lai.

## 7. Cap nhat CORS backend

Sau khi co URL frontend, cap nhat bien `CORS_ORIGIN` tren backend:

```text
CORS_ORIGIN=https://agrishare.netlify.app,https://agrishare.vn
```

Neu co ca domain www:

```text
CORS_ORIGIN=https://agrishare.vn,https://www.agrishare.vn
```

Sau do restart backend.

## 8. Test luong dat don that

Dung trinh duyet mo frontend online va test:

1. Vao `index.html`.
2. Chon san pham trong Marketplace.
3. Chon goi dau tu.
4. Dien thong tin khach hang.
5. Chon nhan hang tai nha hoac trai nghiem tai Farm.
6. Gui don.
7. Website chuyen qua `thank-you.html` va hien ma don `AGS-...`.
8. Gui thong tin/bien lai thanh toan.
9. Vao `track-order.html`, nhap ma don de tra cuu.
10. Vao `admin.html`, dang nhap admin, kiem tra don moi.
11. Cap nhat trang thai don trong admin.
12. Quay lai trang tra cuu de xac nhan khach thay trang thai moi.

## 9. Cac URL can ghi lai

- Frontend khach hang:

```text
https://...
```

- Admin:

```text
https://.../admin.html
```

- Tra cuu don:

```text
https://.../track-order.html
```

- Backend health:

```text
https://.../health
```

- API base:

```text
https://.../api/v1
```

## 10. Viec bat buoc truoc khi mo ban that

- Doi mat khau admin seed.
- Doi `JWT_SECRET` thanh chuoi bi mat dai.
- Doi `CORS_ORIGIN` dung domain that.
- Kiem tra MongoDB Atlas dang backup.
- Kiem tra form upload bien lai.
- Kiem tra email/so dien thoai lien he hien thi dung trong admin/settings.
- Chot quy trinh xac nhan chuyen khoan va doi/bu san pham.
