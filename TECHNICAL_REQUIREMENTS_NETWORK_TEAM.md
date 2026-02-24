# FinLogic Portal — Şəbəkə komandası üçün texniki tələblər

**finlogic.az** üzərində portalı və verilənlər bazasını işə sala bilmək üçün lazım olan server, domen və konfiqurasiya.

---

## Layihə haqqında qısa məlumat

Portal **Next.js 14** (TypeScript, TailwindCSS) ilə yazılıb. İstifadəçi girişi və məlumatlar **Supabase** (Auth + PostgreSQL) ilə idarə olunur. Verilənlər bazasını sonradan öz serverimizdə (lokal PostgreSQL) saxlamağı planlayırıq.

---

## 1. Server — Minimum tələblər

Bizə aşağıdakı minimum parametrləri ödəyən server lazımdır ki, tətbiqi və verilənlər bazasını rahat işlədə bilək.

| Parametr | Minimum | Məsləhət görülən |
|----------|---------|-------------------|
| **Prosessor (CPU)** | 2 vCPU | 4 vCPU |
| **Operativ yaddaş (RAM)** | 2 GB | 4 GB |
| **Disk** | 20 GB | 40 GB SSD |
| **Əməliyyat sistemi** | Linux (Linux və ya Windows) | — |

**Əlavə:** Serverdə **Node.js 18** və ya **20** (LTS) və **npm** quraşdırılmış olmalıdır.

---

## 2. Portlar

Hansı portların açıq olması və ya yalnız daxili istifadə üçün saxlanması haqqında:

| Xidmət | Port | Qeyd |
|--------|------|------|
| **HTTP** | 80 | İnternetdən açıq; HTTPS-ə yönləndirmə üçün |
| **HTTPS** | 443 | İnternetdən açıq; brauzerdən gələn trafik bura düşəcək |
| **Tətbiq (Next.js)** | 3000 | Yalnız server daxilində; xaricə açıq olmamalıdır |
| **PostgreSQL** | 5432 | Yalnız server daxilində; verilənlər bazası üçün |

**Qısa izah:** İstifadəçilər **finlogic.az** ünvanına daxil olanda 80/443 portlarına gələn sorğu Nginx (və ya oxşar) vasitəsilə daxili 3000 portuna yönləndiriləcək.

---

## 3. Verilənlər bazası (lokal PostgreSQL)

Verilənlər bazasını Supabase buludundan öz serverimizə keçirəcəyik.

- **Baza:** PostgreSQL 14 və ya daha yeni.
- **Port:** 5432 (yalnız server daxilində, xaricə açıq olmamalıdır).

---

## Xülasə — nə lazımdır?

- **Server:** ən azı 2 vCPU, 2 GB RAM, 20 GB disk; Node.js 18 və ya 20.
- **Portlar:** 80 və 443 ictimai; 3000 və 5432 yalnız daxili.
- **Domen:** finlogic.az DNS ilə serverin IP-sinə yönəldilsin; HTTPS və reverse proxy (80/443 → 3000) qurulsun.
- **Verilənlər bazası:** Lokal PostgreSQL (və ya Supabase self-hosted) işləsin.

Bu tələblər yerinə yetirildikdə layihə **finlogic.az** üzərində normal işləyə biləcək.
