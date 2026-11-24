const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const honeypotInput = document.getElementById('honeypot');
const startTime = performance.now();
const durationInput = document.getElementById('time-to-submit');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const endTime = performance.now() - startTime;
  const duration = (endTime / 1000).toFixed(2); 
  durationInput.value = duration;

  const honeypotTriggered = honeypotInput.value !== '';

  if ((endTime < 3000) || honeypotTriggered) {
    statusEl.className = 'form-status';
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
    
    return;
  }
  

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  const data = Object.fromEntries(new FormData(form));
  

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error || 'Something went wrong.');
    }

    form.reset();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
  } catch (error) {
    statusEl.textContent = error.message || 'Something went wrong. Please email hello@calicomedia.co instead.';
    statusEl.classList.add('form-status--error');
  } finally {
    button.disabled = false;
  }
  
});
