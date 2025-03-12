document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const studentID = localStorage.getItem("studentID");

    let groupData = null; // Global variable to store fetched group data

    const projectTopic = document.getElementById("projectTopic");
    const projectStatus = document.getElementById("projectStatus");
    const projectDescription = document.getElementById("projectDescription");
    const projectObjective = document.getElementById("projectObjective");
    const chapterNumber = document.getElementById("chapterNumber");
    const documentUpload = document.getElementById("documentUpload");
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
                groupData = studentGroups[0]; // Store fetched data globally
                projectTopic.textContent = groupData.projectTopic || "No project topic yet";
                projectStatus.textContent = groupData.projectStatus || "No project status yet";
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    }

    documentationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!groupData) {
            alert("Group data is not available yet. Please try again later.");
            return;
        }

        const file = documentUpload.files[0]; // Get the selected file

        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        // ✅ Use FormData to handle file uploads
        const formData = new FormData();
        formData.append("projectTopic", groupData.projectTopic);
        formData.append("projectDescription", projectDescription.value);
        formData.append("projectObjective", projectObjective.value);
        formData.append("chapterNumber", chapterNumber.value);
        formData.append("chapterDocument", file); // Attach the file
        formData.append("chapterStatus", chapterStatus);

        console.log("FormData prepared:", formData);

        try {
            const response = await fetch("http://localhost:5000/api/documentations", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`, // Do NOT set "Content-Type" manually for FormData
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to submit documentation.");

            alert("✅ Documentation submitted successfully!");
        } catch (error) {
            console.error("Error submitting documentation:", error);
            alert("❌ An error occurred while submitting documentation.");
        }
    });

    // Fetch group data when the page loads
    await fetchGroupData();
});
