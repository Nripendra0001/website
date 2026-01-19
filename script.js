/*************************************************
   NOTES SYSTEM + NP CHATBOT (FINAL CLEAN BUILD)
**************************************************/

/*************** NP CHATBOT (GLOBAL – INLINE ONCLICK WORKS) ***************/

function toggleNPBot() {
  const bot = document.getElementById("npBot");
  if (bot) bot.classList.toggle("show");
}

function sendNPMsg() {
  const input = document.getElementById("npBotInput");
  const body = document.getElementById("npBotBody");
  if (!input || !body) return;

  const msg = input.value.trim();
  if (msg === "") return;

  const userDiv = document.createElement("div");
  userDiv.className = "np-user-msg";
  userDiv.innerText = msg;
  body.appendChild(userDiv);

  const botReply = getNPReply(msg);

  const botDiv = document.createElement("div");
  botDiv.className = "np-bot-msg";
  botDiv.innerText = botReply;
  body.appendChild(botDiv);

  input.value = "";
  body.scrollTop = body.scrollHeight;
}

/**************** TEXT NORMALIZATION ****************/

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**************** CHATBOT BRAIN ****************/

const knowledgeBase = [
  { keys:["hi","hello","namaste"], reply:"👋 Namaste! Main NarayanPath Assistant hoon." },
  { keys:["download","notes kaise download"], reply:"⬇ Subject select karo aur Download button dabao." },
  { keys:["btech","engineering course"], reply:"🎓 B.Tech ek engineering degree hai." },
  { keys:["syllabus"], reply:"📚 Syllabus Important Links section me diya gaya hai." },
  { keys:["result"], reply:"📊 Result university website par hota hai." }
];

const npKnowledge = [
  { k:["who are you","tum kaun ho","aap kaun ho"], r:"👋 Main NP-Assist hoon, students ki madad ke liye bana hoon." },
  { k:["how to study","study kaise kare"], r:"Daily revision, practice aur time management zaroori hai." },
  { k:["what is engineering","engineering kya hai"], r:"Engineering problems solve karne ka technical field hai." },
  { k:["what is programming","programming kya hai"], r:"Programming computer ko instructions dena hai." },
  { k:["what is java","java kya hai"], r:"Java ek powerful object-oriented language hai." },
  { k:["what is dbms","dbms kya hota hai"], r:"DBMS data ko manage karne ka system hai." },
  { k:["what is operating system","operating system kya hota hai"], r:"OS user aur hardware ke beech interface hai." },
  { k:["what is computer network","computer network kya hota hai"], r:"Network computers ko connect karta hai." },
  { k:["best skills for engineering students"], r:"Programming, communication, problem solving." },
  { k:["how to get job after btech"], r:"Skills, projects aur internship se job milti hai." }
];

function addQA(keywords, answer) {
  npKnowledge.push({
    k: keywords.map(k => k.toLowerCase()),
    r: answer
  });
}

addQA(
  ["who is ansh pandey"],
  "Ansh pandey ek gamer hai."
);

addQA(
  ["who is nripendra","nripendra kaun hai"],
  "Nripendra Pandey ek data analyst aur full stack web developer hai."
);

function getNPReply(text) {
  const msg = normalize(text);

  for (let item of knowledgeBase) {
    if (item.keys.some(k => msg.includes(k))) return item.reply;
  }

  for (let item of npKnowledge) {
    if (item.k.some(k => msg.includes(k))) return item.r;
  }

  return "🤔 Iska exact answer mere paas abhi nahi hai. Aap notes, syllabus ya engineering se related pooch sakte ho.";
}

/**************** NOTES SYSTEM ****************/

document.addEventListener("DOMContentLoaded", () => {

  const subjectDiv = document.getElementById("subjects");
  const notesDiv = document.getElementById("notes");
  const notesTitle = document.getElementById("notesTitle");

  if(subjectDiv){
    fetch("http://localhost:3000/subjects")
      .then(res => res.json())
      .then(subjects => {
        subjectDiv.innerHTML = "";
        subjects.forEach((sub, i) => {
          const card = document.createElement("div");
          card.className = "subject-card";
          card.innerText = sub;
          card.style.animationDelay = `${i * 0.08}s`;

          card.onclick = () => {
            document.querySelectorAll(".subject-card")
              .forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            loadNotes(sub);
          };

          subjectDiv.appendChild(card);
        });
      });
  }

  function loadNotes(subject) {
    if(!notesDiv || !notesTitle) return;

    notesTitle.innerText = "📂 Notes for " + subject;
    notesDiv.innerHTML = "";

    fetch(`http://localhost:3000/notes/${subject}`)
      .then(res => res.json())
      .then(files => {
        if (!files.length) {
          notesDiv.innerHTML = "<p>No notes found</p>";
          return;
        }

        files.forEach((file, index) => {
          const note = document.createElement("div");
          note.className = "note-card";
          note.style.animationDelay = `${index * 0.1}s`;

          note.innerHTML = `
            <div class="note-title">📄 ${file}</div>
            <a class="note-download"
               href="http://localhost:3000/files/${subject}/${file}"
               target="_blank">⬇ Download</a>
          `;
          notesDiv.appendChild(note);
        });
      });
  }

  window.searchNotes = function () {
    const q = document.getElementById("search").value.toLowerCase();
    document.querySelectorAll(".note-card").forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(q)
        ? "block"
        : "none";
    });
  };

});
