// common.js
console.log("NEW COMMON.JS LOADED");

let currentAudio = null;
let currentBtn = null;

// 🌐 Language (default Sinhala)
let lang = "si";

window.addEventListener("DOMContentLoaded", () => {

    // ======================
    // SLIDESHOW
    // ======================
    const slideImg = document.getElementById("slideImg");
    if (slideImg) {
        const images = ["a.webp", "b.webp", "c.webp"];
        let index = 0;

        images.forEach(src => new Image().src = src);

        setInterval(() => {
            index = (index + 1) % images.length;
            slideImg.src = images[index];
        }, 3000);
    }

    // ======================
    // PHOTO GALLERY
    // ======================
    const gallery = document.getElementById("photo-gallery");
    if (gallery) {
        let i = 1;

        function loadNextImage() {
            let img = new Image();
            img.src = i + ".webp";

            img.onload = function () {
                img.className = "main-image";
                img.style.opacity = "0";
                img.style.transition = "opacity 0.6s ease";

                gallery.appendChild(img);

                setTimeout(() => {
                    img.style.opacity = "1";
                }, 50);

                i++;
                loadNextImage();
            };

            img.onerror = function () {
                console.log("No more images after:", i - 1);
            };
        }

        loadNextImage();
    }

    // ======================
    // LOAD info.txt
    // ======================
    fetch("info.txt", { cache: "no-store" })
        .then(res => {
            if (!res.ok) throw new Error("info.txt not found");
            return res.text();
        })
        .then(text => {

            const info = {};

            text.split(/\r?\n/).forEach(line => {
                const parts = line.split("=");
                if (parts.length < 2) return;

                const key = parts[0].trim();
                const value = parts.slice(1).join("=").trim();
                info[key] = value;
            });

            console.log("INFO LOADED:", info);

            // ======================
            // TEMPLE NAME
            // ======================
            // ======================
// ABBOT + NAMES
// ======================
const abbotEl = document.getElementById("abbot-info");
const noteSIEl = document.getElementById("note-si");
const noteENEl = document.getElementById("note-en");

if (abbotEl) {
    abbotEl.textContent = info.abbot || "";
}

if (noteSIEl) {
    noteSIEl.textContent = info.note_si || "";
}

if (noteENEl) {
    noteENEl.textContent = info.note_en || "";
}
            const siEl = document.getElementById("templeSI");
            const enEl = document.getElementById("templeEN");

            if (siEl) siEl.textContent = info.name_si || "NO SI NAME";
            if (enEl) enEl.textContent = info.name_en || "NO EN NAME";

            // ======================
            // CONTACT PAGE
            // ======================
            const addressEl = document.getElementById("contact-address");
            const emailEl = document.getElementById("contact-email");
            const telEl = document.getElementById("contact-telephone");
            const webEl = document.getElementById("contact-website");

            if (addressEl) {
                addressEl.textContent =
                    (lang === "si") ? (info.address_si || "") : (info.address_en || "");
            }

            if (emailEl) {
                emailEl.textContent = info.email || "NO EMAIL";
            }

       if (telEl) {
    if (info.telephone) {
        const phone = info.telephone.replace(/\s+/g, "");
        telEl.textContent = info.telephone;
        telEl.href = "tel:" + phone;
        telEl.style.pointerEvents = "auto";
    } else {
        telEl.textContent = "NO PHONE";
        telEl.removeAttribute("href");
        telEl.style.pointerEvents = "none";
    }
}

            if (webEl) {
                if (info.website) {
                    webEl.innerHTML = `<a href="${info.website}" target="_blank">${info.website}</a>`;
                } else {
                    webEl.textContent = "NO WEBSITE";
                }
            }

            // ======================
            // MAP
            // ======================
            const mapFrame = document.getElementById("mapFrame");
            if (mapFrame && info.map_embed) {
                mapFrame.src = info.map_embed;
            }

            // ======================
            // TITLE
            // ======================
// ======================
// TITLE (PAGE BASED)
// ======================
let page = window.location.pathname.toLowerCase();

let baseTitle =
    (info.name_si || "Temple") +
    " | " +
    (info.name_en || "") +
    " | Sri Lanka";

if (page.includes("photo")) {
    document.title =
        (info.name_si || "Temple") +
        " | " +
        (info.name_en || "") +
        " | Photos | Sri Lanka";
}
else if (page.includes("history")) {
    document.title = 
            (info.name_si || "Temple") +
        " | " +
        (info.name_en || "") +
        " | History | Sri Lanka";
}
else if (page.includes("contact") || page.includes("map")) {
    document.title = 
         (info.name_si || "Temple") +
        " | " +
        (info.name_en || "") +
        " | Contact | Sri Lanka";
}
else {
    document.title = baseTitle;
}

            // ======================
            // META DESCRIPTION (SEO)
            // ======================
            const descEl = document.querySelector('meta[name="description"]');

            if (descEl) {

                const desc = (lang === "si")
                    ? ((info.name_si || "") + " - " + (info.district_si || "") + " ප්‍රදේශයේ " + (info.description_si || ""))
                    : ((info.name_en || "") + " - Located in " + (info.district_en || "") + ". " + (info.description_en || ""));

                console.log("META DESC:", desc);

                descEl.content = desc;
            }

            // ======================
            // DEFAULT HISTORY LOAD
            // ======================
            if (document.getElementById('temple-text')) {
                loadInfo('si');
            }

        })
        .catch(err => {
            console.log("❌ INFO LOAD ERROR:", err);
        });

});

// ======================
// AUDIO CONTROL
// ======================
function toggleAudio(id, btn) {
    const audio = document.getElementById(id);
    if (!audio) return;

    if (currentAudio === audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        btn.classList.remove("active");
        currentAudio = null;
        currentBtn = null;
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    if (currentBtn) {
        currentBtn.classList.remove("active");
    }

    audio.play();
    btn.classList.add("active");

    currentAudio = audio;
    currentBtn = btn;

    audio.onended = function () {
        btn.classList.remove("active");
        currentAudio = null;
        currentBtn = null;
    };
}

// ======================
// HISTORY LOADER
// ======================
async function loadInfo(langParam) {

    const file = (langParam === 'si') ? 'info-si.txt' : 'info-en.txt';

    const box = document.getElementById('temple-text');
    const title = document.getElementById('history-title');

    if (!box || !title) return;

    title.textContent = (langParam === 'si') ? 'ඉතිහාසය' : 'History';
    box.innerHTML = '';

    try {
        const res = await fetch(file);
        const text = await res.text();

        text.split(/\n\n+/).forEach(block => {

            block = block.trim();
            if (!block) return;

            if (block.startsWith('#')) {
                const h = document.createElement('h3');
                h.textContent = block.substring(1);
                box.appendChild(h);
            } else {
                const p = document.createElement('p');
                p.textContent = block;
                box.appendChild(p);
            }

        });

    } catch {
        box.textContent = "Information not available.";
    }
}

// ==============================
// STATCOUNTER
// ==============================
window.addEventListener("DOMContentLoaded", function () {

    window.sc_project = 13209421;
    window.sc_invisible = 1;
    window.sc_security = "4f7f8b9c";

    var sc = document.createElement("script");
    sc.src = "https://www.statcounter.com/counter/counter.js";
    sc.async = true;

    document.body.appendChild(sc);

});
