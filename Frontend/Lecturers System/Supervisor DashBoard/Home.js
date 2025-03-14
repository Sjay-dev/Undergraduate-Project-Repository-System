document.addEventListener("DOMContentLoaded", async () => {
  // Set today's date
  document.getElementById("date").innerText = new Date().toLocaleDateString();

  const token = localStorage.getItem("token");
  const firstName = localStorage.getItem("firstName");
  const userNameElement = document.getElementById("userName");

  if (!token) {
    window.location.href = "/Frontend/Lecturers System/Sign in/Login.html";
    return;
  }

  // Fetch current user info
  try {
    const userResponse = await fetch("http://localhost:5000/api/users/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      userNameElement.textContent = firstName || "Supervisor";
    } else {
      userNameElement.textContent = "Supervisor";
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    userNameElement.textContent = "Supervisor";
  }

  // Fetch groups data from backend
  try {
    const groupsResponse = await fetch("http://localhost:5000/api/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (groupsResponse.ok) {
      const groups = await groupsResponse.json();

      // Update total group count on dashboard
      document.getElementById("groupCount").innerText = groups.length;

      // Update the dynamic group list in the sidebar card
      const groupListUL = document.getElementById("groupList");
      if (groupListUL) {
        groupListUL.innerHTML = ""; // Clear any existing list items
        groups.forEach((group) => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.textContent = group.groupName;
          li.style.cursor = "pointer";
          // When clicked, pass the full group object to showGroupDetails
          li.addEventListener("click", () => showGroupDetails(group));
          groupListUL.appendChild(li);
        });
      }

      // Populate the projects table with groups data
      populateProjectsTable(groups);
    } else {
      console.error("Error fetching groups data");
    }
  } catch (error) {
    console.error("Error fetching groups data:", error);
  }
});

// ----------------------------
// Functions used in the page
// ----------------------------

// Display group details in the details card
function showGroupDetails(group) {
  const studentsContainer = document.getElementById("students");
  studentsContainer.innerHTML = ""; // Clear previous content

  if (Array.isArray(group.students) && group.students.length > 0) {
    group.students.forEach((student, index) => {
      // Create a clickable link for the student's name
      const studentLink = document.createElement("a");
      studentLink.href = "#";
      studentLink.innerText = student.name;
      studentLink.addEventListener("click", (e) => {
        e.preventDefault();
        showStudentDetails(student);
      });
      studentsContainer.appendChild(studentLink);
      // Append comma separator if not the last student
      if (index !== group.students.length - 1) {
        studentsContainer.appendChild(document.createTextNode(", "));
      }
    });
  } else {
    studentsContainer.innerText = "N/A";
  }

  document.getElementById("dept").innerText = group.department || "N/A";
  document.getElementById("topic").innerText = group.projectTopic || "N/A";
  document.getElementById("groupDetails").style.display = "block";
}

function closeGroupDetails() {
  document.getElementById("groupDetails").style.display = "none";
}

// Display a student's details in a modal
function showStudentDetails(student) {
  const modalHTML = `
    <div class="modal fade" id="studentDetailModal" tabindex="-1" aria-labelledby="studentDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="studentDetailModalLabel">${student.name} Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Department:</strong> ${student.department || "N/A"}</p>
            <p><strong>Matric Number:</strong> ${student.matric_number || "N/A"}</p>
            <p><strong>Level:</strong> ${student.level || "N/A"}</p>
            <p><strong>Email:</strong> ${student.email || "N/A"}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  const modalContainer = document.createElement("div");
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  const studentDetailModalEl = modalContainer.querySelector("#studentDetailModal");
  const studentDetailModal = new bootstrap.Modal(studentDetailModalEl);
  studentDetailModal.show();

  // Remove the modal from the DOM when closed
  studentDetailModalEl.addEventListener("hidden.bs.modal", function () {
    modalContainer.remove();
  });
}

// Populate the projects table with data from the backend
function populateProjectsTable(groups) {
  const tableBody = document.getElementById("projectsTableBody");
  tableBody.innerHTML = "";
  groups.forEach(group => {
    // Set status to "Pending" if not provided
    const status = group.projectStatus || "Pending";
    const tr = document.createElement("tr");

    // Group Number cell (clickable to show details)
    const tdGroupNumber = document.createElement("td");
    tdGroupNumber.textContent = group.groupName;
    tdGroupNumber.style.cursor = "pointer";
    tdGroupNumber.addEventListener("click", () => showGroupDetails(group));
    tr.appendChild(tdGroupNumber);

    // Project Topic cell (clickable to show details)
    const tdTopic = document.createElement("td");
    tdTopic.textContent = group.projectTopic;
    tdTopic.style.cursor = "pointer";
    tdTopic.addEventListener("click", () => showGroupDetails(group));
    tr.appendChild(tdTopic);

    // Status cell (clickable to show details)
    const tdStatus = document.createElement("td");
    tdStatus.textContent = status;
    tdStatus.style.cursor = "pointer";
    tdStatus.addEventListener("click", () => showGroupDetails(group));
    tr.appendChild(tdStatus);


    // Actions cell with buttons
    const tdActions = document.createElement("td");

    // Deny Button
    const btnDeny = document.createElement("button");
    btnDeny.className = "btn btn-primary btn-sm";
    btnDeny.textContent = "Deny";
    btnDeny.addEventListener("click", (e) => {
      e.stopPropagation();
      updateGroupStatus(group._id, "Denied");
    });
    tdActions.appendChild(btnDeny);

    // Approve Button
    const btnApprove = document.createElement("button");
    btnApprove.className = "btn btn-warning btn-sm mx-1";
    btnApprove.textContent = "Approve";
    btnApprove.addEventListener("click", (e) => {
      e.stopPropagation();
      updateGroupStatus(group._id, "Approved");
    });
    tdActions.appendChild(btnApprove);

    // Completed Button
    const btnCompleted = document.createElement("button");
    btnCompleted.className = "btn btn-success btn-sm";
    btnCompleted.textContent = "Completed";
    btnCompleted.addEventListener("click", (e) => {
      e.stopPropagation();
      updateGroupStatus(group._id, "Completed");
    });
    tdActions.appendChild(btnCompleted);

    tr.appendChild(tdActions);
    tableBody.appendChild(tr);
  });
}

// Update group status via backend
async function updateGroupStatus(groupId, newStatus) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ projectStatus: newStatus })
    });

    if (response.ok) {
      // Optionally refresh the table or update UI accordingly.
      location.reload();
    } else {
      console.error("Failed to update group status.");
    }
  } catch (error) {
    console.error("Error updating group status:", error);
  }
}
