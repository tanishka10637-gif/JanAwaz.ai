import React, { useState } from 'react'

const SubmitComplaint = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <main className='complaint-page'>
      <div className='page-heading'>
        <p className='section-kicker'>Secure complaint intake</p>
        <h1>Submit a complaint</h1>
        <p>Share clear facts and supporting evidence. JanAwaz.ai will screen the information before suggesting the appropriate official channel.</p>
      </div>
      <div className='legal-notice'>
        <strong>Before you begin</strong>
        <span>This form is not for emergencies. Call <b>112</b> for immediate danger. For official redress, complaints may need to be filed with the relevant authority, such as CPGRAMS or a vigilance body.</span>
      </div>
      <form className='complaint-form' onSubmit={handleSubmit}>
        <div className='form-section'>
          <h2>Complaint details</h2>
          <div className='form-grid'>
            <label>
              Complaint type
              <select required defaultValue=''>
                <option value='' disabled>Select a category</option>
                <option>Bribery or illegal payment</option>
                <option>Abuse of authority</option>
                <option>Delay or denial of public service</option>
                <option>Misuse of public funds</option>
                <option>Other public grievance</option>
              </select>
            </label>
            <label>
              State or Union Territory
              <input required type='text' placeholder='For example, Maharashtra' />
            </label>
            <label>
              Department or office
              <input required type='text' placeholder='For example, Regional Transport Office, Pune' />
            </label>
            <label>
              Date of incident
              <input required type='date' />
            </label>
          </div>
          <label>
            Complaint subject
            <input required type='text' placeholder='Summarise the issue in one sentence' />
          </label>
          <label>
            What happened?
            <textarea required rows='7' placeholder='Describe the facts in date order. Include names, locations, amounts, reference numbers, and what action you are requesting.'></textarea>
          </label>
          <label>
            Evidence or reference links
            <textarea rows='3' placeholder='Add document names, transaction IDs, URLs, or other references. Do not share passwords or unnecessary private information.'></textarea>
          </label>
          <label>
            Attach supporting files
            <input type='file' multiple accept='.pdf,.png,.jpg,.jpeg,.mp3,.mp4' />
            <small>Use original, relevant files only. Maximum size and secure upload handling must be enforced by the backend.</small>
          </label>
        </div>
        <div className='form-section'>
          <h2>Your contact details</h2>
          <p className='form-help'>Contact details help an authority request clarification and provide a status or registration number.</p>
          <div className='form-grid'>
            <label>
              Full name
              <input required type='text' autoComplete='name' />
            </label>
            <label>
              Email address
              <input required type='email' autoComplete='email' />
            </label>
            <label>
              Mobile number
              <input required type='tel' autoComplete='tel' placeholder='+91' />
            </label>
            <label>
              Preferred language
              <select defaultValue='English'>
                <option>English</option>
                <option>Hindi</option>
                <option>Other</option>
              </select>
            </label>
          </div>
        </div>
        <div className='declaration'>
          <label className='checkbox-label'>
            <input required type='checkbox' />
            <span>I confirm that the information is accurate to the best of my knowledge and that I have not knowingly submitted a false complaint.</span>
          </label>
          <label className='checkbox-label'>
            <input required type='checkbox' />
            <span>I understand that JanAwaz.ai may screen this report, but only the competent authority can investigate or decide the complaint.</span>
          </label>
        </div>
        <button className='button form-submit' type='submit'>Continue to review</button>
        {isSubmitted && <p className='form-success' role='status'>Your complaint draft passed the form checks. This prototype has not sent it to an authority yet.</p>}
      </form>
    </main>
  )
}

export default SubmitComplaint
