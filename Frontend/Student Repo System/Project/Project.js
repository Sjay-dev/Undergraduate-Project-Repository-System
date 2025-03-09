document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const studentID = localStorage.getItem("studentID");

    const projectTopicInput = document.getElementById("projectTopic");
    const projectDescriptionInput = document.getElementById("projectDescription");
    const projectStatus = document.getElementById("projectStatus");
    const projectObjectiveInput = document.getElementById("projectObjective");
    const projectRoleSelect = document.getElementById("projectRole");
    const documentUploadInput = document.getElementById("documentUpload");

    if (!token || !studentID) {
        console.error("User not authenticated. Token or Student ID missing.");
        return;
    }

    // Fetch group data and populate project topic
    async function fetchGroupData() {
        try {
            const response = await fetch(`http://localhost:5000/api/students/${studentID}/groups`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch group details.");

            const studentGroups = await response.json();
            if (studentGroups.length > 0) {
                const group = studentGroups[0]; // Assuming the student is in one group
                projectTopicInput.value = group.projectTopic || "";
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    }

    // Handle form submission to update project details
    document.getElementById("projectForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const projectData = {
            projectTopic: projectTopicInput.value.trim(),
            projectDescription: projectDescriptionInput.value.trim(),
            projectStatus: projectStatus.textContent.trim(),
            projectObjective: projectObjectiveInput.value.trim(),
            projectRoles: Array.from(projectRoleSelect.selectedOptions).map(option => option.value),
        };

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${studentID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) throw new Error("Failed to update project details.");

            alert("Project details updated successfully!");
        } catch (error) {
            console.error("Error updating project details:", error);
            alert("An error occurred while updating project details.");
        }
    });

    // Handle document upload
    documentUploadInput?.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("document", file);

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${studentID}/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload document.");

            alert("Document uploaded successfully!");
        } catch (error) {
            console.error("Error uploading document:", error);
            alert("An error occurred while uploading the document.");
        }
    });

    // Initialize Data Fetching
    fetchGroupData();
});
