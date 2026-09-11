# 📘 HiDocs API - Frontend Integration Guide (Web & Android)

Panduan integrasi teknis lengkap untuk tim Frontend (**Web React/Vue** dan **Mobile Android Flutter**) untuk mengimplementasikan seluruh fitur, alur kerja ujian, *live anti-cheat proctoring*, dan *form customization* di **HiDocs**.

---

## 🌐 1. Konfigurasi Dasar & Header

* **Base API URL**: `http://localhost:8080/api/v1` (atau base URL server staging/prod)
* **Header Default**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
* **Header Authenticated (Guru / Creator / User)**:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## 🔐 2. Alur Autentikasi & Auto-Login Pasca OTP

Setelah pengguna memasukkan kode OTP 6 digit, backend **langsung mengembalikan JWT Token & Data User**. Frontend harus langsung menyimpannya di LocalStorage/SecureStorage dan *redirect* ke Dashboard tanpa perlu login ulang.

### **Endpoint: Verifikasi OTP**
* **Method**: `POST`
* **URL**: `/api/v1/auth/verify-otp`
* **Request Body**:
  ```json
  {
    "email": "guru@sekolah.sch.id",
    "otp_code": "582910"
  }
  ```
* **Response Body (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "OTP verification successful. Welcome to HiDocs!",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "8763d91d-7257-4863-a42d-7ceb5047446e",
        "name": "Budi Santoso",
        "email": "guru@sekolah.sch.id",
        "role": "user"
      }
    }
  }
  ```
* **Frontend Handler**:
  ```javascript
  // Web (React / Vue)
  localStorage.setItem("token", res.data.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.data.user));
  axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.data.token}`;
  router.push("/dashboard");
  ```

---

## 📝 3. Alur Pengerjaan Ujian (Siswa / Public Exam Engine)

```
[Buka Form via URL/QR] 
         │
         ▼
[Cek is_token_protected?] ──(Ya)──► [Input Token /verify-token] ──► [Dapat response_id & Soal]
         │ (Tidak)                                                          │
         ▼                                                                  ▼
[Mulai Ujian / Soal Aktif] ◄────────────────────────────────────────────────┘
         │
         ├──► [Autosave Tiap Jawaban & Flag Ragu-Ragu /autosave]
         ├──► [Navigasi Nomor Soal /session]
         ├──► [Kirim Telemetry Anti-Cheat /telemetry]
         └──► [Selesaikan Ujian /submit]
```

---

### A. Membuka Form Publik
* **Method**: `GET`
* **URL**: `/api/v1/public/forms/:short_code` (contoh: `/api/v1/public/forms/ujian-sosiologi-x891`)
* **Catatan Penting**:
  * Jika `form_settings.is_token_protected == true`, daftar `questions` akan dikembalikan **kosong (`[]`)** untuk mencegah kecurangan *sniffing* payload.
  * Gunakan konfigurasi `theme_color`, `font_family`, `cover_image_url`, `logo_url` untuk styling tema ujian siswa.

---

### B. Verifikasi Token Ujian (Gatekeeper)
Jika form dilindungi token, tampilkan modal input token sebelum ujian dimulai.

* **Method**: `POST`
* **URL**: `/api/v1/public/forms/:form_id/verify-token`
* **Request Body**:
  ```json
  {
    "token": "UAS2026",
    "respondent_email": "siswa1@sekolah.sch.id"
  }
  ```
* **Response Body (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Exam token verified successfully. You may begin the exam.",
    "data": {
      "response_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "form_id": "f6e47fec-8fc6-4a96-8e7b-b5fe0e9cdaaf",
      "session_state": {
        "status": "IN_PROGRESS",
        "current_question_index": 1,
        "duration_minutes": 60,
        "started_at": "2026-09-03T08:00:00Z"
      },
      "questions": [
        {
          "id": "q1-uuid",
          "question_text": "Apa definisi operasional?",
          "question_type": "MULTIPLE_CHOICE",
          "img_url": "/uploads/questions/gambar1.png",
          "points": 10,
          "order_index": 1,
          "options": [
            { "id": "opt1", "option_text": "Opsi A", "img_url": null, "order_index": 1 },
            { "id": "opt2", "option_text": "Opsi B", "img_url": "/uploads/questions/opt_b.png", "order_index": 2 }
          ]
        }
      ]
    }
  }
  ```

---

### C. Real-time Autosave Jawaban & Ragu-Ragu (`is_flagged`)
Panggil endpoint ini setiap kali siswa memilih opsi jawaban, mengetik esai, atau menekan tombol **Ragu-Ragu**. Gunakan teknik **debounce (500ms)** untuk input teks.

* **Method**: `POST`
* **URL**: `/api/v1/public/responses/:response_id/autosave`
* **Request Body**:
  ```json
  {
    "question_id": "q1-uuid",
    "selected_option_id": "opt1-uuid", // Untuk Multiple Choice / Dropdown / YesNo
    "answer_text": "",                  // Untuk Short Text / Long Text
    "is_flagged": true,                 // true = Ragu-ragu (Kuning), false = Yakin
    "match_pairs": [                    // Khusus Tipe Soal MATCHING
      { "match_key": "Dart", "match_target_text": "Flutter" },
      { "match_key": "Kotlin", "match_target_text": "Android Native" }
    ]
  }
  ```
* **Response Body (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Answer autosaved successfully",
    "data": {
      "question_id": "q1-uuid",
      "is_flagged": true,
      "saved_at": "2026-09-03T08:01:15Z"
    }
  }
  ```

---

### D. Navigasi Nomor Soal & State Kisi Soal
Digunakan untuk merender palet kotak nomor soal (1, 2, 3... N).

* **Method**: `GET`
* **URL**: `/api/v1/public/responses/:response_id/session`
* **Response Body (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "response_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "status": "IN_PROGRESS", // IN_PROGRESS | SUBMITTED | RESTARTED | BLOCKED
      "current_question_index": 3,
      "warning_message": "",
      "is_warning_acknowledged": false,
      "questions": [
        { "question_id": "q1-uuid", "order_index": 1, "is_answered": true, "is_flagged": false },
        { "question_id": "q2-uuid", "order_index": 2, "is_answered": true, "is_flagged": true },
        { "question_id": "q3-uuid", "order_index": 3, "is_answered": false, "is_flagged": false }
      ]
    }
  }
  ```
* **Logika Warna Kotak Soal di UI**:
  ```javascript
  const getBadgeColor = (item) => {
    if (item.is_flagged) return "badge-warning"; // Kuning (Ragu-ragu)
    if (item.is_answered) return "badge-success"; // Hijau (Sudah dijawab)
    return "badge-secondary";                    // Abu-abu (Belum dijawab)
  };
  ```

---

### E. Telemetry Anti-Cheat (Web & Android)
Kirim event pelanggaran ke server secara instan.

* **Method**: `POST`
* **URL**: `/api/v1/public/responses/:response_id/telemetry`
* **Request Body**:
  ```json
  {
    "event_type": "TAB_SWITCH", // Lihat tabel event di bawah
    "event_message": "Siswa berpindah tab browser",
    "current_question_index": 5
  }
  ```

#### Daftar `event_type` Resmi:
| Platform | Event Type | Pemicu (Trigger) |
| :--- | :--- | :--- |
| **Web** | `TAB_SWITCH` | `document.addEventListener("visibilitychange")` ketika tab tidak aktif |
| **Web** | `WINDOW_BLUR` | `window.addEventListener("blur")` ketika fokus keluar jendela browser |
| **Android** | `APP_BACKGROUNDED` | `AppLifecycleState.paused` (Siswa tekan tombol Home/Buka WhatsApp) |
| **Android** | `SCREENSHOT_ATTEMPT` | Percobaan capture layar atau screen recording |
| **Android** | `SPLIT_SCREEN` | Deteksi multi-window mode aktif |

---

### F. Alert Peringatan & Restart Ujian
Jika status sesi berubah menjadi `RESTARTED` (karena Guru me-restart ujian siswa yang curang):
1. Tampilkan modal peringatan berisi `warning_message` dari Guru.
2. Ketika siswa menekan tombol *"Saya Mengerti / Lanjutkan Ujian"*, panggil endpoint:
   * **Method**: `POST`
   * **URL**: `/api/v1/public/responses/:response_id/acknowledge-warning`
   * **Response**: `{ "success": true, "message": "Warning acknowledged. Exam resumed." }`

---

### G. Submit Akhir Ujian (One-Time Enforcement)
* **Method**: `POST`
* **URL**: `/api/v1/forms/:form_id/submit`
* **Request Body**:
  ```json
  {
    "response_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "respondent_email": "siswa1@sekolah.sch.id",
    "device_platform": "ANDROID", // "WEB" atau "ANDROID"
    "is_auto_submitted": false,
    "answers": [
      {
        "question_id": "q1-uuid",
        "selected_option_id": "opt1-uuid",
        "answer_text": "",
        "is_flagged": false
      },
      {
        "question_id": "q2-uuid",
        "match_pairs": [
          { "match_key": "Dart", "match_target_text": "Flutter" }
        ]
      }
    ]
  }
  ```
* **Jika Siswa Mencoba Submit Ulang**: Backend akan mengembalikan `HTTP 409 Conflict`:
  ```json
  {
    "success": false,
    "error": "You have already completed and submitted this form/exam."
  }
  ```

---

## 👨‍🏫 4. Fitur Khusus Guru / Creator

### A. Kategori Form (`category`)
* **Ambil Semua Kategori Milik Guru**:
  * `GET /api/v1/forms/categories` (Header: `Bearer <token>`)
  * Response: `["DDK", "Pendidikan Pancasila", "Android", "Umum"]`
* **Filter Form by Kategori**:
  * `GET /api/v1/forms?category=Android`

---

### B. Live Proctoring Monitoring Dashboard
Guru dapat memantau seluruh siswa yang sedang mengerjakan form secara real-time.

* **Method**: `GET`
* **URL**: `/api/v1/forms/:form_id/live-monitoring` (Header: `Bearer <token>`)
* **Response Body (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "response_id": "resp-1",
        "respondent_email": "siswa1@sekolah.id",
        "status": "IN_PROGRESS",
        "current_question_index": 12,
        "total_questions": 40,
        "answered_count": 10,
        "flagged_count": 2,
        "tab_switch_count": 5,
        "blur_count": 3,
        "device_platform": "ANDROID",
        "is_suspicious": true, // Ditandai merah di dashboard guru
        "last_heartbeat": "2026-09-03T08:15:30Z"
      }
    ]
  }
  ```

---

### C. Guru Me-restart Ujian Siswa Curang
* **Method**: `POST`
* **URL**: `/api/v1/forms/:form_id/responses/:response_id/restart` (Header: `Bearer <token>`)
* **Request Body**:
  ```json
  {
    "warning_message": "Anda terdeteksi membuka aplikasi lain sebanyak 5 kali. Ujian Anda di-restart oleh pengawas!"
  }
  ```

---

### D. Upload Media (Gambar, Audio Listening, Video)
* **Method**: `POST`
* **URL**: `/api/v1/questions/upload-media` (Header: `Bearer <token>`)
* **Content-Type**: `multipart/form-data`
* **Form-Data**: `file` (File `.png`, `.jpg`, `.mp3`, `.wav`, `.mp4`, `.webm`)
* **Response Body (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "media_url": "/uploads/media/listening_section_1.mp3",
      "media_type": "AUDIO" // "IMAGE" | "AUDIO" | "VIDEO"
    }
  }
  ```

---

### E. Import Word (.docx) Otomatis
Mengunggah file Word guru yang berisi soal pilihan ganda dan gambar. Backend mengekstrak gambar soal dan gambar opsi secara otomatis.

* **Method**: `POST`
* **URL**: `/api/v1/forms/import-docx` (Header: `Bearer <token>`)
* **Content-Type**: `multipart/form-data`
* **Form-Data**: `file` (File `.docx`)
* **Response**: Mengembalikan form DRAFT lengkap dengan semua pertanyaan, opsi, kunci jawaban, dan `img_url` yang siap di-preview.

---

## 💻 5. Contoh Snippet Implementasi

### Web Anti-Cheat Listener (React/Vue/JS)
```javascript
import axios from "axios";

export function initWebAntiCheat(responseId, currentQuestionIdx) {
  const sendEvent = (type, msg) => {
    axios.post(`/api/v1/public/responses/${responseId}/telemetry`, {
      event_type: type,
      event_message: msg,
      current_question_index: currentQuestionIdx
    }).catch(console.error);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      sendEvent("TAB_SWITCH", "Siswa berpindah tab/browser di-minimize");
    }
  });

  window.addEventListener("blur", () => {
    sendEvent("WINDOW_BLUR", "Fokus browser hilang");
  });
}
```

### Android Anti-Cheat & Secure Mode (Flutter/Dart)
```dart
import 'package:flutter/material.dart';
import 'package:flutter_windowmanager/flutter_windowmanager.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ExamScreen extends StatefulWidget {
  final String responseId;
  const ExamScreen({required this.responseId, Key? key}) : super(key: key);

  @override
  _ExamScreenState createState() => _ExamScreenState();
}

class _ExamScreenState extends State<ExamScreen> with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    // 1. Blokir Screenshot & Screen Recording di Android
    FlutterWindowManager.addFlags(FlutterWindowManager.FLAG_SECURE);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  // 2. Deteksi Siswa Keluar Aplikasi (Home / Split Screen)
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      _sendTelemetry("APP_BACKGROUNDED", "Siswa keluar dari aplikasi");
    }
  }

  Future<void> _sendTelemetry(String eventType, String message) async {
    final url = Uri.parse("http://localhost:8080/api/v1/public/responses/${widget.responseId}/telemetry");
    await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "event_type": eventType,
        "event_message": message,
        "current_question_index": 1
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Ujian HiDocs")),
      body: const Center(child: Text("Halaman Ujian")),
    );
  }
}
```

### Render Rumus Matematika (LaTeX)
* **Web (React)**:
  ```jsx
  import 'katex/dist/katex.min.css';
  import { BlockMath } from 'react-katex';

  <BlockMath math={question.question_text} />
  ```
* **Android (Flutter)**:
  ```dart
  import 'package:flutter_math_fork/flutter_math.dart';

  Math.tex(question.questionText, textStyle: const TextStyle(fontSize: 16));
  ```
