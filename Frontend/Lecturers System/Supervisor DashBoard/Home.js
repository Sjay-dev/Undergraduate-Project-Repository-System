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
      const response = await fetch("http://localhost:5000/api/users/current", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        userNameElement.textContent = firstName || "Supervisor";
      }
      
      else {
        userNameElement.textContent = "Supervisor";
      }
    }
    
    catch (error) {
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
  
        // Update the dynamic group list in the sidebar card (replace hard-coded list)
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
      } else {
        console.error("Error fetching groups data");
      }
    } catch (error) {
      console.error("Error fetching groups data:", error);
    }
  });
  
  // Updated showGroupDetails function to display data from a group object
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
  
  // New function to display a student's details in a modal
  function showStudentDetails(student) {
    // Create modal HTML dynamically

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
  
    // Remove the modal from DOM when closed
    studentDetailModalEl.addEventListener("hidden.bs.modal", function () {
      modalContainer.remove();
    });
  }
  