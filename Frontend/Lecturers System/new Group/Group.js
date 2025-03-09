document.addEventListener("DOMContentLoaded", function () {
 
  const accessToken = localStorage.getItem("token");

  if (!accessToken) {
    // Redirect to login if not authenticated
    window.location.href = "/Frontend/Lecturers System/Sign in/Login.html";
    return;
  }

  /* =========================
     ELEMENT REFERENCES
  ============================ */
  const groupForm = document.getElementById("groupForm");
  const groupIdField = document.getElementById("groupId");
  const groupName = document.getElementById("groupName");
  const department = document.getElementById("department");
  const projectTopic = document.getElementById("projectTopic");
  const groupTableBody = document.getElementById("groupTableBody");
  const searchInput = document.getElementById("studentSearch");
  const searchButton = document.getElementById("searchButton");
  const searchResultsUL = document.getElementById("searchResults");
  const selectedStudentsList = document.getElementById("selectedStudentsList");

  /* =========================
     DATA VARIABLES
  ============================ */
  let groups = [];
  let allStudents = [];
  let selectedStudents = [];

  /* =========================
     INITIAL DATA FETCH
  ============================ */
  fetchGroups();
  fetchStudents();

  // Fetch groups from backend
  function fetchGroups() {
    fetch("http://localhost:5000/api/groups", {
      method : "GET" ,  
      headers: { "Authorization": "Bearer " + accessToken  , "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(data => {
        groups = data;
        renderGroups();
      })
      .catch(error => console.error("Error fetching groups:", error));
  }

  // Fetch all students from backend
  function fetchStudents() {
    fetch("http://localhost:5000/api/students", {
      method : "GET",
      headers: { "Authorization": "Bearer " + accessToken , "Content-Type": "application/json" } 
    
    })
      .then(response => response.json())
      .then(data => {
        allStudents = data;
      })
      .catch(error => console.error("Error fetching students:", error));
  }

  /* =========================
     GROUP MANAGEMENT FUNCTIONS
  ============================ */
  // Render groups in the table
  function renderGroups() {
    groupTableBody.innerHTML = "";
    groups.forEach((group) => {
      groupTableBody.innerHTML += `
        <tr>
          <td>${group.groupName}</td>
          <td>${group.department}</td>
          <td>${group.projectTopic}</td>
          <td>${group.students.map(students => students.name).join(", ")}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="editGroup('${group._id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteGroup('${group._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
  }

  // Handle form submission for create/update group
  groupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      showAlert("Please select at least one student.", "danger");
      return;
    }

    const groupData = {
      groupName: groupName.value,
      department: department.value,
      projectTopic: projectTopic.value,
      students: selectedStudents
    };

    const groupId = groupIdField.value;
    if (!groupId) {
      // Create new group (POST)
      fetch("http://localhost:5000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify(groupData)
      })
        .then(response => {
          if (!response.ok) throw new Error("Group creation failed");
          return response.json();
        })
        .then(() => {
          showAlert("Group created successfully!", "success");
          groupForm.reset();
          groupIdField.value = "";
          selectedStudents = [];
          updateSelectedStudentsUI();
          fetchGroups();
        })
        .catch(error => {
          console.error("Error creating group:", error);
          showAlert("Error creating group", "danger");
        });
    } 
    
    else {
      
      // Update existing group (PUT)
      fetch(`http://localhost:5000/api/groups/${groupId}`, {

        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify(groupData)
      })
        .then(response => {
          if (!response.ok) throw new Error("Group update failed");
          return response.json();
        })
        .then(() => {
          showAlert("Group updated successfully!", "success");
          groupForm.reset();
          groupIdField.value = "";
          selectedStudents = [];
          updateSelectedStudentsUI();
          fetchGroups();
        })
        .catch(error => {
          console.error("Error updating group:", error);
          showAlert("Error updating group", "danger");
        });
    }
  });

  // Reset the form to default (create mode)
  document.getElementById("resetForm").addEventListener("click", function () {
    groupForm.reset();
    groupIdField.value = "";
    selectedStudents = [];
    updateSelectedStudentsUI();
    document.getElementById("formTitle").textContent = "Create a New Group";
  });

  /* =========================
     STUDENT SEARCH FUNCTIONS
  ============================ */
  // Listen for input and search button clicks
  searchInput.addEventListener("input", handleSearch);
  searchButton.addEventListener("click", handleSearch);

  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (query === "") {
      searchResultsUL.style.display = "none";
      return;
    }
    const results = allStudents.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query)
    );
    displaySearchResults(results);
  }

  function displaySearchResults(results) {
    searchResultsUL.innerHTML = "";
    if (results.length === 0) {
      const li = document.createElement("li");
      li.className = "list-group-item text-center text-muted";
      li.textContent = "No students found";
      searchResultsUL.appendChild(li);
    } else {
      results.forEach(student => {
        const isSelected = selectedStudents.some(s => s._id === student._id);
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.style.cursor = "pointer";
        li.addEventListener("click", () => toggleStudentSelection(student));
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-bold">${student.name}</div>
              <div class="small text-secondary">${student.department} • Level ${student.level}</div>
            </div>
            ${isSelected ? '<span class="badge bg-success">Selected</span>' : ""}
          </div>
        `;
        searchResultsUL.appendChild(li);
      });
    }
    searchResultsUL.style.display = "block";
  }

  function toggleStudentSelection(student) {
    const index = selectedStudents.findIndex(s => s._id === student._id);
    if (index > -1) {
      selectedStudents.splice(index, 1);
    } else {
      selectedStudents.push(student);
    }
    updateSelectedStudentsUI();
    handleSearch(); // Refresh the search list to update selected status
  }

  function updateSelectedStudentsUI() {
    selectedStudentsList.innerHTML = "";
    selectedStudents.forEach(student => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        ${student.name}
        <button class="btn btn-sm btn-danger" onclick="removeStudent('${student._id}')">&times;</button>
      `;
      selectedStudentsList.appendChild(li);
    });
  }

  // Make removeStudent globally accessible
  window.removeStudent = function (studentId) {
    selectedStudents = selectedStudents.filter(student => student._id !== studentId);
    updateSelectedStudentsUI();
    handleSearch();
  };

  /* =========================
     EDIT AND DELETE FUNCTIONS
  ============================ */
  // Edit group – fill the form with the group data
// Edit group – fill the form with the group data
window.editGroup = function (groupId) {
  const group = groups.find(g => g._id === groupId);
  if (!group) return;

  groupIdField.value = group._id;
  groupName.value = group.groupName;
  department.value = group.department;
  projectTopic.value = group.projectTopic;

  // Ensure that group.students contains the full student details.
  // This works if your GET groups route uses populate on "students".
  selectedStudents = group.students.map(student => ({
    _id: student._id,
    name: student.name,
    email: student.email,
    level: student.level,
    department: student.department,
    matric_number: student.matric_number
  }));
  updateSelectedStudentsUI();

  document.getElementById("formTitle").textContent = "Edit Group";
};


  // Delete group with a confirmation modal
  window.deleteGroup = async function (groupId) {
    const confirmed = await confirmDelete();
    if (confirmed) {
      fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + accessToken }
      })
        .then(response => {
          if (!response.ok) throw new Error("Delete failed");
          return response.json();
        })
        .then(() => {
          showAlert("Group deleted successfully!", "warning");
          fetchGroups();
        })
        .catch(error => {
          console.error("Error deleting group:", error);
          showAlert("Error deleting group", "danger");
        });
    }
  };

  /* =========================
     ALERT & CONFIRMATION FUNCTIONS
  ============================ */
  function showAlert(message, type = "success") {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = 1050;
    alertDiv.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close";
    closeButton.setAttribute("data-bs-dismiss", "alert");
    closeButton.setAttribute("aria-label", "Close");
    alertDiv.appendChild(closeButton);

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("hide");
      setTimeout(() => {
        alertDiv.remove();
      }, 500);
    }, 3000);
  }

  function confirmDelete() {
    return new Promise((resolve) => {

      const modalHTML = `
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to delete this group?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Yes</button>
              </div>
            </div>
          </div>
        </div>
      `;

      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = modalHTML;
      document.body.appendChild(modalContainer);

      const deleteModalEl = modalContainer.querySelector("#deleteModal");
      const deleteModal = new bootstrap.Modal(deleteModalEl);
      let confirmed = false;

      deleteModalEl.querySelector("#confirmDeleteBtn").addEventListener("click", function () {
        confirmed = true;
        deleteModal.hide();
      });

      deleteModalEl.addEventListener("hidden.bs.modal", function () {
        modalContainer.remove();
        resolve(confirmed);
      });

      deleteModal.show();
    });
  }
});
