const express = require("express");
const path = require("path");
const app = express();

// 빌드된 정적 파일 서빙
app.use(express.static(path.join(__dirname, "dist")));

// 모든 라우트를 index.html로 리디렉션 (SPA의 경우)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// 포트 설정
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
