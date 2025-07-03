// EmailJS Configuration
// Replace these with your actual EmailJS credentials
const EMAILJS_CONFIG = {
  serviceID: "YOUR_SERVICE_ID",
  templateID: "YOUR_TEMPLATE_ID",
  publicKey: "YOUR_PUBLIC_KEY",
}

// Declare emailjs variable
const emailjs = window.emailjs

// Initialize EmailJS
;(() => {
  emailjs.init(EMAILJS_CONFIG.publicKey)
})()

// Enhanced Form Submission with EmailJS
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form")

  if (!contactForm) return

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const button = this.querySelector('button[type="submit"]')
    const originalText = button.innerHTML
    const formData = new FormData(this)

    // Validate form before sending
    if (!validateForm(contactForm)) {
      button.innerHTML = originalText
      button.disabled = false
      button.style.backgroundColor = ""
      return
    }

    // Show loading state
    button.innerHTML = "Sending..."
    button.disabled = true
    button.style.backgroundColor = "#6b7280"

    // Prepare template parameters
    const templateParams = {
      from_name: formData.get("from_name"),
      from_email: formData.get("from_email"),
      message: formData.get("message"),
      to_name: "Charlie Motion Picture Team",
      reply_to: formData.get("from_email"),
    }

    // Send email using EmailJS
    emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text)

        // Success state
        button.innerHTML = "Message Sent! ✓"
        button.style.backgroundColor = "#22c55e"

        // Show success message
        showNotification("Thank you! Your message has been sent successfully.", "success")

        // Reset form after delay
        setTimeout(() => {
          button.innerHTML = originalText
          button.disabled = false
          button.style.backgroundColor = ""
          contactForm.reset()
        }, 3000)
      },
      (error) => {
        console.log("FAILED...", error)

        // Error state
        button.innerHTML = "Failed to Send ✗"
        button.style.backgroundColor = "#ef4444"

        // Show error message
        showNotification("Sorry, there was an error sending your message. Please try again.", "error")

        // Reset button after delay
        setTimeout(() => {
          button.innerHTML = originalText
          button.disabled = false
          button.style.backgroundColor = ""
        }, 3000)
      },
    )
  })
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`

  // Set colors based on type
  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  }

  notification.className += ` ${colors[type] || colors.info}`
  notification.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="text-sm font-medium">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <span class="text-lg">&times;</span>
            </button>
        </div>
    `

  // Add to page
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full")
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add("translate-x-full")
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 300)
    }
  }, 5000)
}

// Form validation
function validateForm(form) {
  const name = form.querySelector('input[name="from_name"]').value.trim()
  const email = form.querySelector('input[name="from_email"]').value.trim()
  const message = form.querySelector('textarea[name="message"]').value.trim()

  if (!name) {
    showNotification("Please enter your name.", "error")
    return false
  }

  if (!email || !isValidEmail(email)) {
    showNotification("Please enter a valid email address.", "error")
    return false
  }

  if (!message) {
    showNotification("Please enter your message.", "error")
    return false
  }

  return true
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeContactForm()
})
