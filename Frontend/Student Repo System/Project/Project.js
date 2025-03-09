document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const studentID = localStorage.getItem("studentID");

    const projectTopicInput = document.getElementById("projectTopic");
    const projectDescriptionInput = document.getElementById("projectDescription");
    const projectStatus = document.getElementById("projectStatus");
    const projectObjectiveInput = document.getElementById("projectObjective");
    const documentUploadInput = document.getElementById("documentUpload");
    const updateProjectTopicButton = document.getElementById("updateProjectTopic");
    const documentationForm = document.getElementById("documentationForm");

    if (!token || !studentID) {
        console.error("User not authenticated. Token or Student ID missing.");
        return;
    }

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
                const group = studentGroups[0];
                projectTopicInput.value = group.projectTopic || "No project topic yet";
                projectStatus.textContent = group.projectStatus || "No project status yet";
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    }

    updateProjectTopicButton.addEventListener("click", async () => {
        const newProjectTopic = projectTopicInput.value.trim();
        if (!newProjectTopic) return alert("Project topic cannot be empty");

        try {   
            const response = await fetch(`http://localhost:5000/api/projects/${studentID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ projectTopic: newProjectTopic }),
            });

            if (!response.ok) throw new Error("Failed to update project topic.");

            alert("Project topic updated successfully!");
        } catch (error) {
            console.error("Error updating project topic:", error);
            alert("An error occurred while updating project topic.");
        }
    });

    documentationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const projectData = {
            projectDescription: projectDescriptionInput.value.trim(),
            projectObjective: projectObjectiveInput.value.trim(),
        };

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${studentID}/documentation`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) throw new Error("Failed to update documentation.");

            alert("Documentation updated successfully!");
        } catch (error) {
            console.error("Error updating documentation:", error);
            alert("An error occurred while updating documentation.");
        }
    });

    documentUploadInput.addEventListener("change", async (e) => {
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

    fetchGroupData();
});
