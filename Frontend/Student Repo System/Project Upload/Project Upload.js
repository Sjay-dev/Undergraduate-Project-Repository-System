document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const topic = document.getElementById("projectTopic").value.trim();
    const basedOn = document.getElementById("basedOnProject").value.trim();
    const files = document.getElementById("fileInput").files;
  
    // Basic validation
    if (!topic) {
      alert("Please enter a project topic.");
      return;
    }
    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }
  
    // Build a string of file names
    let fileNames = "Files to upload:\n";
    for (let file of files) {
      fileNames += `- ${file.name}\n`;
    }
  
    // Display the upload information (placeholder logic; replace with actual upload code)
    alert(`Project Topic: ${topic}\nBased on: ${basedOn || 'N/A'}\n${fileNames}`);
  
    // Optionally, display file names on the page
    document.getElementById('fileList').textContent = fileNames;
  });
  