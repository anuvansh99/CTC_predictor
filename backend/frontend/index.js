document.getElementById('ctcForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const cgpa = parseFloat(document.getElementById('cgpa').value);
    const branch = document.getElementById('branch').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const resultDiv = document.getElementById('result');

    // Reset animation and classes
    resultDiv.classList.remove('animate__fadeInUp', 'error');
    void resultDiv.offsetWidth; // Trigger reflow

    if (cgpa < 6) {
        resultDiv.innerText = "CGPA should be more than 6 for prediction!";
        resultDiv.classList.add('error', 'animate__fadeInUp');
        return;
    }

    resultDiv.innerHTML = '<div class="spinner-border text-info" role="status"><span class="visually-hidden">Loading...</span></div> Predicting...';

    try {
        const response = await fetch('https://ctc-predictor.onrender.com/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cgpa, branch, gender })
        });

        const data = await response.json();
        if ('prediction' in data) {
            resultDiv.innerText = `Predicted CTC: ₹${data.prediction} LPA`;
            resultDiv.classList.add('animate__fadeInUp');
            resultDiv.classList.remove('error');
        } else {
            resultDiv.innerText = `Error: ${data.error || 'Could not get prediction.'}`;
            resultDiv.classList.add('error', 'animate__fadeInUp');
        }
    } catch (error) {
        resultDiv.innerText = `Network error: ${error.message}`;
        resultDiv.classList.add('error', 'animate__fadeInUp');
    }
});
