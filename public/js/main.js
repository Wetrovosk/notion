// Enhanced functionality for glucose tracker
document.addEventListener('DOMContentLoaded', function() {
    // Load recent entries on page load
    loadEntries();
    
    // Set default date range to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate')?.value = today;
    document.getElementById('endDate')?.value = today;
    
    // Add humor to the page
    addHumorToPage();
    
    // Add animations to elements when they appear
    animateElements();
});

// Function to add humor to the page
function addHumorToPage() {
    const humorMessages = [
        "Сахар в крови - как настроение: то выше нормы, то ниже...",
        "Помните: сладкое в крови - не то же самое, что сладкая жизнь!",
        "Глюкометр не волшебная палочка, но помогает оставаться в рамках приличия",
        "Норма глюкозы - как идеальный вес: все знают, но у всех разная ;)",
        "Сахар в крови: 3.9-6.1 ммоль/л - норма, как и количество кофеиновых напитков в день",
        "Если уровень глюкозы высокий - не переживайте, это как высокий уровень кофеина - тоже временно!",
        "Знаете ли вы? Уровень глюкозы может меняться так же часто, как погода в мае!",
        "Сахарный диабет - это не приговор, это приглашение к более осознанной жизни",
        "Ваш глюкометр - ваш личный детектив, который следит за тем, что вы едите",
        "Уровень глюкозы - как баланс в банке: лучше держать в плюсе, но не переусердствовать"
    ];
    
    // Display random humor message in header
    const randomMessage = humorMessages[Math.floor(Math.random() * humorMessages.length)];
    const headerDiv = document.querySelector('.header');
    if (headerDiv) {
        const humorDiv = document.createElement('div');
        humorDiv.className = 'humor-box';
        humorDiv.innerHTML = `<span class="humor-text">${randomMessage}</span>`;
        headerDiv.appendChild(humorDiv);
    }
    
    // Add humor to empty state
    const entriesList = document.getElementById('entriesList');
    if (entriesList && entriesList.innerHTML.trim() === '') {
        entriesList.innerHTML = `
            <div class="text-center py-5">
                <div class="display-1 text-muted">📊</div>
                <h4 class="text-muted">Записи не найдены</h4>
                <p class="text-muted">Ваш сахарный уровень в порядке, или вы просто забыли что-то записать? ;)</p>
                <p class="text-muted">Добавьте первый элемент, чтобы начать отслеживание!</p>
            </div>
        `;
    }
}

// Function to animate elements
function animateElements() {
    const elements = document.querySelectorAll('.card, .btn');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Enhanced form submission handlers with better UX
document.getElementById('foodForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        meal_name: document.getElementById('mealName').value,
        description: document.getElementById('description').value,
        carbs: parseFloat(document.getElementById('carbs').value) || null,
        protein: parseFloat(document.getElementById('protein').value) || null,
        fat: parseFloat(document.getElementById('fat').value) || null,
        calories: parseInt(document.getElementById('calories').value) || null
    };
    
    // Disable button to prevent duplicate submissions
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Добавление...';
    submitBtn.disabled = true;
    
    fetch('/api/food', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Show success message with humor
        showToast('Прием пищи успешно добавлен! Сахар в крови уже повышается? ;)', 'success');
        document.getElementById('foodForm').reset();
        
        // Add the new entry to the list without reloading
        addNewEntryToList({
            entry_type: 'food',
            meal_name: document.getElementById('mealName').value,
            description: document.getElementById('description').value,
            carbs: parseFloat(document.getElementById('carbs').value) || null,
            protein: parseFloat(document.getElementById('protein').value) || null,
            fat: parseFloat(document.getElementById('fat').value) || null,
            calories: parseInt(document.getElementById('calories').value) || null,
            timestamp: new Date().toISOString()
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Ошибка при добавлении приема пищи', 'error');
    })
    .finally(() => {
        // Re-enable button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

document.getElementById('waterForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        amount_ml: parseInt(document.getElementById('waterAmount').value)
    };
    
    // Disable button to prevent duplicate submissions
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Добавление...';
    submitBtn.disabled = true;
    
    fetch('/api/water', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        showToast('Вода успешно добавлена! Не превратитесь в морскую звезду ;)', 'success');
        document.getElementById('waterForm').reset();
        
        // Add the new entry to the list without reloading
        addNewEntryToList({
            entry_type: 'water',
            amount_ml: parseInt(document.getElementById('waterAmount').value),
            timestamp: new Date().toISOString()
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Ошибка при добавлении воды', 'error');
    })
    .finally(() => {
        // Re-enable button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

document.getElementById('glucoseForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        reading: parseFloat(document.getElementById('glucoseReading').value),
        notes: document.getElementById('glucoseNotes').value
    };
    
    // Disable button to prevent duplicate submissions
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Добавление...';
    submitBtn.disabled = true;
    
    fetch('/api/glucose', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        showToast('Измерение глюкозы успешно добавлено! Сахарный магнат в действии! ;)', 'success');
        document.getElementById('glucoseForm').reset();
        document.getElementById('glucoseStatus').style.display = 'none';
        
        // Add the new entry to the list without reloading
        addNewEntryToList({
            entry_type: 'glucose',
            glucose_reading: parseFloat(document.getElementById('glucoseReading').value),
            notes: document.getElementById('glucoseNotes').value,
            timestamp: new Date().toISOString()
        });
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Ошибка при добавлении измерения глюкозы', 'error');
    })
    .finally(() => {
        // Re-enable button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});

// Add new entry to the list without reloading the page
function addNewEntryToList(entry) {
    const container = document.getElementById('entriesList');
    
    // If it's the first entry, clear the "no entries" message
    if(container.innerHTML.trim() === '' || 
       container.querySelector('.text-muted')?.textContent.includes('Записи не найдены')) {
        container.innerHTML = '<div class="list-group"></div>';
    }
    
    const listGroup = container.querySelector('.list-group') || container;
    
    let entryHtml = '<div class="list-group-item ';
    
    // Add class based on entry type
    switch(entry.entry_type) {
        case 'food':
            entryHtml += 'food-entry';
            break;
        case 'water':
            entryHtml += 'water-entry';
            break;
        case 'glucose':
            entryHtml += 'glucose-entry';
            break;
    }
    
    // Format timestamp
    const date = new Date(entry.timestamp);
    const formattedTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const formattedDate = date.toLocaleDateString();
    
    entryHtml += ` animated"><div class="d-flex justify-content-between">
        <strong>` + (entry.entry_type === 'food' ? '🍽 Прием пищи' : entry.entry_type === 'water' ? '💧 Вода' : '📊 Глюкоза') + `</strong>
        <small class="text-muted">${formattedDate} ${formattedTime}</small>
    </div>`;
    
    if (entry.meal_name) {
        entryHtml += `<div><strong>${entry.meal_name}</strong></div>`;
    }
    
    if (entry.description) {
        entryHtml += `<div class="text-muted">${entry.description}</div>`;
    }
    
    if (entry.amount_ml) {
        entryHtml += `<div>💧 Water: ${entry.amount_ml} ml</div>`;
    }
    
    if (entry.glucose_reading) {
        // Determine glucose status for display
        const reading = entry.glucose_reading;
        const normalMin = 3.9;
        const normalMax = 6.1;
        let statusClass = '';
        let statusText = '';
        let emoji = '';
        
        if (reading >= normalMin && reading <= normalMax) {
            statusClass = 'text-success';
            statusText = ' (норма)';
            emoji = '✅';
        } else if (reading < normalMin) {
            statusClass = 'text-warning';
            statusText = ' (ниже нормы)';
            emoji = '⚠️';
        } else {
            statusClass = 'text-danger';
            statusText = ' (выше нормы)';
            emoji = '❌';
        }
        
        entryHtml += `<div class="glucose-display">${emoji} <span class="${statusClass}">Glucose: ${reading} ммоль/л</span>${statusText}</div>`;
    }
    
    if (entry.carbs || entry.protein || entry.fat || entry.calories) {
        entryHtml += '<div class="mt-1">';
        if (entry.carbs) entryHtml += `<span class="badge bg-primary me-1"> углеводы: ${entry.carbs}g</span>`;
        if (entry.protein) entryHtml += `<span class="badge bg-success me-1">белки: ${entry.protein}g</span>`;
        if (entry.fat) entryHtml += `<span class="badge bg-warning me-1">жиры: ${entry.fat}g</span>`;
        if (entry.calories) entryHtml += `<span class="badge bg-info me-1">ккал: ${entry.calories}</span>`;
        entryHtml += '</div>';
    }
    
    if (entry.notes) {
        entryHtml += `<div class="mt-1"><em>📝 ${entry.notes}</em></div>`;
    }
    
    entryHtml += '</div>';
    
    // Add to the beginning of the list to show the newest entry first
    if(listGroup.firstChild) {
        listGroup.insertBefore(createElementFromHTML(entryHtml), listGroup.firstChild);
    } else {
        listGroup.innerHTML = entryHtml;
    }
}

// Helper function to create element from HTML string
function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

// Add real-time validation and status display for glucose reading
document.getElementById('glucoseReading')?.addEventListener('input', function() {
    const value = parseFloat(this.value);
    const statusDiv = document.getElementById('glucoseStatus');
    
    if (isNaN(value)) {
        statusDiv.style.display = 'none';
        return;
    }
    
    const normalMin = 3.9;
    const normalMax = 6.1;
    
    statusDiv.style.display = 'block';
    
    if (value >= normalMin && value <= normalMax) {
        statusDiv.textContent = `Норма (${normalMin}-${normalMax} ммоль/л)`;
        statusDiv.className = 'form-text text-success';
    } else if (value < normalMin) {
        statusDiv.textContent = `Ниже нормы (норма: ${normalMin}-${normalMax} ммоль/л)`;
        statusDiv.className = 'form-text text-warning';
    } else {
        statusDiv.textContent = `Выше нормы (норма: ${normalMin}-${normalMax} ммоль/л)`;
        statusDiv.className = 'form-text text-danger';
    }
});

// Enhanced load entries function
function loadEntries() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    
    let url = '/api/tracking-entries';
    if (startDate && endDate) {
        url += `?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`;
    }
    
    // Show loading state
    const container = document.getElementById('entriesList');
    container.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>
            <p class="mt-2 text-muted">Загрузка записей...</p>
        </div>
    `;
    
    fetch(url)
    .then(response => response.json())
    .then(entries => {
        displayEntries(entries);
    })
    .catch(error => {
        console.error('Error loading entries:', error);
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Ошибка загрузки записей. Пожалуйста, обновите страницу.
            </div>
        `;
    });
}

// Enhanced display entries function
function displayEntries(entries) {
    const container = document.getElementById('entriesList');
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="display-1 text-muted">📊</div>
                <h4 class="text-muted">Записи не найдены</h4>
                <p class="text-muted">Ваш сахарный уровень в порядке, или вы просто забыли что-то записать? ;)</p>
                <p class="text-muted">Добавьте первый элемент, чтобы начать отслеживание!</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="list-group">';
    
    entries.forEach(entry => {
        let entryHtml = '<div class="list-group-item ';
        
        // Add class based on entry type
        switch(entry.entry_type) {
            case 'food':
                entryHtml += 'food-entry';
                break;
            case 'water':
                entryHtml += 'water-entry';
                break;
            case 'glucose':
                entryHtml += 'glucose-entry';
                break;
        }
        
        // Format timestamp
        const date = new Date(entry.timestamp);
        const formattedTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const formattedDate = date.toLocaleDateString();
        
        entryHtml += ` animated"><div class="d-flex justify-content-between">
            <strong>` + (entry.entry_type === 'food' ? '🍽 Прием пищи' : entry.entry_type === 'water' ? '💧 Вода' : '📊 Глюкоза') + `</strong>
            <small class="text-muted">${formattedDate} ${formattedTime}</small>
        </div>`;
        
        if (entry.meal_name) {
            entryHtml += `<div><strong>${entry.meal_name}</strong></div>`;
        }
        
        if (entry.description) {
            entryHtml += `<div class="text-muted">${entry.description}</div>`;
        }
        
        if (entry.amount_ml) {
            entryHtml += `<div>💧 Water: ${entry.amount_ml} ml</div>`;
        }
        
        if (entry.glucose_reading) {
            // Determine glucose status for display
            const reading = entry.glucose_reading;
            const normalMin = 3.9;
            const normalMax = 6.1;
            let statusClass = '';
            let statusText = '';
            let emoji = '';
            
            if (reading >= normalMin && reading <= normalMax) {
                statusClass = 'text-success';
                statusText = ' (норма)';
                emoji = '✅';
            } else if (reading < normalMin) {
                statusClass = 'text-warning';
                statusText = ' (ниже нормы)';
                emoji = '⚠️';
            } else {
                statusClass = 'text-danger';
                statusText = ' (выше нормы)';
                emoji = '❌';
            }
            
            entryHtml += `<div class="glucose-display">${emoji} <span class="${statusClass}">Glucose: ${reading} ммоль/л</span>${statusText}</div>`;
        }
        
        if (entry.carbs || entry.protein || entry.fat || entry.calories) {
            entryHtml += '<div class="mt-1">';
            if (entry.carbs) entryHtml += `<span class="badge bg-primary me-1"> углеводы: ${entry.carbs}g</span>`;
            if (entry.protein) entryHtml += `<span class="badge bg-success me-1">белки: ${entry.protein}g</span>`;
            if (entry.fat) entryHtml += `<span class="badge bg-warning me-1">жиры: ${entry.fat}g</span>`;
            if (entry.calories) entryHtml += `<span class="badge bg-info me-1">ккал: ${entry.calories}</span>`;
            entryHtml += '</div>';
        }
        
        if (entry.notes) {
            entryHtml += `<div class="mt-1"><em>📝 ${entry.notes}</em></div>`;
        }
        
        entryHtml += '</div>';
        html += entryHtml;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add humor to the page after loading entries
    addHumorToPage();
}

// Filter button handler - fixed to not clear the entries
document.getElementById('filterBtn')?.addEventListener('click', function() {
    // Prevent default behavior that might cause page refresh
    loadEntries();
});

// Also reload when date inputs change
document.getElementById('startDate')?.addEventListener('change', loadEntries);
document.getElementById('endDate')?.addEventListener('change', loadEntries);

// Toast notification function
function showToast(message, type = 'info') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-container');
    if(existingToast) {
        existingToast.remove();
    }
    
    // Create toast container
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '10000';
    toastContainer.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header">
                <strong class="me-auto">
                    ${type === 'success' ? '✅ Успешно' : 
                      type === 'error' ? '❌ Ошибка' : 
                      type === 'warning' ? '⚠️ Внимание' : 'ℹ️ Информация'}
                </strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if(toastContainer) {
            toastContainer.remove();
        }
    }, 5000);
}

// Add floating action button for quick access to forms
function addFloatingButtons() {
    const floatingBtnContainer = document.createElement('div');
    floatingBtnContainer.className = 'position-fixed bottom-0 end-0 p-3';
    floatingBtnContainer.style.zIndex = '1000';
    
    floatingBtnContainer.innerHTML = `
        <div class="d-flex flex-column align-items-end">
            <button id="quickFoodBtn" class="btn btn-primary rounded-circle mb-2 shadow" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
                <span>🍽</span>
            </button>
            <button id="quickWaterBtn" class="btn btn-info rounded-circle mb-2 shadow" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
                <span>💧</span>
            </button>
            <button id="quickGlucoseBtn" class="btn btn-danger rounded-circle mb-2 shadow" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
                <span>📊</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(floatingBtnContainer);
    
    // Add event listeners to quick buttons
    document.getElementById('quickFoodBtn')?.addEventListener('click', () => {
        document.getElementById('mealName')?.focus();
    });
    
    document.getElementById('quickWaterBtn')?.addEventListener('click', () => {
        document.getElementById('waterAmount')?.focus();
    });
    
    document.getElementById('quickGlucoseBtn')?.addEventListener('click', () => {
        document.getElementById('glucoseReading')?.focus();
    });
}

// Add the floating buttons after DOM loads
setTimeout(addFloatingButtons, 1000);