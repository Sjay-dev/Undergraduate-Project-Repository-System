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

    // Ensure user is authenticated
    if (!token || !studentID) {
        console.error("❌ User not authenticated. Token or Student ID missing.");
        return;
    }

    /** Fetch student’s group data **/
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

    /** Upload file and return file ID **/
/** Upload file when selected */
documentUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) return; // ✅ No file selected


        const fileId = await uploadFile(file);
        localStorage.setItem("uploadedFileId", fileId); // ✅ Save file ID for later use
        alert("✅ File uploaded successfully!");
   
});


async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "❌ File upload failed.");
    }

    return result.fileId;
}

      
      
    
    

documentationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ Ensure a file is uploaded before submission
    const uploadedFileId = localStorage.getItem("uploadedFileId");
    if (!uploadedFileId) {
        alert("⚠️ Please upload a document before submitting.");
        return;
    }

    const documentation = {
        projectTopic: groupData.projectTopic,
        projectDescription: projectDescription.value,
        projectObjective: projectObjective.value,
        chapterNumber: chapterNumber.value,
        chapterDocument: uploadedFileId, // ✅ Use the uploaded file ID
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
        fetchDocumentations(); // ✅ Refresh documentation list

    } catch (error) {
        console.error("❌ Error submitting documentation:", error);
        alert("❌ Submission failed. Please try again.");
    }
});


    /** Fetch and display existing documentations **/
    async function fetchDocumentations() {
        try {
            const response = await fetch(`http://localhost:5000/api/documentations?studentID=${studentID}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
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

    // Load initial data
    await fetchGroupData();
    await fetchDocumentations();
});
