document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Frontend/Lecturers System/Sign in/Login.html";
      return;
    }
  
    // Fetch groups data from the backend
    try {
      const response = await fetch("http://localhost:5000/api/groups", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const groups = await response.json();
        populateProjectsTable(groups);
      } 
      else {
        console.error("Error fetching groups data.");
        }
    } catch (error) {
      console.error("Error fetching groups data:", error);
    }
  });
  
  // Populate the projects table with data from the backend
  function populateProjectsTable(groups) {
    const tableBody = document.getElementById("projectsTableBody");
    tableBody.innerHTML = "";
    groups.forEach(group => {
      // Set status to "Pending" if not provided
      const status = group.status || "Pending";
  
      const tr = document.createElement("tr");
  
      // Group Name cell (clickable to show details)
      const tdGroupName = document.createElement("td");
      tdGroupName.textContent = group.groupName;
      tdGroupName.style.cursor = "pointer";
      tdGroupName.addEventListener("click", () => showGroupDetails(group));
      tr.appendChild(tdGroupName);
  
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
      
      const btnDeny = document.createElement("button");
      btnDeny.className = "btn btn-primary btn-sm";
      btnDeny.textContent = "Deny";
      btnDeny.addEventListener("click", (e) => {
        e.stopPropagation();
        updateGroupStatus(group._id, "Denied");
      });

      tdActions.appendChild(btnDeny);
      
      const btnApprove = document.createElement("button");
      btnApprove.className = "btn btn-warning btn-sm mx-1";
      btnApprove.textContent = "Approve";
      btnApprove.addEventListener("click", (e) => {
        e.stopPropagation();
        updateGroupStatus(group._id, "Approved");
      });

      tdActions.appendChild(btnApprove);
      
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
  
  // Function to update group status via backend (example implementation)
  async function updateGroupStatus(groupId, newStatus) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Optionally refresh the table or update UI accordingly.
        location.reload();
      } 
      else {
        console.error("Failed to update group status.");
      }
    } catch (error) {
      console.error("Error updating group status:", error);
    }
  }
  
  // Display group details in the details card
  function showGroupDetails(group) {
    // Populate students list with clickable names
    const studentsContainer = document.getElementById("students");
    studentsContainer.innerHTML = "";
    if (Array.isArray(group.students) && group.students.length > 0) {
      group.students.forEach((student, index) => {
        const studentLink = document.createElement("a");
        studentLink.href = "#";
        studentLink.textContent = student.name;
        studentLink.addEventListener("click", (e) => {
          e.preventDefault();
          showStudentPopup(student);
        });
        studentsContainer.appendChild(studentLink);
        if (index < group.students.length - 1) {
          studentsContainer.appendChild(document.createTextNode(", "));
        }
      });
    } else {
      studentsContainer.textContent = "N/A";
    }
  
    // Populate other group details
    document.getElementById("dept").innerText = group.department || "N/A";
    document.getElementById("topic").innerText = group.projectTopic || "N/A";
    document.getElementById("groupDetails").style.display = "block";
  }
  
  function closeGroupDetails() {
    document.getElementById("groupDetails").style.display = "none";
  }
  
  // Display a popup (modal) with student details
  function showStudentPopup(student) {
    const modalHTML = `
      <div class="modal fade" id="studentPopupModal" tabindex="-1" aria-labelledby="studentPopupModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="studentPopupModalLabel">${student.name} Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p><strong>Department:</strong> ${student.department || "N/A"}</p>
              <p><strong>Matric Number:</strong> ${student.matricNumber || "N/A"}</p>
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
    const modalEl = modalContainer.querySelector("#studentPopupModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    modalEl.addEventListener("hidden.bs.modal", () => {
      modalContainer.remove();
    });
  }
  