document.addEventListener('DOMContentLoaded', function () {
  const preferredSelect = document.querySelector('#preferredContact');
  const phoneGroup = document.querySelector('#phoneGroup');
  const form = document.querySelector('#contactForm');
  const statusEl = document.querySelector('#formStatus');

  function togglePhoneField() {
    if (preferredSelect.value === 'phone') {
      phoneGroup.style.display = 'block';
    } else {
      phoneGroup.style.display = 'none';
    }
  }

  if (preferredSelect) {
    preferredSelect.addEventListener('change', togglePhoneField);
    togglePhoneField();
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      const formData = new FormData(form);
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonData)
        });
        if (response.ok) {
          statusEl.style.color = 'green';
          statusEl.textContent = 'Your request has been submitted. A confirmation email will be sent shortly.';
          form.reset();
          togglePhoneField();
        } else {
          const data = await response.json();
          throw new Error(data.error || 'Submission failed');
        }
      } catch (err) {
        statusEl.style.color = 'red';
        statusEl.textContent = 'An error occurred submitting your request. Please try again later.';
      }
    });
  }
});