document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/Frontend/Lecturers System/Sign in/Login.html";
      return;
    }
    
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
        populateSubmissionsTable(groups);
      } else {
        console.error("Error fetching groups data.");
      }
    } catch (error) {
      console.error("Error fetching groups data:", error);
    }
  });
  
  // Helper function to fetch file info using groupId
  async function fetchFileByGroupId(groupId) {
    try {
      const response = await fetch(`http://localhost:5000/api/files?groupId=${encodeURIComponent(groupId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        console.error("Error fetching file for groupId:", groupId);
        return null;
      }
      const files = await response.json();
      return files && files.length > 0 ? files[0] : null;
    } catch (error) {
      console.error("Error fetching file by groupId:", error);
      return null;
    }
  }
  
  // Populate the submissions table using groups data
  async function populateSubmissionsTable(groups) {
    const tableBody = document.getElementById("submissionsTableBody");
    tableBody.innerHTML = "";
    
    for (const group of groups) {
      const tr = document.createElement("tr");
    
      // Group Name
      const tdGroupName = document.createElement("td");
      tdGroupName.textContent = group.groupName || "Unknown Group";
      tr.appendChild(tdGroupName);
    
      // Project Title
      const tdProjectTitle = document.createElement("td");
      tdProjectTitle.textContent = group.projectTopic || "Unknown Project";
      tr.appendChild(tdProjectTitle);
    
      // Chapter Submitted (placeholder)
      const tdChapter = document.createElement("td");
      tdChapter.textContent = "N/A";
      tr.appendChild(tdChapter);
    
      // Date Submitted (placeholder)
      const tdDate = document.createElement("td");
      tdDate.textContent = "N/A";
      tr.appendChild(tdDate);
    
      // Status (default to "Pending")
      const tdStatus = document.createElement("td");
      tdStatus.textContent = group.status || "Pending";
      tr.appendChild(tdStatus);
    
      // Actions cell
      const tdActions = document.createElement("td");
    
      // Download Button (initially disabled)
      const btnDownload = document.createElement("button");
      btnDownload.className = "btn btn-primary btn-sm";
      btnDownload.textContent = "Download";
      btnDownload.disabled = true;
      tdActions.appendChild(btnDownload);
    
      // Feedback Button
      const btnFeedback = document.createElement("button");
      btnFeedback.className = "btn btn-warning btn-sm mx-1";
      btnFeedback.textContent = "Feedback";
      btnFeedback.addEventListener("click", () => {
        showFeedbackPopup(group.groupName, group);
      });
      tdActions.appendChild(btnFeedback);
    
    //   // Plagiarism Check Button (placeholder)
    //   const btnPlagiarism = document.createElement("button");
    //   btnPlagiarism.className = "btn btn-danger btn-sm";
    //   btnPlagiarism.textContent = "Check Plagiarism";
    //   btnPlagiarism.addEventListener("click", () => {
    //     checkPlagiarism();
    //   });
    //   tdActions.appendChild(btnPlagiarism);
    
      tr.appendChild(tdActions);
      tableBody.appendChild(tr);
    
      // Fetch file info using the group's _id
      const fileDoc = await fetchFileByGroupId(group._id.toString());
      if (fileDoc) {
        tdChapter.textContent = fileDoc.metadata?.chapterName || "N/A";
        tdDate.textContent = new Date(fileDoc.uploadDate).toLocaleString() || "N/A";
    
        btnDownload.disabled = false;
        btnDownload.addEventListener("click", () => {
          downloadSubmission(fileDoc._id.toString());
        });
      }
    }
  }
    
  // Download submission file using fileId
  function downloadSubmission(fileId) {
    if (fileId) {
      window.open(`http://localhost:5000/api/files/${fileId}`, "_blank");
    } else {
      alert("File not available for download.");
    }
  }
    
  // Placeholder for plagiarism check functionality

    
  // ------------------------------
  // Feedback Modal Code
  // ------------------------------
    
  // Global variables for feedback modal
  let selectedFeedbackStatus = null;
  let currentGroupId = null;
    
  // Show feedback modal for a given group
  function showFeedbackPopup(groupName, group) {
    currentGroupId = group._id;
    document.getElementById("modalGroupName").innerText = `Feedback for ${groupName}`;
    document.getElementById("feedbackTextArea").value = "";
    selectedFeedbackStatus = null;
    document.getElementById("btnReviewed").classList.remove("active");
    document.getElementById("btnRejected").classList.remove("active");
    
    const feedbackModal = new bootstrap.Modal(document.getElementById("feedbackModal"));
    feedbackModal.show();
  }
    
  // Event listeners for modal status buttons
  document.getElementById("btnReviewed").addEventListener("click", () => {
    selectedFeedbackStatus = "Reviewed";
    document.getElementById("btnReviewed").classList.add("active");
    document.getElementById("btnRejected").classList.remove("active");
  });
  document.getElementById("btnRejected").addEventListener("click", () => {
    selectedFeedbackStatus = "Rejected";
    document.getElementById("btnRejected").classList.add("active");
    document.getElementById("btnReviewed").classList.remove("active");
  });
    
  // Confirm feedback from modal
  document.getElementById("btnConfirmFeedback").addEventListener("click", async () => {
    if (!selectedFeedbackStatus) {
      alert("Please select a status (Reviewed or Rejected).");
      return;
    }
    const feedback = document.getElementById("feedbackTextArea").value.trim();
    if (!feedback) {
      alert("Please enter your feedback.");
      return;
    }
    
    await updateChapterStatus(currentGroupId, selectedFeedbackStatus, feedback);
    
    const feedbackModalEl = document.getElementById("feedbackModal");
    const modalInstance = bootstrap.Modal.getInstance(feedbackModalEl);
    modalInstance.hide();
  });
    
  // Function to update chapter status on backend
  async function updateChapterStatus(groupId, status, feedback) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/chapterSubmissions/${groupId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status, feedback })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update chapter status");
      }
      const result = await response.json();
      alert("Status updated successfully!");
      console.log("Update result:", result);
    } catch (error) {
      console.error("Error updating chapter status:", error);
      alert("Error updating status. Please try again.");
    }
  }
  