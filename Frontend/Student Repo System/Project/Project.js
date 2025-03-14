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
  
    if (!token || !studentID) {
      console.error("❌ User not authenticated. Token or Student ID missing.");
      return;
    }
  
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
  
    // Handle file upload submission
    documentUploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
    
      // Get the file from the input and log it for debugging
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
      formData.append("file", file); // Field name "file" must match Multer config
      formData.append("chapterName", chapterName);
      formData.append("groupId", groupData._id);

      
    
      console.log("FormData keys:", [...formData.keys()]);
    
      // Retrieve auth token from localStorage
      const token = localStorage.getItem("token");
    
      try {
        // Do not set the "Content-Type" header manually; let the browser handle it for FormData
        const response = await fetch("http://localhost:5000/api/upload", {
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
      } catch (error) {
        alert("Documentation upload successful");
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
  
    // Fetch the initial group data
    await fetchGroupData();
  });
  