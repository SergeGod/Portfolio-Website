'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput    = form.querySelector('#name');
  const emailInput   = form.querySelector('#email');
  const subjectInput = form.querySelector('#subject');
  const messageInput = form.querySelector('#message');
  const submitBtn    = form.querySelector('#submit-btn');
  const successMsg   = document.getElementById('form-success');
  const errorMsg     = document.getElementById('form-error');

  // Real-time validation
  nameInput.addEventListener('blur', () => validateField(nameInput, v => v.trim().length >= 2, 'Please enter your name'));
  emailInput.addEventListener('blur', () => validateField(emailInput, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email'));
  messageInput.addEventListener('blur', () => validateField(messageInput, v => v.trim().length >= 10, 'Message must be at least 10 characters'));

  // Clear error on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameOk    = validateField(nameInput,    v => v.trim().length >= 2,   'Please enter your name');
    const emailOk   = validateField(emailInput,   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email');
    const messageOk = validateField(messageInput, v => v.trim().length >= 10,  'Message must be at least 10 characters');

    if (!nameOk || !emailOk || !messageOk) return;

    setSubmitLoading(true, submitBtn);
    successMsg.classList.remove('show');
    errorMsg.classList.remove('show');

    let timeoutId;
    try {
      const endpoint = form.dataset.endpoint;
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 12000);

      const formData = new FormData();
      formData.append('name', nameInput.value.trim());
      formData.append('email', emailInput.value.trim());
      formData.append('subject', subjectInput.value.trim() || 'Portfolio Contact - Serge Hagopian');
      formData.append('message', messageInput.value.trim());
      formData.append('_subject', `Portfolio Contact - ${nameInput.value.trim()}`);
      formData.append('_honey', form.querySelector('input[name="_honey"]')?.value || '');
      formData.append('_captcha', 'false');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
        signal: controller.signal
      });

      const result = await response.json().catch(() => ({}));
      const ok = response.ok && (!result || result.success === 'true' || result.success === true);

      if (ok) {
        successMsg.classList.add('show');
        form.reset();
        clearAllFieldStates(form);
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('Server error');
      }
    } catch {
      errorMsg.classList.add('show');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setSubmitLoading(false, submitBtn);
    }
  });
}

function validateField(input, rule, message) {
  const value = input.value;
  const helper = document.getElementById(`${input.id}-helper`);
  const valid = rule(value);

  if (valid) {
    input.classList.remove('error');
    input.classList.add('success');
    if (helper) helper.textContent = '';
  } else {
    input.classList.remove('success');
    input.classList.add('error');
    if (helper) helper.textContent = message;
  }

  return valid;
}

function clearFieldError(input) {
  input.classList.remove('error');
  const helper = document.getElementById(`${input.id}-helper`);
  if (helper && input.classList.contains('error')) helper.textContent = '';
}

function clearAllFieldStates(form) {
  form.querySelectorAll('.form-input, .form-textarea').forEach(el => {
    el.classList.remove('error', 'success');
  });
  form.querySelectorAll('.form-helper').forEach(el => el.textContent = '');
}

function setSubmitLoading(loading, btn) {
  const btnText = btn.querySelector('.btn-text');
  const btnSpinner = btn.querySelector('.btn-spinner');

  btn.disabled = loading;

  if (btnText)    btnText.style.display    = loading ? 'none' : '';
  if (btnSpinner) btnSpinner.style.display = loading ? 'flex' : 'none';
}
