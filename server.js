const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// POST 데이터 받기
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

// public 폴더 사용
app.use(express.static(path.join(__dirname, "public")));

// 업로드 폴더 준비
const uploadDir = path.join(__dirname, "public", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 홈 접속 시 home.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// ==============================
// Ao5 기록 저장
// ==============================

let lastRecord = null;

app.post("/saveRecord", (req, res) => {

    lastRecord = {
        ao5Result: req.body.ao5Result,
        fastestRecord: req.body.fastestRecord,
        slowestRecord: req.body.slowestRecord,
        middleRecords: req.body.middleRecords,
        allRecords: req.body.allRecords,
        createdAt: new Date().toLocaleString("ko-KR")
    };

    console.log("===== Ao5 기록 저장 =====");
    console.log(lastRecord);

    res.json({
        success: true
    });
});

app.get("/getRecord", (req, res) => {

    if (lastRecord === null) {

        return res.json({
            ao5Result: "--.--",
            fastestRecord: "-",
            slowestRecord: "-",
            middleRecords: "-",
            allRecords: "-",
            createdAt: "-"
        });

    }

    res.json(lastRecord);
});

// ==============================
// Competition Recap 저장
// ==============================

let lastRecap = null;

app.post("/saveRecap", (req, res) => {

    lastRecap = {
        compName: req.body.compName || "",
        compDate: req.body.compDate || "",
        compVenue: req.body.compVenue || "",

        photoData: req.body.photoData || req.body.uploadedImage || "",
        uploadedImage: req.body.uploadedImage || req.body.photoData || "",

        photoZoom: req.body.photoZoom || "1",
        photoX: req.body.photoX || "50",
        photoY: req.body.photoY || "50",

        playerKr: req.body.playerKr || "",
        playerEn: req.body.playerEn || "",
        wcaId: req.body.wcaId || "",

        firstComp: req.body.firstComp || false,
        isWcaCompetition: req.body.isWcaCompetition || false,
        bestStaff: req.body.bestStaff || false,
        showQr: req.body.showQr || false,

        cardTheme: req.body.cardTheme || req.body.theme || "#111111",
        theme: req.body.theme || req.body.cardTheme || "#111111",

        events: req.body.events || [],

        createdAt: new Date().toLocaleString("ko-KR")
    };

    console.log("===== Competition Recap 저장 =====");
    console.log({
        ...lastRecap,
        photoData: lastRecap.photoData ? "[이미지 데이터 있음]" : "",
        uploadedImage: lastRecap.uploadedImage ? "[이미지 데이터 있음]" : ""
    });

    res.json({
        success: true
    });
});

app.get("/getRecap", (req, res) => {

    if (lastRecap === null) {

        return res.json({
            compName: "",
            compDate: "",
            compVenue: "",

            photoData: "",
            uploadedImage: "",

            photoZoom: "1",
            photoX: "50",
            photoY: "50",

            playerKr: "",
            playerEn: "",
            wcaId: "",

            firstComp: false,
            isWcaCompetition: false,
            bestStaff: false,
            showQr: false,

            cardTheme: "#111111",
            theme: "#111111",

            events: [],

            createdAt: "-"
        });

    }

    res.json(lastRecap);
});

// ==============================
// Recap 이미지 업로드
// ==============================

function makeSafeFileName(name) {
    return (name || "competition-recap")
        .trim()
        .replace(/[\\/:*?"<>|]/g, "_")
        .replace(/\s+/g, "_")
        || "competition-recap";
}

app.post("/uploadRecapImage", (req, res) => {

    try {
        const image = req.body.image;
        const fileName = makeSafeFileName(req.body.fileName);

        if (!image || !image.startsWith("data:image/png;base64,")) {
            return res.status(400).json({
                success: false,
                message: "PNG 이미지 데이터가 없습니다."
            });
        }

        const base64Data = image.replace(/^data:image\/png;base64,/, "");
        const uniqueName = `${fileName}-${Date.now()}.png`;
        const savePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(savePath, base64Data, "base64");

        res.json({
            success: true,
            imageUrl: `/uploads/${uniqueName}`
        });

    } catch (error) {
        console.error("===== Recap 이미지 업로드 오류 =====");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "이미지 업로드 중 오류가 발생했습니다."
        });
    }

});

// 서버 실행
app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log(" Cube Algorithms 서버 실행");
    console.log(` http://localhost:${PORT}`);
    console.log("=================================");
    console.log("");

});