const currentUrl = window.location.href;
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('projectid');

if (projectId) {
  // Fetch profile data using the extracted projectId
  fetch(`http://localhost:3000/user-profile/${projectId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(profileData => {
      // Check if profileData is not empty
      if (Object.keys(profileData).length === 0) {
        throw new Error('Profile not found');
      }

      // Update HTML elements with profile data
      document.getElementById('dept').innerText = profileData.department;
      document.getElementById('title').innerText = profileData.title;
      document.getElementById('desc').innerText = profileData.description;
      document.getElementById('student').innerText = profileData.students;

      // Pre-fill the form with existing profile data
      document.getElementById('department').value = profileData.department;
      document.getElementById('titleInput').value = profileData.title;
      document.getElementById('description').value = profileData.description;
      document.getElementById('students').value = profileData.students;
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
    });

  // Show the edit form
  document.getElementById('editButton').addEventListener('click', () => {
    document.getElementById('editForm').style.display = 'block';
  });

  // Hide the edit form on cancel
  document.getElementById('cancelButton').addEventListener('click', () => {
    document.getElementById('editForm').style.display = 'none';
  });

  // Handle form submission
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedProfile = {
      department: document.getElementById('department').value,
      title: document.getElementById('titleInput').value,
      description: document.getElementById('description').value,
      students: document.getElementById('students').value,
    };

    fetch(`/user-profile/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProfile)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Profile updated successfully:', data);
        // Update the displayed profile data
        document.getElementById('dept').innerText = updatedProfile.department;
        document.getElementById('title').innerText = updatedProfile.title;
        document.getElementById('desc').innerText = updatedProfile.description;
        document.getElementById('student').innerText = updatedProfile.students;
        // Hide the edit form
        document.getElementById('editForm').style.display = 'none';
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  });
} else {
  console.error('Project ID not found in the URL');
}

//     })
//     .catch(error => {
//       console.error('Error fetching profile data:', error);
//     });
// } else {
//   console.error('Project ID not found in the URL');
// }