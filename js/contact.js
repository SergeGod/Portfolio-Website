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

    try {
      // Using Web3Forms - free service, no account needed beyond an access key
      // Replace YOUR_ACCESS_KEY with a key from https://web3forms.com (free)
      const formData = new FormData(form);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
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
