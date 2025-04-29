# 📦 Product Management API

A RESTful Product Management API with User/Admin authentication, role-based access control, product CRUD operations, wishlist management, and advanced search, filtering, sorting, and pagination.

---

## 🚀 Tech Stack  
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Multer (file uploads)  
- express-validator  
- dotenv  

---

## 📖 Features  

✅ User Signup & Login (JWT-based)  
✅ One admin (`ADMIN01`) auto-generated on server start  
✅ Role-based access: admin & users  
✅ Product CRUD (with sequential `PROD001`, `PROD002`, …)  
✅ File uploads (jpg, jpeg, png, 1MB limit)  
✅ Search, Filter, Sort, Pagination  
✅ Wishlist (max 15 items per user)  

---

## 📦 API Routes

### Auth Routes  
`POST /signup`  
`POST /login`

---

### Product Routes  
`POST /api/products/add` — Add product (auth)  
`PUT /api/products/update/:productId` — Update product (auth: owner/admin)  
`DELETE /api/products/delete/:productId` — Delete product (auth: owner/admin)  
`GET /api/products/all` — Get all products (5 per page)  
`GET /api/products/detail/:productId` — Get product details (public)  
`GET /api/products/search` — Search, Filter, Sort, Pagination  

---

### Wishlist Routes  
`POST /api/wishlist/add` — Add to wishlist (user only)  
`DELETE /api/wishlist/remove/:productId` — Remove from wishlist (user only)  
`GET /api/wishlist/mywishlist` — Get wishlist products (user only)

---

## 📦 Run Instructions  

```bash
npm install
npm run dev
```
# Notes
ADMIN01 is auto-generated on server start:

Email: admin@system.com

Password: admin123

Product images stored at /uploads/public/product/

Wishlist max limit: 15 products per user

