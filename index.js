import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Replace these with your actual Supabase project credentials:
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const form = document.getElementById('signup-form')
const messageDiv = document.getElementById('message')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Optional: add a redirect URL after verification if you want
    // options: { emailRedirectTo: 'https://your-app.com/after-verification' }
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
