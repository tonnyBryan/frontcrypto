<template>
  <footer class="footer-48201">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h3 class="tl">
            <img
              src="@/assets/binance-logo.svg"
              width="40"
              alt="Logo"
              class="logo-icon"
              style="margin-right: 5px"
            />
            Crypto-G
          </h3>
          <p>
            Welcome to Crypto-G! <br />We are four passionate students committed to making
            cryptocurrency simple and secure for everyone. <br />Our goal is to provide an
            easy-to-use platform for managing your digital assets. 🚀
          </p>
        </div>
        <div class="col-md-4">
          <h3 class="tl">Members</h3>
          <ul class="list-unstyled nav-links">
            <li>
              <a href="#"><i class="bi bi-person"></i> Anderson Tonny Bryan</a>
            </li>
            <li>
              <a href="#"><i class="bi bi-person"></i> Anderson Tonny Bryan</a>
            </li>
            <li>
              <a href="#"><i class="bi bi-person"></i> Anderson Tonny Bryan</a>
            </li>
            <li>
              <a href="#"><i class="bi bi-person"></i> Anderson Tonny Bryan</a>
            </li>
          </ul>
        </div>
        <div class="col-md-4">
          <h3 class="tl">Feedback</h3>

          <form @submit.prevent="submitFeedback" novalidate>
            <div class="mb-3">
              <label for="subject" class="form-label text-light">Subject</label>
              <input
                type="text"
                id="subject"
                class="form-control"
                v-model="feedback.subject"
                :class="{ 'is-invalid': !feedback.subject && submitted }"
                required
              />
              <div class="invalid-feedback">Subject is required.</div>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label text-light">Content</label>
              <textarea
                id="content"
                class="form-control"
                v-model="feedback.content"
                rows="4"
                :class="{ 'is-invalid': !feedback.content && submitted }"
                required
              ></textarea>
              <div class="invalid-feedback">Content is required.</div>
            </div>
            <button type="submit" class="btn btn-warning">Submit</button>
          </form>
        </div>
      </div>

      <div class="row">
        <div class="col-12 text-center">
          <div class="copyright mt-5 pt-5">
            <p><small>&copy; 2025 All Rights Reserved. IT University</small></p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      feedback: {
        subject: '',
        content: '',
      },
      submitted: false,
    }
  },
  methods: {
    async submitFeedback() {
      this.submitted = true

      if (!this.feedback.subject || !this.feedback.content) {
        return
      }

      try {
        const response = await axios.post('/api/submit-feedback', this.feedback)
        console.log('Feedback submitted:', response.data)
      } catch (error) {
        console.error('Error submitting feedback:', error)
      }
    },
  },
}
</script>

<style scoped>
@import '@/util/footer/style.css';

.tl {
  color: #f9f9f9;
  margin-bottom: 2rem;
}

p {
  color: #d1d1d1;
}

input,
textarea {
  background-color: transparent;
  color: #ffffff;
}

input:focus,
textarea:focus {
  color: #ffffff;
  border-color: #ffc107;
  outline: none;
  box-shadow: none;
  background-color: transparent;
}
</style>
