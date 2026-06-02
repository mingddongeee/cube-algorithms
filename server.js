const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// POST 데이터 받기
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "15mb" }));

// public 폴더 사용
app.use(express.static(path.join(__dirname, "public")));

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

    if(lastRecord === null){

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
        photoData: req.body.photoData || "",
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
        cardTheme: req.body.cardTheme || "#111111",

        events: req.body.events || [],

        createdAt: new Date().toLocaleString("ko-KR")
    };

    console.log("===== Competition Recap 저장 =====");
    console.log({
        ...lastRecap,
        photoData: lastRecap.photoData ? "[이미지 데이터 있음]" : ""
    });

    res.json({
        success: true
    });
});

app.get("/getRecap", (req, res) => {

    if(lastRecap === null){

        return res.json({
            compName: "",
            compDate: "",
            compVenue: "",
            photoData: "",
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

            events: [],

            createdAt: "-"
        });

    }

    res.json(lastRecap);
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