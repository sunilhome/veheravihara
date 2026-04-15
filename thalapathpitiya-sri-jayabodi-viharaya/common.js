// common.js

window.addEventListener("DOMContentLoaded", () => {

    // ✅ Slideshow (only for index.html)
    const slideImg = document.getElementById("slideImg");
    if (slideImg) {
        const images = ["a.webp", "b.webp", "c.webp"];
        let index = 0;

        // Preload
        images.forEach(src => new Image().src = src);

        setInterval(() => {
            index = (index + 1) % images.length;
            slideImg.src = images[index];
        }, 3000);
    }

    // ✅ PHOTO GALLERY (only for photo.html)
    const gallery = document.getElementById("photo-gallery");
    if (gallery) {
        let i = 1;

        function loadNextImage() {
            let img = new Image();
            img.src = i + ".webp";

            img.onload = function () {
                img.className = "main-image";

                // Optional smooth fade-in
                img.style.opacity = "0";
                img.style.transition = "opacity 0.6s ease";

                gallery.appendChild(img);

                setTimeout(() => {
                    img.style.opacity = "1";
                }, 50);

                i++;
                loadNextImage();
            };

            // ✅ Stop when no more images
            img.onerror = function () {
                console.log("No more images after:", i - 1);
            };
        }

        loadNextImage();
    }

    // ✅ Load info.txt
    fetch("info.txt")
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

        // ✅ Temple names
        const siEl = document.getElementById("templeSI");
        const enEl = document.getElementById("templeEN");
        if (siEl) siEl.textContent = info.si || "";
        if (enEl) enEl.textContent = info.en || "";

        // ✅ Address + Telephone
        const addressEl = document.getElementById("address");
        const telEl = document.getElementById("telephone");
        if (addressEl) addressEl.textContent = info.address || "";
        if (telEl) telEl.textContent = info.telephone || "";

        // ✅ Abbot + notes
        const abbotEl = document.getElementById("abbot-info");
        const noteEl = document.querySelector(".event-note");
        const note1El = document.querySelector(".event-note1");
        if (abbotEl) abbotEl.textContent = info.abbot || "";
        if (noteEl) noteEl.textContent = info.note || "";
        if (note1El) note1El.textContent = info.note1 || "";

        // ✅ Map (iframe from info.txt)
        const mapFrame = document.getElementById("mapFrame");
        if (mapFrame) {
            if (info.map) {
                mapFrame.src = info.map.trim();
            } else {
                mapFrame.style.display = "none";
            }
        }

        // ✅ Dynamic Title
        const pageTitle = `${info.en || "Temple"} | ${info.si || ""} | Sri Lanka`;
        document.title = pageTitle;

        // ✅ Dynamic Meta Description
        let description = info.desc && info.desc !== "" 
            ? info.desc 
            : (info.si ? `${info.si} බෞද්ධ විහාරස්ථානයකි. විහාරාධිපති, ඡායාරූප, ඉතිහාසය සහ සිතියම.` : "");
        const metaDesc = document.getElementById("metaDescription");
        if (metaDesc) metaDesc.setAttribute("content", description);

        // ✅ Canonical & URL
        const cleanURL = window.location.href.split("?")[0];
        const canonical = document.getElementById("canonicalLink");
        const ogURL = document.getElementById("ogURL");
        if (canonical) canonical.setAttribute("href", cleanURL);
        if (ogURL) ogURL.setAttribute("content", cleanURL);

        // ✅ Open Graph
        const ogTitle = document.getElementById("ogTitle");
        const ogDesc = document.getElementById("ogDesc");
        const ogImg = document.getElementById("ogImg");
        const twitterImg = document.getElementById("twitterImg");
        const baseURL = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, "/");
        const imageURL = baseURL + "1.webp";

        if (ogTitle) ogTitle.setAttribute("content", pageTitle);
        if (ogDesc) ogDesc.setAttribute("content", description);
        if (ogImg) ogImg.setAttribute("content", imageURL);

        // ✅ Twitter
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');

        if (twitterTitle) twitterTitle.setAttribute("content", pageTitle);
        if (twitterDesc) twitterDesc.setAttribute("content", description);
        if (twitterImg) twitterImg.setAttribute("content", imageURL);

    })
    .catch(err => console.log("info.txt error:", err));

});
