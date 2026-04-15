// common.js

let currentAudio = null;
let currentBtn = null;

window.addEventListener("DOMContentLoaded", () => {

    // ✅ Slideshow (only for index.html)
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

    // ✅ PHOTO GALLERY
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

    // ✅ Load info.txt
    fetch("info.txt", { cache: "no-store" })
.then(res => {
    console.log("Fetch status:", res.status);
    return res.text();
})
    .then(res => res.text())
    .then(data => {

        const info = {};
        data.split(/\r?\n/).forEach(line => {
            const parts = line.split("=");
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join("=").trim();
                info[key] = value;
            }
        });

        const siEl = document.getElementById("templeSI");
        const enEl = document.getElementById("templeEN");
        const villageEl = document.getElementById("templeVillage");

        if (siEl) siEl.textContent = info.si || "";
        if (enEl) enEl.textContent = info.en || "";
        if (villageEl) villageEl.textContent = info.village || "";

        const pageTitle = `${info.en || "Temple"} | ${info.si || ""} | Sri Lanka`;
        document.title = pageTitle;

        const metaDesc = document.getElementById("metaDescription");
        if (metaDesc) {
            metaDesc.setAttribute("content", info.desc || "");
        }

    })
    .catch(err => console.log("info.txt error:", err));

    // ✅ DEFAULT HISTORY LOAD
    if (document.getElementById('temple-text')) {
        loadInfo('si');
    }

});

// ✅ AUDIO CONTROL
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

// ✅ HISTORY / TEXT LOADER
async function loadInfo(lang) {

    const file = (lang === 'si') ? 'info-si.txt' : 'info-en.txt';

    const box = document.getElementById('temple-text');
    const title = document.getElementById('history-title');

    if (!box || !title) return;

    title.textContent = (lang === 'si') ? 'ඉතිහාසය' : 'History';
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
