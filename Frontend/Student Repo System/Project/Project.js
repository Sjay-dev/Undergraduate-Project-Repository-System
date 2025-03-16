document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const studentID = localStorage.getItem("studentID");
  let groupData = null;

  // UI Elements for project details and documentation update
  const projectTopicEl = document.getElementById("projectTopic");
  const projectStatusEl = document.getElementById("projectStatus");
  const documentationForm = document.getElementById("documentationForm");
  const projectDesc = document.getElementById("projectDescription");
  const projectObj = document.getElementById("projectObjective");

  // UI Elements for file upload
  const documentUploadForm = document.getElementById("documentUploadForm");
  const chapterNumberInput = document.getElementById("chapterNumber");
  const documentUploadInput = document.getElementById("documentUpload");
  const groupIdInput = document.getElementById("groupId");

  // UI Element for existing documentation table
  const documentationTableBody = document.getElementById("groupTableBody");

  // Fetch group data for the current student
  async function fetchGroupData() {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${studentID}/groups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch group details.");

      const studentGroups = await response.json();
      if (studentGroups.length > 0) {
        groupData = studentGroups[0];
        projectTopicEl.textContent = groupData.projectTopic || "No project topic yet";
        projectStatusEl.textContent = groupData.projectStatus || "No project status yet";
        projectDesc.value = groupData.projectDesc || "";
        projectObj.value = groupData.projectObj || "";
        // Set the group ID in the hidden input for file upload
        groupIdInput.value = groupData._id;
      } else {
        console.warn("⚠️ No group found for this student.");
      }
    } catch (error) {
      console.error("❌ Error fetching group details:", error);
    }
  }

  // Fetch existing chapter submissions for the current group
  async function fetchChapterSubmissions() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chapterSubmissions/group/${encodeURIComponent(groupData._id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        console.error("Error fetching chapter submissions");
        return [];
      }
      const submissions = await response.json();
      console.log(submissions);
      return submissions;
    } catch (error) {
      console.error("Error fetching chapter submissions:", error);
      return [];
    }
  }
  

  // Populate the Existing Documentation table with chapter submissions
  function populateDocumentationTable(submissions) {
    documentationTableBody.innerHTML = "";
    submissions.forEach((submission) => {
      const tr = document.createElement("tr");

      // Chapter Submitted
      const tdChapter = document.createElement("td");
      tdChapter.textContent = submission.chapterName || "N/A";
      tr.appendChild(tdChapter);

      // Date Submitted
      const tdDate = document.createElement("td");
      tdDate.textContent = submission.dateSubmitted
        ? new Date(submission.dateSubmitted).toLocaleString()
        : "N/A";
      tr.appendChild(tdDate);

      // Chapter Status (default to "Pending" if not provided)
      const tdStatus = document.createElement("td");
      tdStatus.textContent = submission.status || "Pending";
      tr.appendChild(tdStatus);

      // Actions (View and Download)
      const tdActions = document.createElement("td");

      const btnView = document.createElement("button");
      btnView.className = "btn btn-info btn-sm mr-2";
      btnView.textContent = "View";
      btnView.addEventListener("click", () => {
        window.open(`http://localhost:5000/api/chapterSubmissions/view/${submission._id}`, "_blank");
      });
      tdActions.appendChild(btnView);

      const btnDownload = document.createElement("button");
      btnDownload.className = "btn btn-primary btn-sm";
      btnDownload.textContent = "Download";
      btnDownload.addEventListener("click", () => {
        window.open(`http://localhost:5000/api/chapterSubmissions/download/${submission._id}`, "_blank");
      });
      tdActions.appendChild(btnDownload);

      tr.appendChild(tdActions);
      documentationTableBody.appendChild(tr);
    });
  }

  // Handle file upload submission for documentation (chapter submission)
  documentUploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the file from the input
    const file = documentUploadInput.files[0];
    console.log("Selected file:", file);
    if (!file) {
      alert("❌ No file selected.");
      return;
    }

    // Get chapter number and validate
    const chapterName = chapterNumberInput.value;
    if (!chapterName) {
      alert("❌ Please enter a chapter number.");
      return;
    }

    // Create FormData and append the file and other data
    const formData = new FormData();
    formData.append("file", file); // Field name "file" must match your Multer config
    formData.append("chapterName", chapterName);
    formData.append("groupId", groupData._id);

    console.log("FormData keys:", [...formData.keys()]);

    try {
      // Do not set the "Content-Type" header manually; let the browser handle it for FormData
      const response = await fetch("http://localhost:5000/api/chapterSubmissions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.message || "❌ File upload failed.");
      }

      const result = await response.json();
      console.log("Upload result:", result);
      alert("✅ File uploaded successfully!");
      // Clear the input fields on success
      documentUploadInput.value = "";
      chapterNumberInput.value = "";
      
      // Refresh the documentation table after successful upload
      const submissions = await fetchChapterSubmissions();
      populateDocumentationTable(submissions);
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("❌ Documentation upload failed. Please try again.");
    }
  });

  // Handle documentation update (if needed)
  documentationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const documentation = {
      projectDesc: projectDesc.value,
      projectObj: projectObj.value,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(documentation),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "❌ Failed to update documentation.");
      alert("✅ Documentation updated successfully!");
      documentationForm.reset();
    } catch (error) {
      console.error("❌ Error updating documentation:", error);
      alert("❌ Update failed. Please try again.");
    }
  });

  // Fetch the initial group data and then fetch & populate documentation submissions
  await fetchGroupData();
  if (groupData) {
    const submissions = await fetchChapterSubmissions();
    populateDocumentationTable(submissions);
  }
});
