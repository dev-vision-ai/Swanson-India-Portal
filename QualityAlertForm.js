// Helper function to safely get DOM elements
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id '${id}' not found`);
        return null;
    }
    return element;
}
const abnormalityTypeSelect = getElement('abnormalityType');
const keptInViewContainer = getElement('keptInViewContainer');
const keptInViewSelect = getElement('keptInView');
const semiFinishedGoodsDetails = getElement('semiFinishedGoodsDetails');
const incidentDescriptionDetails = getElement('incidentDescriptionDetails');
const defectDescriptionInput = getElement('defectDescription');
const qualityAlertForm = getElement('qualityAlertForm');
const imageUpload = getElement('imageUpload');
const imagePreviews = getElement('imagePreviews');
const submitButton = getElement('submitBtn');
const draftButton = getElement('draftBtn');
let selectedFiles = [];
document.querySelector('label[for="imageUpload"] button')?.addEventListener('click', () => {
    imageUpload?.click();
});
imageUpload?.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    imagePreviews.innerHTML = '';
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '150px';
            img.style.margin = '5px';
            imagePreviews.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});
abnormalityTypeSelect?.addEventListener('change', function() {
    keptInViewContainer.style.display = 'none';
    semiFinishedGoodsDetails.style.display = 'none';
    incidentDescriptionDetails.style.display = 'block';
    if (this.value === 'Semi/Finished Goods') {
        keptInViewContainer.style.display = 'block';
        keptInViewSelect.value = '';
    }
});
keptInViewSelect?.addEventListener('change', function() {
    if (this.value === 'yes') {
        semiFinishedGoodsDetails.style.display = 'block';
        incidentDescriptionDetails.style.display = 'none';
        defectDescriptionInput.style.height = '150px';
    } else {
        semiFinishedGoodsDetails.style.display = 'none';
        incidentDescriptionDetails.style.display = 'block';
        defectDescriptionInput.style.height = '100px';
    }
});
qualityAlertForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = event.submitter;
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) throw new Error('Please login first');
        const formData = {
            employee_code: userData.employee_code,
            incident_title: getElement('incidentTitle').value,
            responsible_dept: getElement('responsibleDept').value,
            location_area: getElement('locationArea').value,
            incident_date: getElement('incidentDate').value,
            incident_time: getElement('incidentTime').value,
            abnormality_type: abnormalityTypeSelect.value,
            quality_risk: getElement('qualityRisk').value,
            kept_in_view: keptInViewSelect.value,
            incident_desc: getElement('incidentDesc').value,
            defect_description: defectDescriptionInput.value,
            product_code: getElement('productCode')?.value || '',
            roll_id: getElement('rollID')?.value || '',
            lot_no: getElement('lotNo')?.value || '',
            roll_positions: getElement('rollPositions')?.value || '',
            lot_time: getElement('lotTime')?.value || '',
            action_taken: getElement('actionTaken').value,
            who_action: getElement('whoAction').value,
            when_action_date: getElement('whenActionDate').value,
            status_action: getElement('statusAction').value,
            created_at: new Date().toISOString(),
            status: 'Pending'
        };
        const alerts = JSON.parse(localStorage.getItem('quality_alerts') || '[]');
        alerts.push(formData);
        localStorage.setItem('quality_alerts', JSON.stringify(alerts));
        showSubmissionSuccess();
        resetForm();
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form: ' + error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});
function showSubmissionSuccess() {
    const successBanner = document.createElement('div');
    successBanner.className = 'submission-success';
    successBanner.innerHTML = `
        <div class="success-icon">✅</div>
        <div class="success-content">
            <h3>Quality Alert Submitted Successfully!</h3>
            <p>Your alert has been recorded in the system.</p>
        </div>
    `;
    qualityAlertForm.insertBefore(successBanner, qualityAlertForm.firstChild);
    setTimeout(() => successBanner.classList.add('show'), 10);
    setTimeout(() => {
        successBanner.classList.remove('show');
        setTimeout(() => successBanner.remove(), 500);
    }, 5000);
}
function resetForm() {
    qualityAlertForm?.reset();
    selectedFiles = [];
    imagePreviews.innerHTML = '';
    localStorage.removeItem('qualityAlertDraft');
    if (keptInViewSelect) keptInViewSelect.value = '';
    if (abnormalityTypeSelect) abnormalityTypeSelect.value = '';
    if (semiFinishedGoodsDetails) semiFinishedGoodsDetails.style.display = 'none';
    if (incidentDescriptionDetails) incidentDescriptionDetails.style.display = 'block';
}
const mockUserData = {
    name: "Test User",
    employee_code: "EMP123"
};
