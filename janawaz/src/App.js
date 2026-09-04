import React, { useState } from 'react'
import './App.css'
import SubmitComplaint from './SubmitComplaint'

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isComplaintPage, setIsComplaintPage] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)
  const showHome = (event) => {
    event.preventDefault()
    closeMenu()
    setIsComplaintPage(false)
  }
  const showComplaintPage = (event) => {
    event.preventDefault()
    closeMenu()
    setIsComplaintPage(true)
  }

  return (
    <div>
      <div className='navbar'>
        <div className='nav-contents'>
          <a href='#' onClick={showHome}>Home</a>
          <a href='#' onClick={closeMenu}>About</a>
          <a href='#' onClick={closeMenu}>Contact</a>
          <a href='#' onClick={showComplaintPage}>Submit Complaint</a>
        </div>
        <button className={`hamburger ${isMenuOpen ? 'is-open' : ''}`} type='button' aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen} aria-controls='mobile-navigation' onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className='bar'></span>
          <span className='bar'></span>
          <span className='bar'></span>
        </button>
        <div className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} id='mobile-navigation' aria-hidden={!isMenuOpen}>
          <a href='#' onClick={showHome}>Home</a>
          <a href='#' onClick={closeMenu}>About</a>
          <a href='#' onClick={closeMenu}>Contact</a>
          <a href='#' onClick={showComplaintPage}>Submit Complaint</a>
        </div>
      </div>
      <div className='main-content'>
        {isComplaintPage ? <SubmitComplaint /> : (
          <>
            <div className='hero-layout'>
              <div className='hero-copy'>
                <div className='small'><p>JanAwaz.AI</p></div>
                <h1>Raise Your Voice Against<br></br> Injustice.</h1>
                <a href='#' className='button' onClick={showComplaintPage}>Submit Complaint</a>
              </div>
              <div className='brand-logo' aria-label='JanAwaz.ai logo'>
                <div className='logo-mark' aria-hidden='true'>JA</div>
                <span>JanAwaz<span className='logo-domain'>.ai</span></span>
              </div>
            </div>
            <section className='slogans' aria-labelledby='slogans-title'>
              <p className='section-kicker'>Speak up. Stand together.</p>
              <h2 id='slogans-title'>A cleaner India begins with an honest voice.</h2>
              <div className='slogan-list'>
                <p>Silence protects corruption. Speaking up protects our future.</p>
                <p>Transparency is not a favour. It is every citizen&apos;s right.</p>
                <p>One honest complaint can open the door to accountability.</p>
                <p>Public money deserves public answers.</p>
                <p>Reject shortcuts. Choose integrity.</p>
                <p>When citizens unite, corruption loses its power.</p>
              </div>
            </section>
            <section className='how-it-works'>
              <p className='section-kicker'>From complaint to accountability</p>
              <h2 id='how-it-works-title'>How JanAwaz.ai Works</h2>
              <div className='steps'>
                <article className='step-box'><span className='step-number'>01</span><h3>Submit a complaint</h3><p>Share what happened, where it happened, and the evidence you have.</p></article>
                <article className='step-box'><span className='step-number'>02</span><h3>AI checks the details</h3><p>Our AI screens the information, checks for missing details, and flags claims for review.</p></article>
                <article className='step-box'><span className='step-number'>03</span><h3>Reach the right agency</h3><p>The complaint is prepared and routed to a credible agency that can help.</p></article>
                <article className='step-box'><span className='step-number'>04</span><h3>Ask for accountability</h3><p>With appropriate safeguards, we share verified cases publicly and seek answers.</p></article>
              </div>
            </section>
            <div className='footer'><p>&copy; 2026 JanAwaz.ai. All rights reserved.</p></div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
