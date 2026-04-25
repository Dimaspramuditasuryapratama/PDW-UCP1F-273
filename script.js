// ======================== GLOBAL ARRAY PENYIMPANAN DATA ANGGOTA ========================
let members = [];

// Load data dari localStorage (agar data tetap ada meskipun refresh)
function loadMembersFromStorage() {
    const stored = localStorage.getItem('techCommunityMembers');
    if (stored) {
        members = JSON.parse(stored);
    } else {
        // Data awal contoh agar tidak kosong
        members = [
            { fullname: "Ahmad Fauzi", email: "ahmad@techcommunity.id", field: "Frontend Developer" },
            { fullname: "Siti Nurhaliza", email: "siti@techcommunity.id", field: "UI/UX Designer" },
            { fullname: "Budi Santoso", email: "budi@techcommunity.id", field: "Backend Engineer" }
        ];
        saveMembersToStorage();
    }
}

function saveMembersToStorage() {
    localStorage.setItem('techCommunityMembers', JSON.stringify(members));
}

// Fungsi menambah anggota baru
function addMember(fullname, email, field) {
    if (!fullname || !email || !field) return false;
    const newMember = { fullname: fullname.trim(), email: email.trim(), field: field.trim() };
    members.push(newMember);
    saveMembersToStorage();
    return true;
}

// Hapus anggota berdasarkan index (opsional)
function deleteMember(index) {
    if (index >= 0 && index < members.length) {
        members.splice(index, 1);
        saveMembersToStorage();
        return true;
    }
    return false;
}

// Render tabel di halaman form.html
function renderMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada anggota. Silakan daftar!<\/td><\/tr>';
        return;
    }
    tbody.innerHTML = members.map((member, idx) => `
        <tr>
            <td>${escapeHtml(member.fullname)}</td>
            <td>${escapeHtml(member.email)}</td>
            <td>${escapeHtml(member.field)}</td>
            <td><button class="btn btn-sm btn-danger" onclick="handleDelete(${idx})"><i class="fas fa-trash"></i> Hapus</button></td>
        </tr>
    `).join('');
}

// Hapus dengan konfirmasi
window.handleDelete = function(index) {
    if (confirm('Hapus anggota ini?')) {
        deleteMember(index);
        renderMembersTable();
        updateIndexDisplay();
    }
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Update tampilan di index.html (jumlah anggota & preview)
function updateIndexDisplay() {
    const totalSpan = document.getElementById('totalMembersCount');
    if (totalSpan) totalSpan.innerText = members.length;
    
    const previewBody = document.getElementById('previewTableBody');
    if (previewBody) {
        if (members.length === 0) {
            previewBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Belum ada anggota<\/td><\/tr>';
        } else {
            const latest = [...members].reverse().slice(0, 5);
            previewBody.innerHTML = latest.map(m => `
                <tr><td>${escapeHtml(m.fullname)}</td><td>${escapeHtml(m.email)}</td><td>${escapeHtml(m.field)}</td></tr>
            `).join('');
        }
    }
}

// Inisialisasi global saat script pertama dijalankan
loadMembersFromStorage();

// Sinkronisasi antar halaman (jika ada perubahan storage di tab lain)
window.addEventListener('storage', function(e) {
    if (e.key === 'techCommunityMembers') {
        loadMembersFromStorage();
        if (document.getElementById('membersTableBody')) renderMembersTable();
        updateIndexDisplay();
    }
}); 