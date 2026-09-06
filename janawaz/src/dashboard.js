import React, { useState } from 'react'
import './dashboard.css'
const Dashboard = ({ user, language, onLanguageChange, translations: t, onProfileUpdate, onSubmitComplaint }) => {
    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('All statuses')
    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [anonymousMode, setAnonymousMode] = useState(() => localStorage.getItem('janawaz_anonymous_mode') === 'true')
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('janawaz_notifications') !== 'false')
    const [feedbackSent, setFeedbackSent] = useState(false)
    const [profileName, setProfileName] = useState(user?.username || '')
    const [profileEmail, setProfileEmail] = useState(user?.email || '')
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [profileMessage, setProfileMessage] = useState('')
    const [profileError, setProfileError] = useState('')

    const complaints = []

    const filteredComplaints = complaints.filter((complaint) => {
        const matchesQuery = `${complaint.id} ${complaint.title} ${complaint.department}`.toLowerCase().includes(query.toLowerCase())
        const matchesStatus = statusFilter === 'All statuses' || complaint.status === statusFilter
        return matchesQuery && matchesStatus
    })

    const downloadReport = () => {
        const rows = [['Complaint ID', 'Title', 'Department', 'Date', 'Status'], ...complaints.map((complaint) => [complaint.id, complaint.title, complaint.department, complaint.date, complaint.status])]
        const csv = rows.map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
        const link = document.createElement('a')
        link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
        link.download = 'janawaz-complaints.csv'
        link.click()
        URL.revokeObjectURL(link.href)
    }

  return (
        <main className='dashboard-page'>
            <section className='dashboard-header'>
                <div>
                    <p className='dashboard-kicker'>{t.citizenWorkspace}</p>
                    <h1>{t.hello}, {user?.username || 'there'}</h1>
                    <p>{t.track}</p>
        </div>
                <div className='dashboard-actions'>
                    <button type='button' className='dashboard-primary' onClick={onSubmitComplaint}>{t.submitAComplaint}</button>
                    <button type='button' className='dashboard-secondary' onClick={downloadReport}>Download Report</button>
        </div>
            </section>

            <section className='summary-grid' aria-label='Complaint summary'>
                <article><span className='summary-label'>{t.total}</span><strong>{complaints.length}</strong><small>{t.allReports}</small></article>
                <article><span className='summary-label'>{t.inProgress}</span><strong>{complaints.filter((complaint) => complaint.status === 'In Progress').length}</strong><small>{t.awaitingAction}</small></article>
                <article><span className='summary-label'>{t.underReview}</span><strong>{complaints.filter((complaint) => complaint.status === 'Under review').length}</strong><small>{t.beingVerified}</small></article>
                <article><span className='summary-label'>{t.resolved}</span><strong>{complaints.filter((complaint) => complaint.status === 'Resolved').length}</strong><small>{t.closedSuccessfully}</small></article>
            </section>

            <section className='dashboard-grid'>
                <div className='dashboard-main-column'>
                    <section className='dashboard-panel complaint-panel'>
                        <div className='panel-heading'>
                            <div><p className='dashboard-kicker'>{t.yourReports}</p><h2>{t.complaintStatus}</h2></div>
                            <span className='privacy-note'>{t.protected}</span>
                        </div>
                        <div className='complaint-tools'>
                            <label className='search-field'>
                                <span>{t.searchComplaints}</span>
                                <input type='search' value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
                            </label>
                            <label className='filter-field'>
                                <span>{t.filterStatus}</span>
                                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                    <option value='All statuses'>{t.allStatuses}</option><option value='In Progress'>{t.inProgress}</option><option value='Under review'>{t.underReview}</option><option value='Resolved'>{t.resolved}</option>
                                </select>
                            </label>
                        </div>
                        {filteredComplaints.length === 0 ? <div className='empty-state'><h3>{t.noComplaints}</h3><p>{t.noComplaintsText}</p><button type='button' onClick={onSubmitComplaint}>{t.submitAComplaint}</button></div> : (
                            <div className='complaint-table-wrap'>
                                <table className='complaint-table'>
                                    <thead><tr><th>Complaint</th><th>Department</th><th>Date</th><th>Status</th><th><span className='sr-only'>View</span></th></tr></thead>
                                    <tbody>{filteredComplaints.map((complaint) => <tr key={complaint.id}>
                                        <td><strong>{complaint.title}</strong><span>{complaint.id}</span></td><td>{complaint.department}</td><td>{complaint.date}</td><td><span className={`status status-${complaint.status.toLowerCase().replace(' ', '-')}`}>{complaint.status}</span></td><td><button type='button' className='view-button' onClick={() => setSelectedComplaint(complaint)}>View</button></td>
                                    </tr>)}</tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {selectedComplaint && <section className='dashboard-panel detail-panel'>
                        <div className='panel-heading'><div><p className='dashboard-kicker'>Complaint details</p><h2>{selectedComplaint.title}</h2></div><button type='button' className='close-button' onClick={() => setSelectedComplaint(null)}>Close</button></div>
                        <div className='detail-meta'><span>{selectedComplaint.id}</span><span>{selectedComplaint.category}</span><span>{selectedComplaint.department}</span></div>
                        <p className='response-note'>{selectedComplaint.response}</p>
                        <ol className='timeline'>{selectedComplaint.timeline.map((event, index) => <li key={event} className={index === selectedComplaint.timeline.length - 1 ? 'current' : ''}><span>{index + 1}</span><div><strong>{event}</strong><small>{index === selectedComplaint.timeline.length - 1 ? 'Current update' : 'Completed'}</small></div></li>)}</ol>
                        <div className='detail-actions'><button type='button' className='dashboard-secondary' onClick={() => setFeedbackSent(true)}>Give feedback</button><a href='mailto:support@janawaz.ai' className='support-link'>Contact support</a></div>
                        {feedbackSent && <p className='feedback-message' role='status'>Thanks. Your feedback has been recorded for this prototype.</p>}
                    </section>}
                </div>

                <aside className='dashboard-side-column'>
                    <section className='dashboard-panel profile-panel'><div className='panel-heading'><div><p className='dashboard-kicker'>{t.account}</p><h2>{t.profilePrivacy}</h2></div><span className='profile-avatar'>{user?.username?.charAt(0).toUpperCase() || '?'}</span></div>{isEditingProfile ? <form className='profile-form' onSubmit={async (event) => { event.preventDefault(); setProfileError(''); setProfileMessage(''); try { await onProfileUpdate({ username: profileName, email: profileEmail }); setIsEditingProfile(false); setProfileMessage('Profile saved successfully.'); } catch (error) { setProfileError(error.message); } }}><label>Username<input value={profileName} onChange={(event) => setProfileName(event.target.value)} required /></label><label>Email<input type='email' value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} required /></label><div className='profile-form-actions'><button type='submit' className='dashboard-primary'>Save profile</button><button type='button' className='dashboard-secondary' onClick={() => { setProfileName(user?.username || ''); setProfileEmail(user?.email || ''); setIsEditingProfile(false) }}>Cancel</button></div></form> : <><p className='profile-name'>{user?.username || t.profileUnavailable}</p><p className='profile-email'>{user?.email || t.connectProfile}</p><button type='button' className='edit-profile-button' onClick={() => { setProfileMessage(''); setProfileError(''); setIsEditingProfile(true) }}>Edit profile</button></>}{profileMessage && <p className='profile-message' role='status'>{profileMessage}</p>}{profileError && <p className='profile-error' role='alert'>{profileError}</p>}<label className='toggle-row'><span><strong>{t.anonymous}</strong><small>{t.anonymousText}</small></span><input type='checkbox' checked={anonymousMode} onChange={(event) => { setAnonymousMode(event.target.checked); localStorage.setItem('janawaz_anonymous_mode', event.target.checked) }} /></label><label className='toggle-row'><span><strong>{t.notifications}</strong><small>{t.notificationsText}</small></span><input type='checkbox' checked={notificationsEnabled} onChange={(event) => { setNotificationsEnabled(event.target.checked); localStorage.setItem('janawaz_notifications', event.target.checked) }} /></label><label className='language-field'>{t.preferredLanguage}<select value={language} onChange={onLanguageChange}><option>English</option><option>Hindi</option><option>Marathi</option></select></label></section>
                    <section className='dashboard-panel insight-panel'><p className='dashboard-kicker'>{t.activity}</p><h2>{t.progress}</h2><div className='chart chart-empty' aria-label={t.noActivity}><span>{t.noActivity}</span></div><p className='insight-copy'>{t.analyticsText}</p></section>
                    <section className='dashboard-panel safety-panel'><p className='dashboard-kicker'>{t.safety}</p><h2>{t.needHelp}</h2><p>{t.safetyText}</p><a href='mailto:support@janawaz.ai' className='support-link'>{t.contactSupport}</a></section>
                </aside>
            </section>
        </main>
  )
}

export default Dashboard
