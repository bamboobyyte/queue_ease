document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('url');
    const caseInfoInput = document.getElementById('case-info');
    const ownerInput = document.getElementById('owner');
    const output = document.getElementById('output');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const caseTableBody = document.querySelector('#case-table tbody');

    let previousSelections = {};

    function parseCaseInfo() {
        const caseInfo = caseInfoInput.value.trim().split("\n");
        if (caseInfo.length < 2) return;

        const headers = caseInfo[0].split("\t");
        const values = caseInfo[1].split("\t");

        caseTableBody.innerHTML = '';  // Clear existing rows

        headers.forEach((header, index) => {
            const row = document.createElement('tr');

            const fieldCell = document.createElement('td');
            fieldCell.textContent = header;

            const valueCell = document.createElement('td');
            valueCell.textContent = values[index];

            const selectCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = previousSelections[index] || false;  // Retain previous selections
            selectCell.appendChild(checkbox);

            row.appendChild(fieldCell);
            row.appendChild(valueCell);
            row.appendChild(selectCell);

            caseTableBody.appendChild(row);

            // Add an event listener for the checkbox
            checkbox.addEventListener('change', () => {
                previousSelections[index] = checkbox.checked;  // Update the selections
                generateOutput();  // Regenerate output when checkbox state changes
            });
        });

        generateOutput();  // Ensure output is generated initially
    }


    // Generate the output string based on the selected values
    function generateOutput() {
        const caseInfo = caseInfoInput.value.trim().split("\n");
        if (caseInfo.length < 2) return;

        const values = caseInfo[1].split("\t");
        const caseNumber = values[0];
        const selectedValues = [];

        caseTableBody.querySelectorAll('tr').forEach((row, index) => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox.checked) {
                selectedValues.push(values[index]);
            }
        });

        // Construct the output string
        let outputString = `<a href="${urlInput.value}">${caseNumber}</a> | `;
        outputString += selectedValues.join(' | ');

        // Handle SLA tag and owner styling
        const slaTag = selectedValues.find(val => ['A', 'B', 'C'].includes(val));
        if (slaTag === 'A') {
            outputString = outputString.replace(slaTag, `<span style="color: red;">${slaTag}</span>`);
        }
        if (ownerInput.value) {
            outputString += ` | <strong>${ownerInput.value}</strong>`;
        }

        output.innerHTML = outputString;
    }

    // Event listeners
    caseInfoInput.addEventListener('input', parseCaseInfo);
    regenerateBtn.addEventListener('click', generateOutput);

    // Auto-update output when inputs change
    [urlInput, ownerInput].forEach(input => {
        input.addEventListener('input', generateOutput);
    });

    // Load dummy default selections
    function loadPreferences() {
        previousSelections = {
            1: true,
            2: true
        };
    }

    loadPreferences();  // Load default preferences on start
});
