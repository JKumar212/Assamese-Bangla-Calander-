const assameseMonths = ["বহাগ", "জেঠ", "আহাৰ", "সাৱন", "ভাদ", "আহিন", "কাৰ্তিক", "অঘোন", "পুহ", "মাঘ", "ফাগুন", "চ’ত"];
const banglaMonths = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"];
const englishMonths = ["Boishakh", "Joishtho", "Ashar", "Srabon", "Bhadro", "Ashwin", "Kartick", "Ogrohayon", "Poush", "Magh", "Falgun", "Chaitro"];

// Sample festivals by month/day
const festivals = {
  "0-14": { name: "পোহেলা বৈশাখ", en: "Pohela Boishakh", bn: "পহেলা বৈশাখ" },
  "0-15": { name: "বihu লগন", en: "Bihu Logna", bn: "বৈশাখী বিউ" },
  "1-15": { name: "মাঘ বিহু", en: "Magh Bihu", bn: "মাঘ বিউ" },
  "2-8":  { name: "হোলি", en: "Holi", bn: "দোল পূর্ণিমা" },
  "3-14": { name: "ৰঙালী বিহু", en: "Rongali Bihu", bn: "পহেলা বৈশাখ" },
  "4-1":  { name: "শ্ৰদ্ধাঞ্জলি দিবস", en: "Sankardev Tithi", bn: "শংকরদেব তিথি" },
  "7-30": { name: "শৰৎ পূৰ্ণিমা", en: "Sharad Purnima", bn: "শরৎ পূর্ণিমা" },
  "9-4":  { name: "লক্ষ্মীপূজা", en: "Laxmi Puja", bn: "লক্ষ্মী পূজা" },
  "9-24": { name: "কালীপূজা", en: "Kali Puja", bn: "কালী পূজা" },
  "9-25": { name: "দীপাবলী", en: "Diwali", bn: "দীপাবলী" },
  "11-16": { name: "বৰদেউৰ তিথি", en: "Bordowa Tithi", bn: "বড়দেউর তিথি" }
};


function getTraditionalDate(date, lang = "assamese") {
  const day = date.getDate();
  const month = date.getMonth();
  let tradMonth = (month + 8) % 12;
  let tradDay = day < 14 ? 15 + day : day - 13;
  if (day < 14) tradMonth = (month + 7) % 12;

  const months = lang === "assamese" ? assameseMonths :
                 lang === "bangla" ? banglaMonths : englishMonths;

  return `${tradDay} ${months[tradMonth]}`;
}

function updateCalendar(selectedDate = new Date()) {
  const lang = document.getElementById("languageSelector").value;
  const gregDate = selectedDate.toDateString();
  const tradDate = getTraditionalDate(selectedDate, lang);

  document.getElementById("gregorianDate").textContent = gregDate;
  document.getElementById("traditionalDate").textContent = tradDate;

  // Festival lookup
  const festKey = `${selectedDate.getMonth()}-${selectedDate.getDate()}`;
  const fest = festivals[festKey];
if (fest) {
  const lang = document.getElementById("languageSelector").value;
  document.getElementById("festivalText").textContent =
    lang === "assamese" ? fest.name :
    lang === "bangla" ? fest.bn : fest.en;
} else {
  document.getElementById("festivalText").textContent = "No major festival today.";
}

  generateMonthView(selectedDate, lang);
}

function generateMonthView(date, lang) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById("monthGrid");
  grid.innerHTML = "";

  const assameseDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];

  // Convert English digits to Assamese
  const convertToAssameseDigits = (num) => 
    num.toString().split('').map(d => assameseDigits[parseInt(d)]).join('');

  for (let d = 1; d <= days; d++) {
    const tempDate = new Date(year, month, d);
    const assameseDate = getTraditionalDate(tempDate, "assamese");
    const gregorianLabel = `${d} ${tempDate.toLocaleString('default', { month: 'short' })}`;
    
    // Assamese version of the date
    const [day, monthName] = assameseDate.split(" ");
    const assameseDay = convertToAssameseDigits(day);

    const div = document.createElement("div");
    div.innerHTML = `
      <div><strong>${gregorianLabel}</strong></div>
      <div class="assamese-date">${assameseDay} ${monthName}</div>
    `;
    grid.appendChild(div);
  }
}


// Event Listeners
document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("languageSelector").addEventListener("change", () => {
  const date = new Date(document.getElementById("datePicker").value || Date.now());
  updateCalendar(date);
});

document.getElementById("datePicker").addEventListener("change", (e) => {
  updateCalendar(new Date(e.target.value));
});

// Init
document.getElementById("datePicker").valueAsDate = new Date();
updateCalendar();
// Show Festival List Modal
document.getElementById("showFestivalsBtn").addEventListener("click", () => {
  const lang = document.getElementById("languageSelector").value;
  const ul = document.getElementById("festivalList");
  ul.innerHTML = "";

  Object.entries(festivals).forEach(([key, value]) => {
    const [month, day] = key.split("-");
    const label = lang === "assamese" ? value.name : lang === "bangla" ? value.bn : value.en;
    ul.innerHTML += `<li><strong>${parseInt(day) + 1} ${getTraditionalDate(new Date(2025, parseInt(month), parseInt(day) + 1), lang).split(" ")[1]}</strong>: ${label}</li>`;
  });

  document.getElementById("festivalModal").style.display = "block";
});

// Close Modal
document.getElementById("closeFestivalModal").addEventListener("click", () => {
  document.getElementById("festivalModal").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.getElementById("festivalModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});