document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    const studentID = localStorage.getItem("studentID");

    let groupData = null;
    const chapterStatus = "Pending Review";

    // UI Elements
    const projectTopic = document.getElementById("projectTopic");
    const projectStatus = document.getElementById("projectStatus");
    const documentationForm = document.getElementById("documentationForm");
    const projectDesc = document.getElementById("projectDescription");
    const projectObj = document.getElementById("projectObjective");
    const chapterNumber = document.getElementById("chapterNumber");
    const documentUploadForm = document.getElementById("documentUploadForm");
    const documentUpload = document.getElementById("documentUpload");
    const groupTableBody = document.getElementById("groupTableBody");

    if (!token || !studentID) {
        console.error("❌ User not authenticated. Token or Student ID missing.");
        return;
    }

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
            groupData = studentGroups[0];

            

            if (studentGroups.length > 0) {
                projectTopic.textContent = groupData.projectTopic || "No project topic yet";
                projectStatus.textContent = groupData.projectStatus || "No project status yet";
                projectDesc.value = groupData.projectDesc || "";
                projectObj.value = groupData.projectObj || "";
            } else {
                console.warn("⚠️ No group found for this student.");
            }
        } catch (error) {
            console.error("❌ Error fetching group details:", error);
        }
    }

    documentUpload.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("❌ No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

      
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("❌ File upload failed.");

            const result = await response.json();

            localStorage.setItem("uploadedFileId", result.fileId);

            alert("✅ File uploaded successfully!");
            documentUpload.value = "";
    
        
    });

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

            if (!response.ok) throw new Error(result.message || "❌ Failed to submit documentation.");

            alert("✅ Documentation submitted successfully!");
            documentationForm.reset();
        } catch (error) {
            console.error("❌ Error submitting documentation:", error);
            alert("❌ Submission failed. Please try again.");
        }
    });

    await fetchGroupData();
});
