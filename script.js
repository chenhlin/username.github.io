function calculateWorkHours(startTime, endTime, shift) {
    let [startHours, startMinutes] = startTime.split(':').map(Number);
    let [endHours, endMinutes] = endTime.split(':').map(Number);

    if (shift === '上午') {
        if (startHours < 9) startHours = 9;
        if (endHours >= 12) endHours = 12;
    } else if (shift === '下午') {
        if (startHours < 14) startHours = 14;
        if (endHours >= 17) endHours = 17;
    }

    if (endHours < startHours || (endHours === startHours && endMinutes < startMinutes)) {
        return " ";
    }

    let hours = endHours - startHours;
    let minutes = endMinutes - startMinutes;

    if (minutes < 0) {
        minutes += 60;
        hours -= 1;
    }

    return { hours, minutes };
}

function getShift(time) {
    const [hours, minutes] = time.split(':').map(Number);
    if (hours >= 9 && hours < 12) {
        return '上午';
    } else if (hours >= 14 && hours < 17) {
        return '下午';
    } else if (hours < 9) {
        return '上午';
    } else if (hours >= 12 && hours < 14) {
        return '下午';
    } else {
        return '其他';
    }
}

function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('current-date-time').textContent = `目前日期和時間：${dateString} ${timeString}`;
}

setInterval(updateDateTime, 1000);

document.getElementById('register-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
});

document.getElementById('admin-login-link').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('admin-login-section').style.display = 'block';
});

document.getElementById('back-to-auth').addEventListener('click', function() {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
});

document.getElementById('back-to-auth-admin').addEventListener('click', function() {
    document.getElementById('admin-login-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
});

document.getElementById('back-to-admin').addEventListener('click', function() {
    document.getElementById('add-user-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
});

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const studentId = document.getElementById('register-student-id').value;
    const name = document.getElementById('register-name').value;
    const password = document.getElementById('register-password').value;
    const registerDate = new Date().toLocaleString();
    localStorage.setItem(studentId + '_password', password);
    localStorage.setItem(studentId + '_name', name);
    localStorage.setItem(studentId + '_registerDate', registerDate);
    alert('註冊成功！');
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
});
// 使用者登入時檢查認證碼
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const authCodeInput = document.getElementById('login-auth-code').value;
    const today = new Date().toLocaleDateString();
    const storedAuthCode = localStorage.getItem('authCode_' + today);
    const storedPassword = localStorage.getItem(username + '_password');
    const name = localStorage.getItem(username + '_name');
    
    if (password === storedPassword && authCodeInput === storedAuthCode) {
        alert('登入成功！');
        localStorage.setItem('currentUser', username);
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('clock-in-section').style.display = 'block';
        document.getElementById('user-info').textContent = `學生證號：${username} 姓名：${name}`;
        displayClockRecords(username);
    } else {
        alert('用戶名、密碼或認證碼錯誤！');
    }
});

// 在管理者登入後顯示認證碼
document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const adminUsername = document.getElementById('admin-username').value;
    const adminPassword = document.getElementById('admin-password').value;
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
        alert('管理者登入成功！');
        document.getElementById('admin-login-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        populateUserSelect();
        displayAllClockRecords();
        displayUserList();
        displayAuthCode(); // 顯示認證碼
    } else {
        alert('管理者用戶名或密碼錯誤！');
    }
});

document.getElementById('clock-in-btn').addEventListener('click', function() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // 使用24小時制
    const username = localStorage.getItem('currentUser');
    document.getElementById('clock-in-time').textContent = `上班打卡時間：${dateString} ${timeString}`;
    saveClockRecord(username, '上班', dateString, timeString);
    displayClockRecords(username); // 新增這行，更新表格
});

document.getElementById('clock-out-btn').addEventListener('click', function() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // 使用24小時制
    const username = localStorage.getItem('currentUser');
    document.getElementById('clock-out-time').textContent = `下班打卡時間：${dateString} ${timeString}`;
    saveClockRecord(username, '下班', dateString, timeString);
    displayClockRecords(username); // 新增這行，更新表格
});

document.getElementById('download-btn').addEventListener('click', function() {
    downloadExcel();
});

document.getElementById('back-btn').addEventListener('click', function() {
    document.getElementById('clock-in-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
    clearClockRecords();
});

document.getElementById('back-btn-admin').addEventListener('click', function() {
    document.getElementById('admin-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'block';
});

document.getElementById('user-select').addEventListener('change', function() {
    displayAllClockRecords();
});

document.getElementById('add-user-btn').addEventListener('click', function() {
    document.getElementById('admin-section').style.display = 'none';
    document.getElementById('add-user-section').style.display = 'block';
});

document.getElementById('add-user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const studentId = document.getElementById('add-student-id').value;
    const name = document.getElementById('add-name').value;
    const password = document.getElementById('add-password').value;
    const registerDate = new Date().toLocaleString();
    localStorage.setItem(studentId + '_password', password);
    localStorage.setItem(studentId + '_name', name);
    localStorage.setItem(studentId + '_registerDate', registerDate);
    alert('新增使用者成功！');
    document.getElementById('add-user-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    displayUserList();
});

function saveClockRecord(username, type, date, time) {
    const records = JSON.parse(localStorage.getItem(username + '_clockRecords')) || [];
    records.push({ type, date, time });
    localStorage.setItem(username + '_clockRecords', JSON.stringify(records));
    displayClockRecords(username);
}

function displayClockRecords(username) {
    const records = JSON.parse(localStorage.getItem(username + '_clockRecords')) || [];
    const recordsTableBody = document.getElementById('clock-records').getElementsByTagName('tbody')[0];
    recordsTableBody.innerHTML = '';
    const dailyRecords = {};
    records.forEach(record => {
        const shift = getShift(record.time);
        const key = `${record.date}-${shift}`;
        if (!dailyRecords[key]) {
            dailyRecords[key] = { earliest: null, latest: null };
        }
        if (record.type === '上班') {
            if (!dailyRecords[key].earliest || record.time < dailyRecords[key].earliest.time) {
                dailyRecords[key].earliest = record;
            }
        } else if (record.type === '下班') {
            if (!dailyRecords[key].latest || record.time > dailyRecords[key].最新.time) {
                dailyRecords[key].最新 = record;
            }
        }
    });
    for (const key in dailyRecords) {
        const [date, shift] = key.split('-');
        const earliestRecord = dailyRecords[key].earliest;
        const latestRecord = dailyRecords[key].最新;
        if (earliestRecord && latestRecord) {
            const adjustedEarliestTime = adjustTime(earliestRecord.time, shift, 'start');
            const adjustedLatestTime = adjustTime(latestRecord.time, shift, 'end');
            const workHours = calculateWorkHours(adjustedEarliestTime, adjustedLatestTime, shift);
            const row = recordsTableBody.insertRow();
            const cellDate = row.insertCell(0);
            const cellShift = row.insertCell(1);
            const cellStart = row.insertCell(2);
            const cellEnd = row.insertCell(3);
            const cellWorkHours = row.insertCell(4);
            cellDate.textContent = date;
            cellShift.textContent = shift;
            cellStart.textContent = adjustedEarliestTime;
            cellEnd.textContent = adjustedLatestTime;
            if (typeof workHours === 'string') {
                cellWorkHours.textContent = workHours;
            } else {
                cellWorkHours.textContent = `${workHours.hours} 小時 ${workHours.minutes} 分鐘`;
            }
        }
    }
}

function adjustTime(time, shift, type) {
    let [hours, minutes] = time.split(':').map(Number);
    if (shift === '上午') {
        if (type === 'start' && hours < 9) {
            hours = 9;
            minutes = 0;
        } else if (type === 'end' && hours >= 12) {
            hours = 12;
            minutes = 0;
        }
    } else if (shift === '下午') {
        if (type === 'start' && hours < 14) {
            hours = 14;
            minutes = 0;
        } else if (type === 'end' && hours >= 17) {
            hours = 17;
            minutes = 0;
        }
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function displayAllClockRecords() {
    const selectedUser = document.getElementById('user-select').value;
    const allRecordsTableBody = document.getElementById('all-clock-records').getElementsByTagName('tbody')[0];
    allRecordsTableBody.innerHTML = '';

    if (selectedUser === 'all') {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.endsWith('_clockRecords')) {
                const username = key.replace('_clockRecords', '');
                const name = localStorage.getItem(username + '_name');
                if (!name) continue; // 跳過已刪除的用戶
                const records = JSON.parse(localStorage.getItem(key)) || [];
                const dailyRecords = {};
                records.forEach(record => {
                    const shift = getShift(record.time);
                    const key = `${record.date}-${shift}`;
                    if (!dailyRecords[key]) {
                        dailyRecords[key] = { earliest: null, latest: null };
                    }
                    if (record.type === '上班') {
                        if (!dailyRecords[key].earliest || record.time < dailyRecords[key].earliest.time) {
                            dailyRecords[key].earliest = record;
                        }
                    } else if (record.type === '下班') {
                        if (!dailyRecords[key].最新 || record.time > dailyRecords[key].最新.time) {
                            dailyRecords[key].最新 = record;
                        }
                    }
                });
                for (const key in dailyRecords) {
                    const [date, shift] = key.split('-');
                    const earliestRecord = dailyRecords[key].earliest;
                    const latestRecord = dailyRecords[key].最新;
                    if (earliestRecord && latestRecord) {
                        const adjustedEarliestTime = adjustTime(earliestRecord.time, shift, 'start');
                        const adjustedLatestTime = adjustTime(latestRecord.time, shift, 'end');
                        const workHours = calculateWorkHours(adjustedEarliestTime, adjustedLatestTime, shift);
                        const row = allRecordsTableBody.insertRow();
                        const cellUsername = row.insertCell(0);
                        const cellName = row.insertCell(1);
                        const cellDate = row.insertCell(2);
                        const cellShift = row.insertCell(3);
                        const cellStart = row.insertCell(4);
                        const cellEnd = row.insertCell(5);
                        const cellWorkHours = row.insertCell(6);
                        cellUsername.textContent = username;
                        cellName.textContent = name;
                        cellDate.textContent = date;
                        cellShift.textContent = shift;
                        cellStart.textContent = adjustedEarliestTime;
                        cellEnd.textContent = adjustedLatestTime;
                        if (typeof workHours === 'string') {
                            cellWorkHours.textContent = workHours;
                        } else {
                            cellWorkHours.textContent = `${workHours.hours} 小時 ${workHours.minutes} 分鐘`;
                        }
                    }
                }
            }
        }
    } else {
        const name = localStorage.getItem(selectedUser + '_name');
        const records = JSON.parse(localStorage.getItem(selectedUser + '_clockRecords')) || [];
        const dailyRecords = {};
        records.forEach(record => {
            const shift = getShift(record.time);
            const key = `${record.date}-${shift}`;
            if (!dailyRecords[key]) {
                dailyRecords[key] = { earliest: null, latest: null };
            }
            if (record.type === '上班') {
                if (!dailyRecords[key].earliest || record.time < dailyRecords[key].earliest.time) {
                    dailyRecords[key].earliest = record;
                }
            } else if (record.type === '下班') {
                if (!dailyRecords[key].最新 || record.time > dailyRecords[key].最新.time) {
                    dailyRecords[key].最新 = record;
                }
            }
        });
        for (const key in dailyRecords) {
            const [date, shift] = key.split('-');
            const earliestRecord = dailyRecords[key].earliest;
            const latestRecord = dailyRecords[key].最新;
            if (earliestRecord && latestRecord) {
                const adjustedEarliestTime = adjustTime(earliestRecord.time, shift, 'start');
                const adjustedLatestTime = adjustTime(latestRecord.time, shift, 'end');
                const workHours = calculateWorkHours(adjustedEarliestTime, adjustedLatestTime, shift);
                const row = allRecordsTableBody.insertRow();
                const cellUsername = row.insertCell(0);
                const cellName = row.insertCell(1);
                const cellDate = row.insertCell(2);
                const cellShift = row.insertCell(3);
                const cellStart = row.insertCell(4);
                const cellEnd = row.insertCell(5);
                const cellWorkHours = row.insertCell(6);
                cellUsername.textContent = selectedUser;
                cellName.textContent = name;
                cellDate.textContent = date;
                cellShift.textContent = shift;
                cellStart.textContent = adjustedEarliestTime;
                cellEnd.textContent = adjustedLatestTime;
                if (typeof workHours === 'string') {
                    cellWorkHours.textContent = workHours;
                } else {
                    cellWorkHours.textContent = `${workHours.hours} 小時 ${workHours.minutes} 分鐘`;
                }
            }
        }
    }
}

function populateUserSelect() {
    const userSelect = document.getElementById('user-select');
    userSelect.innerHTML = '<option value="all">所有使用者</option>';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.endsWith('_name')) {
            const studentId = key.replace('_name', '');
            const name = localStorage.getItem(key);
            const option = document.createElement('option');
            option.value = studentId;
            option.textContent = `${studentId} - ${name}`;
            userSelect.appendChild(option);
        }
    }
}

function displayUserList() {
    const userListTableBody = document.getElementById('user-list').getElementsByTagName('tbody')[0];
    userListTableBody.innerHTML = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.endsWith('_name')) {
            const studentId = key.replace('_name', '');
            const name = localStorage.getItem(key);
            const password = localStorage.getItem(studentId + '_password');
            const registerDate = localStorage.getItem(studentId + '_registerDate');
            const row = userListTableBody.insertRow();
            const cellId = row.insertCell(0);
            const cellName = row.insertCell(1);
            const cellRegisterDate = row.insertCell(2);
            const cellPassword = row.insertCell(3);
            const cellActions = row.insertCell(4);
            cellId.textContent = studentId;
            cellName.textContent = name;
            cellRegisterDate.textContent = registerDate;
            cellPassword.textContent = password;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '刪除';
            deleteButton.addEventListener('click', function() {
                deleteUser(studentId);
            });
            cellActions.appendChild(deleteButton);
        }
    }
}

function deleteUser(studentId) {
    localStorage.removeItem(studentId + '_password');
    localStorage.removeItem(studentId + '_name');
    localStorage.removeItem(studentId + '_registerDate');
    localStorage.removeItem(studentId + '_clockRecords');
    alert('使用者已刪除！');
    displayUserList();
    populateUserSelect();
}

function downloadExcel() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "用戶名,姓名,日期,上午/下午,上班,下班,工作時數\n";
    const selectedUser = document.getElementById('user-select').value;
    let fileName = "all_clock_records.csv";

    if (selectedUser === 'all') {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.endsWith('_clockRecords')) {
                const username = key.replace('_clockRecords', '');
                const name = localStorage.getItem(username + '_name');
                if (!name) continue; // 跳過已刪除的用戶
                const records = JSON.parse(localStorage.getItem(key)) || [];
                const dailyRecords = {};
                records.forEach(record => {
                    const shift = getShift(record.time);
                    const key = `${record.date}-${shift}`;
                    if (!dailyRecords[key]) {
                        dailyRecords[key] = { earliest: null, latest: null };
                    }
                    if (record.type === '上班') {
                        if (!dailyRecords[key].earliest || record.time < dailyRecords[key].earliest.time) {
                            dailyRecords[key].earliest = record;
                        }
                    } else if (record.type === '下班') {
                        if (!dailyRecords[key].最新 || record.time > dailyRecords[key].最新.time) {
                            dailyRecords[key].最新 = record;
                        }
                    }
                });
                for (const key in dailyRecords) {
                    const [date, shift] = key.split('-');
                    const earliestRecord = dailyRecords[key].earliest;
                    const latestRecord = dailyRecords[key].最新;
                    if (earliestRecord && latestRecord) {
                        const adjustedEarliestTime = adjustTime(earliestRecord.time, shift, 'start');
                        const adjustedLatestTime = adjustTime(latestRecord.time, shift, 'end');
                        const workHours = calculateWorkHours(adjustedEarliestTime, adjustedLatestTime, shift);
                        csvContent += `${username},${name},${date},${shift},${adjustedEarliestTime},${adjustedLatestTime},${typeof workHours === 'string' ? workHours : `${workHours.hours} 小時 ${workHours.minutes} 分鐘`}\n`;
                    }
                }
            }
        }
    } else {
        const name = localStorage.getItem(selectedUser + '_name');
        fileName = `${selectedUser}_${name}_clock_records.csv`;
        const records = JSON.parse(localStorage.getItem(selectedUser + '_clockRecords')) || [];
        const dailyRecords = {};
        records.forEach(record => {
            const shift = getShift(record.time);
            const key = `${record.date}-${shift}`;
            if (!dailyRecords[key]) {
                dailyRecords[key] = { earliest: null, latest: null };
            }
            if (record.type === '上班') {
                if (!dailyRecords[key].earliest || record.time < dailyRecords[key].earliest.time) {
                    dailyRecords[key].earliest = record;
                }
            } else if (record.type === '下班') {
                if (!dailyRecords[key].最新 || record.time > dailyRecords[key].最新.time) {
                    dailyRecords[key].最新 = record;
                }
            }
        });
        for (const key in dailyRecords) {
            const [date, shift] = key.split('-');
            const earliestRecord = dailyRecords[key].earliest;
            const latestRecord = dailyRecords[key].最新;
            if (earliestRecord && latestRecord) {
                const adjustedEarliestTime = adjustTime(earliestRecord.time, shift, 'start');
                const adjustedLatestTime = adjustTime(latestRecord.time, shift, 'end');
                const workHours = calculateWorkHours(adjustedEarliestTime, adjustedLatestTime, shift);
                csvContent += `${selectedUser},${name},${date},${shift},${adjustedEarliestTime},${adjustedLatestTime},${typeof workHours === 'string' ? workHours : `${workHours.hours} 小時 ${workHours.minutes} 分鐘`}\n`;
            }
        }
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearClockRecords() {
    const recordsTableBody = document.getElementById('clock-records').getElementsByTagName('tbody')[0];
    recordsTableBody.innerHTML = '';
}
// 產生每日認證碼的函數
function generateDailyAuthCode() {
    const authCode = Math.floor(100000 + Math.random() * 900000).toString(); // 產生6位數字的認證碼
    const today = new Date().toLocaleDateString();
    localStorage.setItem('authCode_' + today, authCode);
    return authCode;
}

function displayAuthCode() {
    const today = new Date().toLocaleDateString();
    const authCode = localStorage.getItem('authCode_' + today) || generateDailyAuthCode();
    document.getElementById('auth-code').textContent = `今日認證碼：${authCode}`;
    document.getElementById('auth-code').style.display = 'block';
}



// 上班打卡按鈕事件處理器
document.getElementById('clock-in-btn').addEventListener('click', function() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // 使用24小時制
    const username = localStorage.getItem('currentUser');
    document.getElementById('clock-in-time').textContent = `上班打卡時間：${dateString} ${timeString}`;
    saveClockRecord(username, '上班', dateString, timeString);
    displayClockRecords(username); // 更新表格
});

// 下班打卡按鈕事件處理器
document.getElementById('clock-out-btn').addEventListener('click', function() {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // 使用24小時制
    const username = localStorage.getItem('currentUser');
    document.getElementById('clock-out-time').textContent = `下班打卡時間：${dateString} ${timeString}`;
    saveClockRecord(username, '下班', dateString, timeString);
    displayClockRecords(username); // 更新表格
});
