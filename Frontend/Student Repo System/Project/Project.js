document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    const studentID = localStorage.getItem("studentID");

    let groupData = null;
    const chapterStatus = "Pending Review";

    // UI Elements
    const projectTopic = document.getElementById("projectTopic");
    const projectStatus = document.getElementById("projectStatus");
    const documentationForm = document.getElementById("documentationForm");
    const projectDescription = document.getElementById("projectDescription");
    const projectObjective = document.getElementById("projectObjective");
    const chapterNumber = document.getElementById("chapterNumber");
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

            if (studentGroups.length > 0) {
                groupData = studentGroups[0];
                projectTopic.textContent = groupData.projectTopic || "No project topic yet";
                projectStatus.textContent = groupData.projectStatus || "No project status yet";
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

        try {
            const response = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("❌ File upload failed.");

            alert("✅ File uploaded successfully!");
            documentUpload.value = "";
        } catch (error) {
            console.error("❌ File upload error:", error);
            alert(error.message);
        }
    });

    documentationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const documentation = {
            projectTopic: groupData?.projectTopic || "N/A",
            projectDescription: projectDescription.value,
            projectObjective: projectObjective.value,
            chapterNumber: chapterNumber.value,
            chapterDocument: "omo",
            chapterStatus: chapterStatus,
        };

        try {
            const response = await fetch("http://localhost:5000/api/documentations", {
                method: "POST",
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

    async function fetchDocumentations() {
        try {
            const response = await fetch(`http://localhost:5000/api/documentations?studentID=${studentID}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch documentations.");

            const documentations = await response.json();
            groupTableBody.innerHTML = "";

            if (documentations.length === 0) {
                groupTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">No documentations found.</td></tr>`;
                return;
            }

            documentations.forEach((doc) => {
                const row = `
                    <tr>
                        <td>${doc.projectTopic}</td>
                        <td>${doc.department || "N/A"}</td>
                        <td>${doc.chapterNumber}</td>
                        <td>${doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>
                            <a href="http://localhost:5000/api/download/${doc.chapterDocument}" target="_blank" class="btn btn-sm btn-success">View</a>
                        </td>
                    </tr>
                `;
                groupTableBody.innerHTML += row;
            });
        } catch (error) {
            console.error("❌ Error fetching documentations:", error);
        }
    }

    await fetchGroupData();
});
