// run on node server using cmd C:\xampp\htdocs\ResearchWebsite>node server.js
var btn=document.getElementById('search');
btn.addEventListener('click', function() {

    var department = document.getElementById('department').value;
    var status = document.getElementById('status').value;

//make GET request to the /research endpoint of your server. 
    fetch(`/research?department=${department}&status=${status}`) 
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '';

            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.R_Name}</td>
                    <td>${entry.Investigator}</td>
                    <td>${entry.Fund_agency}</td>
                    <td>${entry.Year}</td>
                    <td>${entry.Fund}</td>     
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});