document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const studentID = localStorage.getItem("studentID");

    if (!token || !studentID) {
        console.error("User not authenticated. Token or Student ID missing.");
        return;
    }

    // Select necessary elements
    const projectTopicElement = document.getElementById("projectTopic");
    const projectStatusElement = document.getElementById("projectStatus");
    const projectDescriptionInput = document.getElementById("projectDescription");
    const projectObjectiveInput = document.getElementById("projectObjective");
    const chapterNumberInput = document.getElementById("chapterNumber");
    const documentUploadInput = document.getElementById("documentUpload");
    const documentationForm = document.querySelector("form.card"); 
    const chapterStatus = "Pending Review";
    const tableBody = document.getElementById("groupTableBody");

    let groupData = null;
    let editMode = false;
    let editingDocId = null;

    // Fetch group data
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
                groupData = studentGroups[0];
                projectTopicElement.textContent = groupData.projectTopic || "No project topic yet";
                projectStatusElement.textContent = groupData.projectStatus || "No project status yet";
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    }

    // Fetch existing documentations
    async function fetchExistingDocumentations() {
        try {
            const response = await fetch(`http://localhost:5000/api/documentations/${studentID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch documentations.");

            const documents = await response.json();
            tableBody.innerHTML = "";
            documents.forEach((doc) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${doc.projectTopic}</td>
                    <td>${doc.department || "Unknown"}</td>
                    <td>${doc.chapterNumber}</td>
                    <td>${new Date(doc.dateSubmitted).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-btn" data-id="${doc._id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${doc._id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach event listeners to edit and delete buttons
            document.querySelectorAll(".edit-btn").forEach((button) =>
                button.addEventListener("click", (e) => editDocumentation(e.target.dataset.id))
            );

            document.querySelectorAll(".delete-btn").forEach((button) =>
                button.addEventListener("click", (e) => deleteDocumentation(e.target.dataset.id))
            );
        } catch (error) {
            console.error("Error fetching documentations:", error);
        }
    }

    // Handle form submission
    documentationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!groupData) {
            alert("Group data is not available yet. Please try again later.");
            return;
        }

        const formData = {
            projectTopic: groupData.projectTopic,
            projectDescription: projectDescriptionInput.value,
            projectObjective: projectObjectiveInput.value,
            chapterNumber: chapterNumberInput.value,
            chapterDocument: documentUploadInput.value,
            chapterStatus: chapterStatus
        };

        try {
            const url = editMode
                ? `http://localhost:5000/api/documentations/${editingDocId}`
                : "http://localhost:5000/api/documentations";

            const method = editMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(editMode ? "Failed to update documentation." : "Failed to submit documentation.");

            alert(editMode ? "Documentation updated successfully!" : "Documentation submitted successfully!");
            documentationForm.reset();
            editMode = false;
            editingDocId = null;
            await fetchExistingDocumentations();
        } catch (error) {
            console.error("Error submitting documentation:", error);
            alert("An error occurred while submitting documentation.");
        }
    });

    // Edit existing documentation
    async function editDocumentation(docId) {
        try {
            const response = await fetch(`http://localhost:5000/api/documentations/${docId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch documentation details.");

            const doc = await response.json();
            projectDescriptionInput.value = doc.projectDescription;
            projectObjectiveInput.value = doc.projectObjective;
            chapterNumberInput.value = doc.chapterNumber;

            editMode = true;
            editingDocId = docId;
        } catch (error) {
            console.error("Error fetching documentation details:", error);
        }
    }

    // Delete documentation
    async function deleteDocumentation(docId) {
        if (!confirm("Are you sure you want to delete this documentation?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/documentations/${docId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete documentation.");

            alert("Documentation deleted successfully!");
            await fetchExistingDocumentations();
        } catch (error) {
            console.error("Error deleting documentation:", error);
            alert("An error occurred while deleting documentation.");
        }
    }

    // Fetch data on page load
    await fetchGroupData();
    await fetchExistingDocumentations();
});
