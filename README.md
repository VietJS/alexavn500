Alexa Viet Nam 500
---

- Demo: https://alexavn500.firebaseapp.com/
- Source code: http://github.com/vietjs/alexavn500

# Chức năng

Danh sách top 500 websites ở Việt Nam theo Alexa.com bao gồm thông tin:
- Tên website
- Địa chỉ website
- Mô tả
- Favicon
- Thời gian tải trang web
- Thứ tự Alexa
- Google Page Rank
- Số thống kê: tỷ lệ bounce rate, thời gian truy cập, số trang trong một lần truy cập, ...

# Hướng dẫn

- __Cài đặt__ `npm install`
- __Cấu hình__ Trong file `config.js`, thay `firebase.siteRef` bằng đường dẫn tới Firebase của bạn.
- __Cập nhật Alexa top 500 Việt Nam__ `node alexa.js`
- __Cập nhật Google Page Range__ `node pagerange.js`
- __Cập nhật thống kê chi tiết Alexa__ `node alexa-detail.js`
- __Host website trên firebase__ `cd public && firebase deploy` https://www.firebase.com/docs/hosting/quickstart.html