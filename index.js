import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://xirleopytfmlfbfpluha.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpcmxlb3B5dGZtbGZiZnBsdWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTgyOTQsImV4cCI6MjA2NjE5NDI5NH0.2_-wW0GlN_FHNzOtg4otairz_qqLR1H6TAvw8_zLCwA'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('supabase-signup-form')
  const messageDiv = document.getElementById('supabase-signup-message')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('supabase-email').value
    const password = document.getElementById('supabase-password').value

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      messageDiv.textContent = 'Sign up error: ' + error.message
      messageDiv.style.color = 'red'
    } else {
      messageDiv.textContent = 'Sign up successful! Check your email for the verification link.'
      messageDiv.style.color = 'green'
      form.reset()
    }
  })
})
