// Hiển thị dữ liệu người dùng khi tải trang
window.onload = function () {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!user) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "../index.html";
        return;
    }

    // Hiển thị thông tin trong phần thông tin cá nhân
    document.getElementById("name").value = user.name || "";
    document.getElementById("position").value = user.position || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("dependents").value = user.dependents || "";
    document.getElementById("salary").value = user.salary || "";

    // Cập nhật vai trò trong tiêu đề
    document.getElementById("user-role").innerHTML = `${user.position}: <strong>${user.name}</strong>`;
};

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
}

function showPersonalInfo() {
    hideAllSections();
    document.getElementById("personalInfo").style.display = "block";
}

function showSetReduction() {
    hideAllSections();
    document.getElementById("setReduction").style.display = "block";
}

function showEmployeeTax() {
    hideAllSections();
    document.getElementById("employeeTax").style.display = "block";
}

function showManageDepartments() {
    hideAllSections();
    document.getElementById("manageDepartments").style.display = "block";
}

function showManageEmployees() {
    hideAllSections();
    document.getElementById("manageEmployees").style.display = "block";
}

// Function to save the reduction amount with employee information
function saveReduction() {
    const employeeName = document.getElementById("reductionEmployeeName").value;
    const department = document.getElementById("reductionDepartment").value;
    const employeeId = document.getElementById("reductionEmployeeId").value;
    const dependents = parseInt(document.getElementById("dependents").value);

    if (!employeeName || !department || !employeeId || isNaN(dependents) || dependents < 0) {
        alert("Vui lòng nhập đầy đủ và hợp lệ thông tin.");
        return;
    }

    alert(`Mức giảm trừ đã được lưu cho nhân viên ${employeeName}, Phòng ban: ${department}, ID: ${employeeId}, Số người phụ thuộc: ${dependents}`);
}

// Function to display employee tax information based on ID
async function viewEmployeeTax() {
    const employeeId = document.getElementById("searchEmployeeId").value;

    if (!employeeId) {
        alert("Vui lòng nhập ID nhân viên.");
        return;
    }

    try {
        const response = await fetch('../excel_data/data_tt.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        const employee = excelData.find(emp => emp.ID.toString() === employeeId);

        if (employee) {
            const tableBody = document.getElementById("employeeTaxTable").getElementsByTagName("tbody")[0];
            tableBody.innerHTML = `
                <tr><td>ID</td><td>${employee.ID}</td></tr>
                <tr><td>Tên nhân viên</td><td>${employee.Name}</td></tr>
                <tr><td>Phòng ban</td><td>${employee.Department}</td></tr>
                <tr><td>Lương</td><td>${employee.Salary.toLocaleString()} VNĐ</td></tr>
                <tr><td>Giảm trừ</td><td>${employee.Reduction.toLocaleString()} VNĐ</td></tr>
                <tr><td>Thu nhập chịu thuế</td><td>${employee.TaxableIncome.toLocaleString()} VNĐ</td></tr>
                <tr><td>Thuế thu nhập cá nhân</td><td>${employee.Tax.toLocaleString()} VNĐ</td></tr>
            `;
        } else {
            alert("Không tìm thấy nhân viên với ID này.");
        }
    } catch (error) {
        console.error("Error reading the Excel file:", error);
        alert("Đã xảy ra lỗi khi đọc dữ liệu từ file Excel.");
    }
}

// Function to add a department
function addDepartment() {
    const departmentName = document.getElementById("departmentName").value;
    if (!departmentName) {
        alert("Vui lòng nhập tên phòng ban.");
        return;
    }
    const departmentsTable = document.getElementById("departmentsTable").getElementsByTagName("tbody")[0];
    departmentsTable.innerHTML += `
            <tr>
                <td>${departmentName}</td>
                <td><button onclick="deleteDepartment(this)">Xóa</button></td>
            </tr>
        `;
    document.getElementById("departmentName").value = "";
}

// Function to delete a department
function deleteDepartment(button) {
    const row = button.closest("tr");
    row.remove();
}

// Function to add an employee
function addEmployee() {
    const employeeName = document.getElementById("employeeName").value;
    const employeeContact = document.getElementById("employeeContact").value;
    const employeeSalary = parseFloat(document.getElementById("employeeSalary").value);

    if (!employeeName || !employeeContact || isNaN(employeeSalary) || employeeSalary <= 0) {
        alert("Vui lòng nhập đầy đủ thông tin nhân viên.");
        return;
    }

    const employeesTable = document.getElementById("employeesTable").getElementsByTagName("tbody")[0];
    employeesTable.innerHTML += `
            <tr>
                <td>${employeeName}</td>
                <td>${employeeContact}</td>
                <td>${employeeSalary.toLocaleString()} VNĐ</td>
                <td><button onclick="deleteEmployee(this)">Xóa</button></td>
            </tr>
        `;

    document.getElementById("employeeName").value = "";
    document.getElementById("employeeContact").value = "";
    document.getElementById("employeeSalary").value = "";
}

// Function to delete an employee
function deleteEmployee(button) {
    const row = button.closest("tr");
    row.remove();
}

// Function to log out
function logout() {
    alert("Bạn đã đăng xuất.");
    // Redirect to login page or perform other logout actions here
    window.location.href = "../index.html";
}
