/* ============================================
   FORMS.JS - Validation, Floating Labels, UX
   ============================================ */

(function() {
  'use strict';

  // ===== FORM VALIDATION =====
  function initFormValidation() {
    document.querySelectorAll('form').forEach(function(form) {
      // Real-time validation
      form.querySelectorAll('input, textarea, select').forEach(function(field) {
        field.addEventListener('blur', function() {
          validateField(this);
        });
        field.addEventListener('input', function() {
          if (this.parentElement.classList.contains('has-error')) {
            validateField(this);
          }
        });
      });

      // Submit handling
      form.addEventListener('submit', function(e) {
        var isValid = true;
        var firstInvalid = null;
        this.querySelectorAll('input[required], textarea[required], select[required]').forEach(function(field) {
          if (!validateField(field)) {
            isValid = false;
            if (!firstInvalid) firstInvalid = field;
          }
        });
        if (!isValid) {
          e.preventDefault();
          if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });
  }

  function validateField(field) {
    var group = field.closest('.form-group') || field.parentElement;
    var errorEl = group ? group.querySelector('.error-msg') : null;
    var value = field.value.trim();
    var isValid = true;
    var message = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    } else if (field.type === 'email' && value) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
      }
    } else if (field.name === 'phone' && value) {
      var phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value.replace(/[\s\-+]/g, ''))) {
        isValid = false;
        message = 'Please enter a valid 10-digit phone number';
      }
    }

    if (group) {
      if (isValid) {
        group.classList.remove('has-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.style.display = 'none';
        }
      } else {
        group.classList.add('has-error');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.style.display = 'block';
        }
      }
    }

    return isValid;
  }

  // ===== CONTACT FORM HANDLING =====
  function initContactForm() {
    var form = document.getElementById('homeContactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = document.getElementById('homeFormSubmit') || this.querySelector('button[type="submit"]');
      var status = document.getElementById('homeFormStatus');
      var originalText = btn ? btn.innerHTML : '';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }
      if (status) status.textContent = '';

      try {
        var res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name.value,
            email: this.email.value,
            phone: this.phone.value,
            message: this.message.value
          })
        });
        var data = await res.json();
        if (res.ok) {
          if (status) {
            status.style.color = 'var(--color-success)';
            status.innerHTML = '<i class="fas fa-check-circle"></i> ' + (data.message || 'Message sent successfully!');
          }
          this.reset();
        } else {
          if (status) {
            status.style.color = 'var(--color-danger)';
            status.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (data.error || 'Error sending message');
          }
        }
      } catch (err) {
        if (status) {
          status.style.color = 'var(--color-danger)';
          status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please try again.';
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  }

  // ===== DUPLICATE SUBMIT PREVENTION =====
  function initDuplicateSubmitPrevention() {
    document.querySelectorAll('form').forEach(function(form) {
      form.addEventListener('submit', function() {
        var btn = this.querySelector('button[type="submit"]');
        if (btn && !btn.classList.contains('btn-loading')) {
          btn.classList.add('btn-loading');
          btn.disabled = true;
          // Re-enable after 5 seconds as safety net
          setTimeout(function() {
            btn.classList.remove('btn-loading');
            btn.disabled = false;
          }, 5000);
        }
      });
    });
  }

  window.GGForms = {
    initFormValidation: initFormValidation,
    initContactForm: initContactForm,
    initDuplicateSubmitPrevention: initDuplicateSubmitPrevention
  };

  document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
    initContactForm();
    initDuplicateSubmitPrevention();
  });
})();
