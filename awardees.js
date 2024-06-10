var btn=document.getElementById('search');
btn.addEventListener('click', function() {

var department = document.getElementById('department').value;
var category = document.getElementById('category').value;
var year= document.getElementById('year').value;
fetch(`/awardees?department=${department}&category=${category}&year=${year}`) 
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '';

            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.A_Name}</td>
                    <td>${entry.Title}</td>
                    <td>${entry.Pub_details}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});