import React, { useEffect, useState } from 'react'
import './App.css'
import SubmitComplaint from './SubmitComplaint'
import Login from './login'
import Signup from './signup'
import Dashboard from './dashboard'
import { getCurrentUser, login, signup, updateCurrentUser } from './api'
import { getTranslations } from './translations'

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('janawaz_user'))
  } catch (_error) {
    return null
  }
}

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isComplaintPage, setIsComplaintPage] = useState(false)
  const [isLoginpage, setIsLoginpage] = useState(false)
  const [isSignuppage, setIsSignuppage] = useState(false)
  const [isDashboard, setIsDashboard] = useState(() => Boolean(localStorage.getItem('janawaz_token')))
  const [user, setUser] = useState(getSavedUser)
  const [language, setLanguage] = useState(() => localStorage.getItem('janawaz_language') || 'English')
  const t = getTranslations(language)

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value
    setLanguage(nextLanguage)
    localStorage.setItem('janawaz_language', nextLanguage)
  }

  useEffect(() => {
    const token = localStorage.getItem('janawaz_token')
    if (!token) return
    getCurrentUser(token).then((result) => {
      setUser(result.user)
      localStorage.setItem('janawaz_user', JSON.stringify(result.user))
      setIsDashboard(true)
    }).catch(() => {
      localStorage.removeItem('janawaz_token')
      localStorage.removeItem('janawaz_user')
      setUser(null)
      setIsDashboard(false)
    })
  }, [])


  const closeMenu = () => setIsMenuOpen(false)
  const closeMenuAndPreventDefault = (event) => {
    event.preventDefault()
    closeMenu()
  }
  const showHome = (event) => {
    event.preventDefault()
    closeMenu()
    setIsComplaintPage(false)
    setIsLoginpage(false)
    setIsSignuppage(false)
    setIsDashboard(false)
    setUser(null)
    localStorage.removeItem('janawaz_token')
    localStorage.removeItem('janawaz_user')
  }
  const showComplaintPage = (event) => {
    event.preventDefault()
    closeMenu()
    setIsComplaintPage(true)
    setIsLoginpage(false)
    setIsSignuppage(false)
    setIsDashboard(false)
  }
  const showLoginpage = (event) => {
    event.preventDefault()
    closeMenu()
    setIsComplaintPage(false)
    setIsLoginpage(true)
    setIsSignuppage(false)
    setIsDashboard(false)
  }
  const showSignuppage = (event) => {
    event.preventDefault()
    closeMenu()
    setIsComplaintPage(false)
    setIsLoginpage(false)
    setIsSignuppage(true)
    setIsDashboard(false)
  }
  const showDashboard = (event) => {
    event.preventDefault()
    closeMenu()
    setIsComplaintPage(false)
    setIsLoginpage(false)
    setIsSignuppage(false)
    setIsDashboard(true)
  }

  const showLogout = (event) => {
    if (!window.confirm('Are you sure you want to log out?')) return
    showHome(event)
  }

  const goToDashboard = () => {
    closeMenu()
    setIsComplaintPage(false)
    setIsLoginpage(false)
    setIsSignuppage(false)
    setIsDashboard(true)
  }

  const handleLogin = async (credentials) => {
    const result = await login(credentials)
    localStorage.setItem('janawaz_token', result.token)
    localStorage.setItem('janawaz_user', JSON.stringify(result.user))
    setUser(result.user)
    goToDashboard()
  }

  const handleSignup = async (credentials) => {
    const result = await signup(credentials)
    localStorage.setItem('janawaz_token', result.token)
    localStorage.setItem('janawaz_user', JSON.stringify(result.user))
    setUser(result.user)
    goToDashboard()
  }

  const handleProfileUpdate = async (profile) => {
    const token = localStorage.getItem('janawaz_token')
    const result = await updateCurrentUser(token, profile)
    setUser(result.user)
    localStorage.setItem('janawaz_user', JSON.stringify(result.user))
    return result.user
  }

  const isDashboardArea = isDashboard || isComplaintPage

  return (
    <div>
      <title>JanAwaz.ai</title>
      <div className='navbar'>
        <a href='/' className='navbar-brand' onClick={showHome} aria-label='JanAwaz.ai home'>
          <span className='logo-mark' aria-hidden='true'>JA</span>
          <span>JanAwaz<span className='logo-domain'>.ai</span></span>
        </a>
        <div className='nav-contents'>
          {isDashboardArea ? (
            <>
              <a href='/' onClick={showDashboard}>{t.dashboard}</a>
              <a href='/' onClick={showComplaintPage}>{t.submitComplaint}</a>
              <a href='/' onClick={showLogout}>{t.logout}</a>
            </>
          ) : (
            <>
              <a href='/' onClick={showHome}>{t.home}</a>
              <a href='/' onClick={closeMenuAndPreventDefault}>{t.about}</a>
              <a href='/' onClick={closeMenuAndPreventDefault}>{t.contact}</a>
              <a href='/' onClick={showLoginpage}>{t.login}</a>
            </>
          )}

        </div>
        <button className={`hamburger ${isMenuOpen ? 'is-open' : ''}`} type='button' aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMenuOpen} aria-controls='mobile-navigation' onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className='bar'></span>
          <span className='bar'></span>
          <span className='bar'></span>
        </button>
        <div className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} id='mobile-navigation' aria-hidden={!isMenuOpen}>
          {isDashboardArea ? (
            <>
              <a href='/' onClick={showDashboard}>{t.dashboard}</a>
              <a href='/' onClick={showComplaintPage}>{t.submitComplaint}</a>
              <a href='/' onClick={showLogout}>{t.logout}</a>
            </>
          ) : (
            <>
              <a href='/' onClick={showHome}>{t.home}</a>
              <a href='/' onClick={closeMenuAndPreventDefault}>{t.about}</a>
              <a href='/' onClick={closeMenuAndPreventDefault}>{t.contact}</a>
              <a href='/' onClick={showLoginpage}>{t.login}</a>
            </>
          )}
        </div>
      </div>
      <div className='main-content'>
        {isComplaintPage ? <SubmitComplaint /> : isLoginpage ? <Login onSignup={showSignuppage} onSubmit={handleLogin} /> : isSignuppage ? <Signup onLogin={showLoginpage} onSubmit={handleSignup} /> : isDashboard ? <Dashboard user={user} language={language} onLanguageChange={handleLanguageChange} translations={t} onProfileUpdate={handleProfileUpdate} onSubmitComplaint={showComplaintPage} /> : (
          <>
            <div className='hero-layout'>
              <div className='hero-copy'>
                <div className='small'><p>JanAwaz.AI</p></div>
                <h1>{language === 'English' ? <>Raise Your Voice Against<br /> Injustice.</> : t.landingTitle}</h1>
                <div className='hero-actions'>
                  <a href='/' className='button' onClick={showLoginpage}>{t.login}</a>
                  <a href='/' className='button button-secondary' onClick={showSignuppage}>{t.signup}</a>
                </div>
                <label className='landing-language'>
                  {t.language}
                  <select value={language} onChange={handleLanguageChange}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </label>
              </div>
              <div className='brand-logo' aria-label='JanAwaz.ai logo'>
                <div className='logo-mark' aria-hidden='true'>JA</div>
                <span>JanAwaz<span className='logo-domain'>.ai</span></span>
              </div>
            </div>
            <section className='slogans' aria-labelledby='slogans-title'>
              <p className='section-kicker'>{t.landingKicker}</p>
              <h2 id='slogans-title'>{t.landingTitle}</h2>
              <div className='slogan-list'>
                <p>{t.slogan1}</p><p>{t.slogan2}</p><p>{t.slogan3}</p><p>{t.slogan4}</p><p>{t.slogan5}</p><p>{t.slogan6}</p>
              </div>
            </section>
            <section className='how-it-works'>
              <p className='section-kicker'>{t.howKicker}</p>
              <h2 id='how-it-works-title'>{t.howTitle}</h2>
              <div className='steps'>
                <article className='step-box'><span className='step-number'>01</span><h3>{t.step1}</h3></article>
                <article className='step-box'><span className='step-number'>02</span><h3>{t.step2}</h3></article>
                <article className='step-box'><span className='step-number'>03</span><h3>{t.step3}</h3></article>
                <article className='step-box'><span className='step-number'>04</span><h3>{t.step4}</h3></article>
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
