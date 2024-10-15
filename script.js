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

        const headers = caseInfo[0].split("\t");  // First line (headers)
        const values = caseInfo[1].split("\t");   // Second line (values)

        // Find the index of "Case Number"
        const caseNumberIndex = headers.indexOf("Case Number");
        let caseNumber = "";

        if (caseNumberIndex !== -1) {
            caseNumber = values[caseNumberIndex];  // Get the case number value
        } else {
            console.error("Case Number not found in headers");
        }

        // Find the index of "Case Owner"
        const caseOwnerIndex = headers.indexOf("Case Owner");
        let caseOwnerValue = "";

        if (caseOwnerIndex !== -1) {
            caseOwnerValue = values[caseOwnerIndex];  // Get the "Case Owner" value
        }

        const selectedValues = [];

        // Collect selected values from checkboxes
        caseTableBody.querySelectorAll('tr').forEach((row, index) => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const fieldValue = values[index];

            if (checkbox.checked) {
                selectedValues.push(fieldValue);

                // Check if the "Case Owner" checkbox is checked and update ownerInput
                if (index === caseOwnerIndex) {
                    ownerInput.value = caseOwnerValue;
                    ownerInput.disabled = true;
                }
            }
        });

        // If the "Case Owner" checkbox is not checked, make owner input editable and default it to "Non"
        if (caseOwnerIndex !== -1 && !selectedValues.includes(caseOwnerValue)) {
            ownerInput.value = ownerInput.value || "Non";
            ownerInput.disabled = false;  // Allow editing when "Case Owner" is not checked
        }

        // Construct the output string
        let outputString = `<a href="${urlInput.value}">${caseNumber}</a> | `;
        outputString += selectedValues.join(' | ');

        // Handle SLA tag styling
        const slaTag = selectedValues.find(val => ['A', 'B', 'C'].includes(val));
        if (slaTag === 'A') {
            outputString = outputString.replace(slaTag, `<span style="color: red;">${slaTag}</span>`);
        }

        // Only make the case owner bold
        if (ownerInput.value) {
            outputString += ` | <strong>${ownerInput.value}</strong>`;
        }

        output.innerHTML = outputString;
    }

    // Ensure the output regenerates dynamically and when the user manually changes input
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
