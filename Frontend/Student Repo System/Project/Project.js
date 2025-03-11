document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const studentID = localStorage.getItem("studentID");

    // Global variable to store fetched group data
    let groupData = null;

    const projectTopicElement = document.getElementById("projectTopic");
    const projectStatusElement = document.getElementById("projectStatus");
    const projectDescriptionInput = document.getElementById("projectDescription");
    const projectObjectiveInput = document.getElementById("projectObjective");
    const chapterNumberInput = document.getElementById("chapterNumber");
    const documentUploadInput = document.getElementById("documentUpload");
    const documentationForm = document.getElementById("documentationForm");
    const chapterStatus = "Pending Review";

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
                // Store the fetched group data in the global variable
                groupData = studentGroups[0];
                projectTopicElement.textContent = groupData.projectTopic || "No project topic yet";
                projectStatusElement.textContent = groupData.projectStatus || "No project status yet";
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    }

    documentationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Ensure groupData is available before submitting
        if (!groupData) {
            alert("Group data is not available yet. Please try again later.");
            return;
        }

        // Use the fetched projectTopic from groupData in your formData
        const formData = {
            projectTopic: groupData.projectTopic,
            projectDescription: projectDescriptionInput.value,
            projectObjective: projectObjectiveInput.value,
            chapterNumber: chapterNumberInput.value,
            chapterDocument: documentUploadInput.value,
            chapterStatus: chapterStatus
        };

        console.log("FormData", formData);

        try {
            const response = await fetch("http://localhost:5000/api/documentations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(formData),
            });

            console.log("Response", response);
            if (!response.ok) throw new Error("Failed to submit documentation.");

            alert("Documentation submitted successfully!");
        } catch (error) {
            console.error("Error submitting documentation:", error);
            alert("An error occurred while submitting documentation.");
        }
    });

    // Call the fetch function to load group data on page load
    await fetchGroupData();
});
