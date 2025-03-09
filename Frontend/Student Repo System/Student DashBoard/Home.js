let subMenuWrapper = document.getElementById("sub-menu-wrapper");

function toggleMenu() {
  subMenuWrapper.classList.toggle("open-menu");
}

// Fetch dashboard data from backend API on page load
window.addEventListener("DOMContentLoaded", () => {
  fetchDashboardData();
});

function fetchDashboardData() {
  // Adjust the endpoint URL to your backend route
  fetch("/api/dashboard")
    .then(response => response.json())
    .then(data => {
      // Update welcome message and profile
      if (data.user) {
        document.getElementById("userName").textContent = data.user.name;
        document.getElementById("profileName").textContent = data.user.name;
      }

      // Update group members list
      const groupMembersContainer = document.getElementById("groupMembers");
      if (data.groupMembers && Array.isArray(data.groupMembers)) {
        groupMembersContainer.innerHTML = ""; // Clear previous entries
        data.groupMembers.forEach(member => {
          let memberElem = document.createElement("h3");
          memberElem.textContent = member;
          groupMembersContainer.appendChild(memberElem);
        });
      }

      // Update project topic
      if (data.project && data.project.topic) {
        document.getElementById("projectTopic").textContent = data.project.topic;
      }

      // Update supervisor
      if (data.project && data.project.supervisor) {
        document.getElementById("projectSupervisor").textContent = data.project.supervisor;
      }

      // Update recent uploads table
      const uploadsTableBody = document.getElementById("uploadsTableBody");
      if (data.recentUploads && Array.isArray(data.recentUploads)) {
        uploadsTableBody.innerHTML = ""; // Clear previous rows
        data.recentUploads.forEach(upload => {
          let row = document.createElement("tr");
          row.innerHTML = `
            <td>${upload.name}</td>
            <td>${upload.date}</td>
            <td>${upload.status}</td>
            <td>${upload.technologies ? upload.technologies.join(", ") : ""}</td>
          `;
          uploadsTableBody.appendChild(row);
        });
      }
    })
    .catch(error => {
      console.error("Error fetching dashboard data:", error);
    });
}
