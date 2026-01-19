function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (u === "admin" && p === "12345") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("uploadBox").style.display = "block";
  } else {
    alert("ACCESS DENIED");
  }
}

function uploadNote() {
  const subject = document.getElementById("subject").value.trim();
  const file = document.getElementById("note").files[0];

  if (!subject || !file) {
    alert("FILL ALL FIELDS");
    return;
  }

  const formData = new FormData();
  formData.append("subject", subject);
  formData.append("note", file);

  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    alert("Notes uploaded successfully");
    document.getElementById("subject").value = "";
    document.getElementById("note").value = "";
  })
  .catch(err => {
    alert("Upload failed");
    console.log(err);
  });
}
