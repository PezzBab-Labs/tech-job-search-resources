const sheetURL =
  "https://docs.google.com/spreadsheets/d/1u0TRGaNt9l-qD5U_F-uHIbgGcePWN122cVBZXJl6LHA/gviz/tq?tqx=out:json";

fetch(sheetURL)
  .then((res) => res.text())
  .then((data) => {
    const json = JSON.parse(data.substr(47).slice(0, -2));
    const rows = json.table.rows.map((row) =>
      row.c.map((cell) => (cell ? cell.v : ""))
    );

    const categories = {};
    for (let i = 1; i < rows.length; i++) {
      const [category, description, link, notes] = rows[i];
      if (!categories[category]) categories[category] = [];
      categories[category].push({ description, link, notes });
    }

    const content = document.getElementById("content");
    content.innerHTML = "";

    Object.keys(categories).forEach((category) => {
      const section = document.createElement("details");
      section.innerHTML = `<summary>${category}</summary>`;

      categories[category].forEach((entry) => {
        const div = document.createElement("div");
        div.className = "link-entry";
        div.innerHTML = `
          🔗 <a href="${entry.link}" target="_blank" rel="noopener noreferrer">${entry.description}</a>
          ${entry.notes ? `<div class="notes">📝 ${entry.notes}</div>` : ""}
        `;
        section.appendChild(div);
      });

      content.appendChild(section);
    });
  })
  .catch((err) => {
    document.getElementById("content").innerHTML = "Error loading data.";
    console.error("Sheet load error:", err);
  });
