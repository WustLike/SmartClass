// 全局变量
let currentRole = 'student';
let currentUser = '';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化登录表单
    initLoginForm();
    
    // 初始化角色选择
    initRoleSelector();
    
    // 初始化学生页面菜单
    initStudentMenu();
    
    // 初始化教师页面菜单
    initTeacherMenu();
    
    // 初始化退出按钮
    initLogoutButtons();
    
    // 检查是否有记住的登录信息
    checkRememberedLogin();
    
    // 初始化表单提交事件
    initForms();
    
    // 初始化标签页切换
    initTabs();
    
    // 初始化资源按钮
    initResourceButtons();
    
    // 初始化教师操作按钮
    initTeacherActionButtons();
    
    // 初始化通知功能
    initNotifications();
    
    // 初始化教师发送信息功能
    await initTeacherShare();
    
    // 初始化教师答案发布功能
    initTeacherAnswer();
    
    // 初始化游戏体验页面数据
    await loadShareItems();
    
    // 初始化对比体验页面数据
    await loadComparisonShareItems();
    
    // 当教师进入动手实操页面时加载数据
    const teacherPracticePageEl = document.getElementById('teacher-practice');
    if (teacherPracticePageEl) {
        loadStudentTrackingData();
        loadStudentModelingData();
    }
    
    // 初始化教师对比体验页面消息发送功能
    await initTeacherComparisonShare();
    
    // 当教师进入情景警示页面时更新视频列表
    // const teacherWarningPage = document.getElementById('teacher-warning');
    // if (teacherWarningPage) {
    //     updateWarningVideoList();
    // }
    
    // 加载讨论消息并设置定时刷新
    console.log('开始初始化讨论消息');
    
    // 尝试直接加载讨论消息
    loadDiscussionMessages();
    
    // 使用MutationObserver监听DOM变化，当讨论消息容器被创建时自动加载消息
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.id === 'student-discussion-messages' || node.id === 'teacher-discussion-messages') {
                    console.log('讨论消息容器已创建，开始加载消息');
                    loadDiscussionMessages();
                }
                // 检查子节点
                if (node.querySelectorAll) {
                    const studentContainer = node.querySelector('#student-discussion-messages');
                    const teacherContainer = node.querySelector('#teacher-discussion-messages');
                    if (studentContainer || teacherContainer) {
                        console.log('讨论消息容器已创建，开始加载消息');
                        loadDiscussionMessages();
                    }
                }
            });
        });
    });
    
    // 监听整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 每3秒自动刷新一次讨论消息
    setInterval(loadDiscussionMessages, 3000);
    
    // 加载学生作业列表并设置定时刷新
    const studentHomeworkPage = document.getElementById('student-homework');
    if (studentHomeworkPage) {
        loadStudentHomeworks();
        // 每30秒刷新一次作业列表
        setInterval(() => {
            loadStudentHomeworks();
        }, 30000);
    }
});

// 初始化登录表单
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    console.log('初始化登录表单:', loginForm);
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            console.log('登录表单提交事件触发');
            e.preventDefault();
            handleLogin();
        });
        
        // 为登录按钮添加点击事件监听器，作为备份
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            console.log('找到登录按钮:', loginBtn);
            loginBtn.addEventListener('click', function(e) {
                console.log('登录按钮点击事件触发');
                e.preventDefault();
                handleLogin();
            });
        }
    }
}

// 初始化角色选择
function initRoleSelector() {
    console.log('初始化角色选择器');
    // 使用更具体的选择器
    const roleSelector = document.querySelector('#login-form .role-selector');
    console.log('角色选择器元素:', roleSelector);
    
    if (roleSelector) {
        roleSelector.addEventListener('click', function(e) {
            const target = e.target.closest('.role-option');
            if (target) {
                console.log('点击了角色选项:', target.getAttribute('data-role'));
                // 移除所有活动状态
                const roleOptions = roleSelector.querySelectorAll('.role-option');
                roleOptions.forEach(opt => opt.classList.remove('active'));
                // 添加当前活动状态
                target.classList.add('active');
                // 更新当前角色
                currentRole = target.getAttribute('data-role');
                console.log('当前角色更新为:', currentRole);
            }
        });
        
        // 初始化时设置默认角色
        const activeOption = roleSelector.querySelector('.role-option.active');
        if (activeOption) {
            currentRole = activeOption.getAttribute('data-role');
            console.log('初始化默认角色:', currentRole);
        }
    } else {
        console.error('角色选择器元素未找到');
        // 即使找不到角色选择器，也设置默认角色
        currentRole = 'student';
        console.log('设置默认角色为:', currentRole);
    }
}

// 初始化学生页面菜单
function initStudentMenu() {
    const studentMenuItems = document.querySelectorAll('#student-page .sidebar-menu .menu-item');
    studentMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menu = this.getAttribute('data-menu');
            switchStudentMenu(menu);
        });
    });
}

// 初始化教师页面菜单
function initTeacherMenu() {
    const teacherMenuItems = document.querySelectorAll('#teacher-page .menu-item');
    teacherMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menu = this.getAttribute('data-menu');
            switchTeacherMenu(menu);
        });
    });
}

// 初始化退出按钮
function initLogoutButtons() {
    // 学生退出按钮
    const studentLogoutBtn = document.getElementById('logout-btn');
    if (studentLogoutBtn) {
        studentLogoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // 教师退出按钮
    const teacherLogoutBtn = document.getElementById('teacher-logout-btn');
    if (teacherLogoutBtn) {
        teacherLogoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // 调试信息
    console.log('登录尝试:', {
        username: username,
        password: password
    });
    
    // 简单的登录验证（实际应用中应该与后端验证）
    // 首先检查是否是教师登录
    if ((username === 'teacher' || username === 'teacher1') && password === '123456') {
        // 登录成功
        console.log('教师登录成功:', username);
        currentUser = username;
        currentRole = 'teacher';
        
        // 记住登录信息
        if (rememberMe) {
            localStorage.setItem('role', currentRole);
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('role');
            localStorage.removeItem('username');
        }
        
        // 切换到教师页面
        switchPage('teacher-page');
        // 切换到游戏体验菜单
        switchTeacherMenu('game');
        // 更新教师姓名
        document.getElementById('teacher-name').textContent = username;
    } else if ((username === '小组1' || username === '小组2' || username === '小组3' || username === '小组4') && password === '1111') {
        // 学生登录成功
        console.log('学生登录成功:', username);
        currentUser = username;
        currentRole = 'student';
        
        // 记住登录信息
        if (rememberMe) {
            localStorage.setItem('role', currentRole);
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('role');
            localStorage.removeItem('username');
        }
        
        // 切换到学生页面
        switchPage('student-page');
        // 更新学生姓名
        document.getElementById('student-name').textContent = username;
    } else {
        // 登录失败
        console.log('登录失败:', username, password);
        alert('用户名或密码错误！\n学生(小组): 小组1-4 / 1111\n教师: teacher / 123456');
    }
}

// 检查是否有记住的登录信息
function checkRememberedLogin() {
    const savedRole = localStorage.getItem('role');
    const savedUsername = localStorage.getItem('username');
    
    if (savedRole && savedUsername) {
        currentRole = savedRole;
        currentUser = savedUsername;
        
        // 自动登录
        if (savedRole === 'student') {
            switchPage('student-page');
            document.getElementById('student-name').textContent = savedUsername;
        } else if (savedRole === 'teacher') {
            switchPage('teacher-page');
            switchTeacherMenu('game');
            document.getElementById('teacher-name').textContent = savedUsername;
        }
    } else {
        // 默认显示登录页面
        switchPage('login-page');
    }
}

// 切换页面
function switchPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// 学生菜单切换
async function switchStudentMenu(menu) {
    console.log('切换到菜单:', menu);
    
    // 移除所有菜单活动状态
    const menuItems = document.querySelectorAll('#student-page .menu-item');
    console.log('菜单项目数量:', menuItems.length);
    menuItems.forEach(item => {
        console.log('菜单项目:', item.textContent.trim(), 'data-menu:', item.getAttribute('data-menu'));
        item.classList.remove('active');
    });
    
    // 添加当前菜单活动状态
    const activeMenuItem = document.querySelector(`#student-page .menu-item[data-menu="${menu}"]`);
    console.log('当前菜单项目:', activeMenuItem);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
        console.log('已添加active类到菜单项目');
    }
    
    // 隐藏所有内容区域
    const contentSections = document.querySelectorAll('#student-page .content-section');
    console.log('内容区域数量:', contentSections.length);
    contentSections.forEach(section => {
        console.log('内容区域:', section.id);
        section.classList.remove('active');
        section.style.display = 'none';
        console.log('已移除active类并设置display:none:', section.id);
    });
    
    // 显示当前内容区域
    const sectionId = `student-${menu}`;
    console.log('尝试显示内容区域:', sectionId);
    
    // 直接遍历所有内容区域，找到匹配的id
    contentSections.forEach(section => {
        if (section.id === sectionId) {
            console.log('找到匹配的内容区域:', section.id);
            section.classList.add('active');
            section.style.display = 'block';
            console.log('已添加active类并设置display:block到内容区域:', section.id);
            
            // 如果切换到作业页面，加载作业列表
            if (menu === 'homework') {
                loadStudentHomeworks();
            }
        }
    });
}

// 教师菜单切换
async function switchTeacherMenu(menu) {
    // 移除所有菜单活动状态
    const menuItems = document.querySelectorAll('#teacher-page .menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // 添加当前菜单活动状态
    const activeMenuItem = document.querySelector(`#teacher-page .menu-item[data-menu="${menu}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // 隐藏所有内容区域
    const contentSections = document.querySelectorAll('#teacher-page .content-section');
    contentSections.forEach(section => section.classList.remove('active'));
    
    // 显示当前内容区域
    let activeSection;
    
    // 映射菜单项到内容区域ID
    const menuToSectionMap = {
        'dashboard': 'teacher-dashboard',
        'game': 'teacher-dashboard',
        'warning': 'teacher-warning',
        'comparison': 'teacher-comparison',
        'practice': 'teacher-practice',
        'principle': 'teacher-principle',
        'homework': 'teacher-homework',
        'analytics': 'teacher-analytics',

    };
    
    // 获取对应的内容区域ID
    const sectionId = menuToSectionMap[menu] || `teacher-${menu}`;
    activeSection = document.getElementById(sectionId);
    
    if (activeSection) {
            activeSection.classList.add('active');
            
            // 如果切换到首页或游戏体验菜单项，更新仪表盘数据
            if (menu === 'dashboard' || menu === 'game') {
                await updateTeacherDashboard();
            }
            
            // 如果切换到对比体验菜单项，加载对比体验数据并初始化发送功能
            if (menu === 'comparison') {
                await initTeacherComparisonShare();
            }
            
            // 如果切换到原理升华菜单项，初始化发送功能
            if (menu === 'principle') {
                await initTeacherPrincipleShare();
            }
            
            // 如果切换到动手实操菜单项，加载学生提交的数据
            if (menu === 'practice') {
                loadStudentTrackingData();
                loadStudentModelingData();
            }
            
            // 如果切换到作业管理菜单项，加载待批改作业列表
            if (menu === 'homework') {
                // 切换到待批改标签页
                const pendingTab = document.querySelector('.homework-tabs .tab-btn[data-tab="pending"]');
                if (pendingTab) {
                    pendingTab.click();
                }
                // 每30秒刷新一次作业列表
        setInterval(async function() {
            const activeTab = document.querySelector('.homework-tabs .tab-btn.active');
            if (activeTab) {
                const tab = activeTab.getAttribute('data-tab');
                await switchHomeworkTab(tab);
            }
        }, 30000);
        
        // 作业标签页点击事件
        const tabBtns = document.querySelectorAll('.homework-tabs .tab-btn');
        tabBtns.forEach(tabBtn => {
            tabBtn.addEventListener('click', async function() {
                // 移除所有标签页的活跃状态
                tabBtns.forEach(btn => btn.classList.remove('active'));
                // 添加当前标签页的活跃状态
                this.classList.add('active');
                // 获取标签页类型
                const tab = this.getAttribute('data-tab');
                // 加载对应标签页的作业
                await switchHomeworkTab(tab);
            });
        });
            }
        }
}

// 退出登录
function logout() {
    // 清除当前用户信息
    currentUser = '';
    
    // 切换到登录页面
    switchPage('login-page');
    
    // 清空表单
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('remember-me').checked = false;
}

// 从服务器获取作业数据
async function fetchHomeworks() {
    try {
        const response = await fetch('/homeworks');
        if (!response.ok) {
            throw new Error('Failed to fetch homeworks');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching homeworks:' + error);
        return [];
    }
}

// 向服务器添加作业
async function addHomework(homework) {
    try {
        const response = await fetch('/homeworks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(homework)
        });
        if (!response.ok) {
            throw new Error('Failed to add homework');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding homework:', error);
        return null;
    }
}

// 更新教师端仪表盘
async function updateTeacherDashboard() {
    // 从服务器获取作业
    const homeworks = await fetchHomeworks();
    
    // 计算未批改作业数量
    const pendingHomeworks = homeworks.filter(homework => homework.status === 'submitted').length;
    
    // 更新未批改作业数量
    const pendingHomeworksElement = document.getElementById('pending-homeworks-count');
    if (pendingHomeworksElement) {
        pendingHomeworksElement.textContent = `${pendingHomeworks} 份作业`;
    }
    
    // 加载学生游戏得分
    await loadStudentGameScores();
    
    // 加载学生分享内容
    await loadStudentGameShares();
}

// 加载学生游戏得分
async function loadStudentGameScores() {
    // 获取学生游戏得分容器
    const studentGameScoresElement = document.getElementById('student-game-scores');
    if (!studentGameScoresElement) {
        console.log('未找到学生游戏得分容器');
        return;
    }
    
    // 显示加载状态
    studentGameScoresElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">加载中...</p>';
    
    try {
        // 从服务器获取游戏得分记录
        const response = await fetch('game-scores');
        if (!response.ok) {
            throw new Error('Failed to fetch game scores');
        }
        const gameScoreRecords = await response.json();
        
        // 清空学生游戏得分列表
        studentGameScoresElement.innerHTML = '';
        
        // 如果没有学生游戏得分，显示提示信息
        if (gameScoreRecords.length === 0) {
            studentGameScoresElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">暂无学生游戏得分</p>';
            console.log('暂无学生游戏得分');
            return;
        }
        
        // 创建表格
        const table = document.createElement('table');
        table.style = 'width: 100%; border-collapse: collapse; margin-top: 10px;';
        
        // 创建表头
        const thead = document.createElement('thead');
        thead.style = 'background-color: #f2f2f2;';
        thead.innerHTML = `
            <tr>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">学生账号</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">得分</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">同步时间</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // 创建表体
        const tbody = document.createElement('tbody');
        
        // 按时间倒序排列
        gameScoreRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // 遍历学生游戏得分记录，添加到表格
        gameScoreRecords.forEach(record => {
            const tr = document.createElement('tr');
            tr.style = 'border-bottom: 1px solid #ddd;';
            
            const recordDate = new Date(record.timestamp);
            
            tr.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 12px;">${record.student}</td>
                <td style="border: 1px solid #ddd; padding: 12px;"><strong>${record.score}</strong></td>
                <td style="border: 1px solid #ddd; padding: 12px;">${recordDate.toLocaleString()}</td>
            `;
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        studentGameScoresElement.appendChild(table);
        
        console.log('已加载学生游戏得分:', gameScoreRecords);
    } catch (error) {
        console.error('Error loading game scores:', error);
        // 加载失败时从localStorage获取作为备份
        const gameScoreRecords = JSON.parse(localStorage.getItem('gameScoreRecords') || '[]');
        
        studentGameScoresElement.innerHTML = '';
        
        if (gameScoreRecords.length === 0) {
            studentGameScoresElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">暂无学生游戏得分</p>';
        } else {
            // 创建表格显示本地数据
            const table = document.createElement('table');
            table.style = 'width: 100%; border-collapse: collapse; margin-top: 10px;';
            
            const thead = document.createElement('thead');
            thead.style = 'background-color: #f2f2f2;';
            thead.innerHTML = `
                <tr>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">学生账号</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">得分</th>
                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">同步时间</th>
                </tr>
            `;
            table.appendChild(thead);
            
            const tbody = document.createElement('tbody');
            
            gameScoreRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            gameScoreRecords.forEach(record => {
                const tr = document.createElement('tr');
                tr.style = 'border-bottom: 1px solid #ddd;';
                
                const recordDate = new Date(record.timestamp);
                
                tr.innerHTML = `
                    <td style="border: 1px solid #ddd; padding: 12px;">${record.student}</td>
                    <td style="border: 1px solid #ddd; padding: 12px;"><strong>${record.score}</strong></td>
                    <td style="border: 1px solid #ddd; padding: 12px;">${recordDate.toLocaleString()}</td>
                `;
                
                tbody.appendChild(tr);
            });
            
            table.appendChild(tbody);
            studentGameScoresElement.appendChild(table);
        }
    }
}

// 加载学生分享内容
async function loadStudentGameShares() {
    // 获取学生分享内容容器
    const studentGameSharesElement = document.getElementById('student-game-shares');
    if (!studentGameSharesElement) return;
    
    // 显示加载状态
    studentGameSharesElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">加载中...</p>';
    
    try {
        // 从服务器获取分享数据
        const response = await fetch('game-shares');
        if (!response.ok) {
            throw new Error('Failed to fetch game shares');
        }
        const gameShares = await response.json();
        
        // 清空学生分享内容列表
        studentGameSharesElement.innerHTML = '';
        
        // 如果没有学生分享内容，显示提示信息
        if (gameShares.length === 0) {
            studentGameSharesElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">暂无学生分享内容</p>';
            return;
        }
        
        // 遍历学生分享内容，添加到列表
        gameShares.forEach(share => {
            const shareElement = document.createElement('div');
            const isTeacher = share.team === '教师' || share.student === 'teacher';
            
            shareElement.style = `
                display: flex;
                margin-bottom: 15px;
                ${isTeacher ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
            `;
            
            const shareDate = new Date(share.timestamp || share.time);
            
            shareElement.innerHTML = `
                <div style="max-width: 70%;">
                    <div style="display: flex; ${isTeacher ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}; margin-bottom: 5px;">
                        <span style="font-size: 12px; font-weight: 600; ${isTeacher ? 'color: #07C160;' : 'color: #667eea;'}">${share.team || share.student}</span>
                    </div>
                    <div style="${isTeacher ? 'background-color: #d9f7be; border-bottom-right-radius: 4px;' : 'background-color: #ffffff; border-bottom-left-radius: 4px;'} border-radius: 12px; padding: 12px 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                        <p style="margin-bottom: 5px; color: #333; line-height: 1.4;">${share.content}</p>
                        <div style="display: flex; ${isTeacher ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}">
                            <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>
            `;
            
            studentGameSharesElement.appendChild(shareElement);
        });
    } catch (error) {
        console.error('Error loading game shares:', error);
        // 加载失败时从localStorage获取作为备份
        const gameShares = JSON.parse(localStorage.getItem('gameShares') || '[]');
        const teacherShareData = JSON.parse(localStorage.getItem('teacherShareData') || '[]');
        
        // 合并所有分享数据
        const allShareData = [...gameShares, ...teacherShareData];
        
        studentGameSharesElement.innerHTML = '';
        
        if (allShareData.length === 0) {
            studentGameSharesElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">暂无学生分享内容</p>';
        } else {
            // 按时间倒序排列
            allShareData.sort((a, b) => new Date(b.timestamp || b.time) - new Date(a.timestamp || a.time));
            
            // 遍历分享内容，添加到列表
            allShareData.forEach(share => {
                const shareElement = document.createElement('div');
                const isTeacher = share.team === '教师' || share.student === 'teacher';
                
                shareElement.style = `
                    display: flex;
                    margin-bottom: 15px;
                    ${isTeacher ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
                `;
                
                const shareDate = new Date(share.timestamp || share.time);
                
                shareElement.innerHTML = `
                    <div style="max-width: 70%;">
                        <div style="display: flex; ${isTeacher ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}; margin-bottom: 5px;">
                            <span style="font-size: 12px; font-weight: 600; ${isTeacher ? 'color: #07C160;' : 'color: #667eea;'}">${share.team || share.student}</span>
                        </div>
                        <div style="${isTeacher ? 'background-color: #d9f7be; border-bottom-right-radius: 4px;' : 'background-color: #ffffff; border-bottom-left-radius: 4px;'} border-radius: 12px; padding: 12px 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                            <p style="margin-bottom: 5px; color: #333; line-height: 1.4;">${share.content}</p>
                            <div style="display: flex; ${isTeacher ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}">
                                <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                studentGameSharesElement.appendChild(shareElement);
            });
        }
    }
}

// 初始化教师发送信息功能
async function initTeacherShare() {
    const teacherShareBtn = document.getElementById('teacher-share-btn');
    if (!teacherShareBtn) return;
    
    teacherShareBtn.addEventListener('click', async function() {
        const teacherShareContent = document.getElementById('teacher-share-content');
        if (!teacherShareContent) return;
        
        const content = teacherShareContent.value.trim();
        if (!content) {
            alert('请输入信息内容');
            return;
        }
        
        // 获取当前时间
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN');
        
        // 创建分享数据
        const newShare = {
            team: '教师',
            student: '教师',
            content: content,
            time: timeString,
            timestamp: now.toISOString()
        };
        
        try {
            // 发送到服务器
            const response = await fetch('game-shares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newShare)
            });
            
            if (!response.ok) {
                throw new Error('Failed to sync share');
            }
            
            // 同时保存到localStorage作为备份
            const gameShares = JSON.parse(localStorage.getItem('gameShares') || '[]');
            gameShares.push(newShare);
            localStorage.setItem('gameShares', JSON.stringify(gameShares));
            
            // 清空输入框
            teacherShareContent.value = '';
            
            // 重新加载学生分享内容
            await loadStudentGameShares();
            
            // 显示成功提示
            alert('信息发送成功！');
        } catch (error) {
            console.error('Error syncing share:', error);
            alert('同步失败，请稍后重试！');
        }
    });
    
    // 定时刷新学生游戏得分和分享内容
    setInterval(async function() {
        await loadStudentGameScores();
        await loadStudentGameShares();
    }, 10000); // 每10秒刷新一次
}

// 加载未批改作业列表
async function loadPendingHomeworks() {
    // 从服务器获取作业
    const homeworks = await fetchHomeworks();
    
    // 过滤出未批改的作业（状态为submitted）
    const pendingHomeworks = homeworks.filter(homework => homework.status === 'submitted');
    
    // 获取未批改作业列表容器
    const pendingHomeworksItemsElement = document.getElementById('pending-homeworks-items');
    if (!pendingHomeworksItemsElement) return;
    
    // 清空作业列表
    pendingHomeworksItemsElement.innerHTML = '';
    
    // 如果没有未批改作业，显示提示信息
    if (pendingHomeworks.length === 0) {
        pendingHomeworksItemsElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">暂无未批改作业</p>';
        return;
    }
    
    // 遍历作业，添加到列表
    pendingHomeworks.forEach(homework => {
        const homeworkElement = document.createElement('div');
        homeworkElement.className = 'pending-homework-item';
        homeworkElement.style = 'background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #ff9800;';
        
        const deadline = new Date(homework.deadline);
        const submittedAt = new Date(homework.submittedAt);
        
        homeworkElement.innerHTML = `
            <h4 style="margin-top: 0; margin-bottom: 10px; color: #333;">${homework.title}</h4>
            <p style="margin-bottom: 10px; color: #666; font-size: 14px;">提交人: ${homework.student || '未知'}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="font-size: 14px; color: #666;">
                    提交时间: ${submittedAt.toLocaleString()}
                </span>
                <button class="btn btn-sm btn-primary grade-homework-btn" data-homework-id="${homework.id}">批改</button>
            </div>
        `;
        
        // 添加批改按钮点击事件
        const gradeBtn = homeworkElement.querySelector('.grade-homework-btn');
        if (gradeBtn) {
            gradeBtn.addEventListener('click', () => {
                openGradeHomeworkModal(homework);
            });
        }
        
        pendingHomeworksItemsElement.appendChild(homeworkElement);
    });
}

// 加载已批改作业
async function loadGradedHomeworks() {
    console.log('开始加载已批改作业');
    
    // 从服务器获取已批改作业
    let gradedHomeworks = [];
    try {
        const response = await fetch('/graded-homeworks');
        if (response.ok) {
            gradedHomeworks = await response.json();
            console.log('获取到的已批改作业数据:', gradedHomeworks);
        }
    } catch (error) {
        console.error('获取已批改作业失败:', error);
    }
    
    // 获取已批改作业表格体
    const gradedHomeworksTableBody = document.getElementById('graded-homeworks-table-body');
    console.log('已批改作业表格体:', gradedHomeworksTableBody);
    
    if (!gradedHomeworksTableBody) {
        console.log('未找到已批改作业表格体');
        return;
    }
    
    // 清空已批改作业表格
    gradedHomeworksTableBody.innerHTML = '';
    
    // 如果没有已批改作业，显示提示信息
    if (gradedHomeworks.length === 0) {
        console.log('没有已批改作业');
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="3" style="text-align: center; color: #666; padding: 20px;">暂无已批改作业</td>`;
        gradedHomeworksTableBody.appendChild(emptyRow);
        return;
    }
    
    // 遍历已批改作业，添加到表格
    console.log('开始添加已批改作业到表格');
    gradedHomeworks.forEach(homework => {
        const row = document.createElement('tr');
        row.style = 'border-bottom: 1px solid #e9ecef;';
        row.innerHTML = `
            <td style="padding: 12px; color: #333;">${homework.studentName}</td>
            <td style="padding: 12px; color: #333;">${homework.title}</td>
            <td style="padding: 12px; color: #333;">${homework.grade}</td>
        `;
        
        gradedHomeworksTableBody.appendChild(row);
    });
    console.log('已批改作业表格加载完成');
}

// 打开批改作业模态框
function openGradeHomeworkModal(homework) {
    const modal = document.getElementById('grade-homework-modal');
    const titleElement = document.getElementById('grade-modal-homework-title');
    const contentElement = document.getElementById('grade-homework-content');
    const answerElement = document.getElementById('grade-homework-answer');
    const scoreElement = document.getElementById('homework-score');
    const feedbackElement = document.getElementById('homework-feedback');
    const gradeElements = document.getElementsByName('homework-grade');
    
    if (modal && titleElement && contentElement && answerElement && scoreElement && feedbackElement) {
        titleElement.textContent = `批改作业: ${homework.title} (${homework.student || '未知学生'})`;
        contentElement.textContent = homework.content;
        answerElement.textContent = homework.answer;
        scoreElement.value = homework.score || '';
        feedbackElement.value = homework.feedback || '';
        
        // 选择等级
        for (const element of gradeElements) {
            if (element.value === homework.grade) {
                element.checked = true;
                break;
            } else {
                element.checked = false;
            }
        }
        
        modal.style.display = 'block';
        
        // 存储当前作业ID
        modal.dataset.homeworkId = homework.id;
    }
}

// 关闭批改作业模态框
function closeGradeHomeworkModal() {
    const modal = document.getElementById('grade-homework-modal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('homework-score').value = '';
        document.getElementById('homework-feedback').value = '';
        delete modal.dataset.homeworkId;
    }
}

// 提交批改
async function submitGradeHomework() {
    const modal = document.getElementById('grade-homework-modal');
    const homeworkId = modal.dataset.homeworkId;
    const score = document.getElementById('homework-score').value;
    const feedback = document.getElementById('homework-feedback').value;
    const gradeElements = document.getElementsByName('homework-grade');
    let grade = '';
    for (const element of gradeElements) {
        if (element.checked) {
            grade = element.value;
            break;
        }
    }
    
    if (!homeworkId || !score) {
        alert('请输入评分');
        return;
    }
    
    try {
        // 从服务器获取所有作业
        const homeworks = await fetchHomeworks();
        
        // 找到当前作业
        const homeworkIndex = homeworks.findIndex(hw => hw.id == homeworkId);
        if (homeworkIndex === -1) {
            alert('作业不存在');
            return;
        }
        
        // 更新作业状态、评分、等级和评语
        homeworks[homeworkIndex].status = 'graded';
        homeworks[homeworkIndex].score = score;
        homeworks[homeworkIndex].grade = grade;
        homeworks[homeworkIndex].feedback = feedback;
        homeworks[homeworkIndex].gradedAt = new Date().toISOString();
        
        // 保存回服务器
        const response = await fetch(`/homeworks/${homeworkId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(homeworks[homeworkIndex])
        });
        
        if (!response.ok) {
            throw new Error('Failed to grade homework');
        }
        
        // 保存到批改作业文件
        const gradedHomework = {
            id: Date.now(),
            homeworkId: homeworkId,
            studentName: homeworks[homeworkIndex].student || homeworks[homeworkIndex].studentName,
            studentId: homeworks[homeworkIndex].studentId || 'unknown',
            title: homeworks[homeworkIndex].title,
            content: homeworks[homeworkIndex].content,
            score: score,
            grade: grade,
            feedback: feedback,
            gradedAt: new Date().toISOString(),
            submittedAt: homeworks[homeworkIndex].submittedAt
        };
        
        const gradeResponse = await fetch('/graded-homeworks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gradedHomework)
        });
        
        if (!gradeResponse.ok) {
            throw new Error('Failed to save graded homework');
        }
        
        // 保存到作业评价反馈文件
        console.log('准备保存到作业评价反馈文件');
        console.log('作业数据:', homeworks[homeworkIndex]);
        
        // 确保获取到正确的学生用户名
        const studentName = homeworks[homeworkIndex].student || homeworks[homeworkIndex].studentName || '未知学生';
        console.log('学生用户名:', studentName);
        
        const pigaiRecord = {
            id: Date.now(),
            homeworkId: homeworkId,
            studentName: studentName,
            student: studentName, // 同时保存到student字段，确保兼容性
            studentId: homeworks[homeworkIndex].studentId || 'unknown',
            title: homeworks[homeworkIndex].title,
            score: score,
            grade: grade,
            feedback: feedback,
            gradedAt: new Date().toISOString()
        };
        
        console.log('准备提交的pigai记录:', pigaiRecord);
        
        try {
            const pigaiResponse = await fetch('/pigai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pigaiRecord)
            });
            
            console.log('pigai API响应状态:', pigaiResponse.status);
            
            if (!pigaiResponse.ok) {
                const errorData = await pigaiResponse.json();
                console.error('保存pigai记录失败:', errorData);
                throw new Error('Failed to save pigai record: ' + JSON.stringify(errorData));
            }
            
            const responseData = await pigaiResponse.json();
            console.log('保存pigai记录成功:', responseData);
        } catch (error) {
            console.error('保存pigai记录时发生错误:', error);
            throw error;
        }
        
        // 关闭模态框
        closeGradeHomeworkModal();
        
        // 重新加载未批改作业列表和已批改作业列表
        await loadPendingHomeworks();
        await loadGradedHomeworks();
        
        // 更新教师端的未批改作业数量
        await updateTeacherDashboard();
        
        // 重新加载当前活跃的作业标签页
        const activeTab = document.querySelector('.homework-tabs .tab-btn.active');
        if (activeTab) {
            const tab = activeTab.getAttribute('data-tab');
            await switchHomeworkTab(tab);
        }
        
        // 显示成功提示
        alert('作业批改成功！');
    } catch (error) {
        console.error('Error grading homework:', error);
        alert('作业批改失败，请重试！');
    }
}

// 加载学生端作业列表
async function loadStudentHomeworks() {
    console.log('开始加载学生作业列表');
    
    // 从服务器获取作业
    const homeworks = await fetchHomeworks();
    console.log('获取到的作业数据:', homeworks);
    
    // 获取当前登录的学生用户名
    let studentUser = localStorage.getItem('username');
    // 如果localStorage中没有，使用全局变量
    if (!studentUser) {
        studentUser = currentUser;
    }
    console.log('当前登录的学生用户名:', studentUser);
    
    if (!studentUser) {
        console.log('未找到当前登录的学生用户名');
        return;
    }
    
    // 过滤出当前学生的作业和教师发布的作业模板
    // 学生提交的作业
    const studentSubmittedHomeworks = homeworks.filter(homework => homework.student === studentUser);
    // 教师发布的作业模板（没有学生提交的）
    const teacherHomeworks = homeworks.filter(homework => !homework.student && homework.status !== 'graded');
    
    // 合并并去重：如果学生已经提交了某个作业，就显示提交的版本，否则显示模板
    const studentHomeworks = [];
    const processedHomeworkTitles = new Set();
    
    // 先添加学生提交的作业
    studentSubmittedHomeworks.forEach(homework => {
        // 按作业标题去重，确保每个作业只显示一次
        if (!processedHomeworkTitles.has(homework.title)) {
            studentHomeworks.push(homework);
            processedHomeworkTitles.add(homework.title);
        }
    });
    
    // 再添加教师发布的作业模板（如果学生还没有提交）
    teacherHomeworks.forEach(homework => {
        if (!processedHomeworkTitles.has(homework.title)) {
            studentHomeworks.push(homework);
            processedHomeworkTitles.add(homework.title);
        }
    });
    console.log('过滤后的学生作业:', studentHomeworks);
    
    // 获取作业列表容器
    const homeworkItemsElement = document.getElementById('student-homework-items');
    console.log('作业列表容器:', homeworkItemsElement);
    
    if (!homeworkItemsElement) {
        console.log('未找到作业列表容器');
        return;
    }
    
    // 清空作业列表
    homeworkItemsElement.innerHTML = '';
    
    // 如果没有作业，显示提示信息
    if (studentHomeworks.length === 0) {
        console.log('没有作业');
        homeworkItemsElement.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">暂无作业</p>';
        return;
    }
    
    // 遍历作业，添加到列表
    console.log('开始添加作业到列表');
    studentHomeworks.forEach(homework => {
        const homeworkElement = document.createElement('div');
        homeworkElement.className = 'homework-item';
        homeworkElement.style = 'background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #4CAF50; cursor: pointer;';
        
        const deadline = new Date(homework.deadline);
        const now = new Date();
        const isOverdue = now > deadline;
        
        homeworkElement.innerHTML = `
            <h4 style="margin-top: 0; margin-bottom: 10px; color: #333;">${homework.title}</h4>
            <p style="margin-bottom: 10px; color: #555;">${homework.content}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <span style="font-size: 14px; color: ${isOverdue ? '#f44336' : '#666'};">
                    截止日期: ${deadline.toLocaleString()}
                </span>
                <span class="homework-status" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                    ${homework.status === 'pending' ? '待提交' : homework.status === 'submitted' ? '已提交' : '已批改'}
                </span>
            </div>
        `;
        
        // 添加点击事件
        homeworkElement.addEventListener('click', () => {
            openHomeworkDetailModal(homework);
        });
        
        homeworkItemsElement.appendChild(homeworkElement);
    });
    console.log('作业列表加载完成');
}



// 打开作业详情模态框
function openHomeworkDetailModal(homework) {
    const modal = document.getElementById('homework-detail-modal');
    const titleElement = document.getElementById('modal-homework-title');
    const answerElement = document.getElementById('homework-answer');
    const gradeInfoElement = document.getElementById('homework-grade-info');
    const scoreDisplayElement = document.getElementById('homework-score-display');
    const feedbackDisplayElement = document.getElementById('homework-feedback-display');
    const gradedAtElement = document.getElementById('homework-graded-at');
    const submitBtn = document.getElementById('submit-homework-btn');
    
    if (modal && titleElement && answerElement) {
        titleElement.textContent = homework.title;
        answerElement.value = homework.answer || '';
        modal.style.display = 'block';
        
        // 存储当前作业ID
        modal.dataset.homeworkId = homework.id;
        
        // 根据作业状态显示不同内容
        if (homework.status === 'graded' && gradeInfoElement) {
            // 显示教师批改信息
            gradeInfoElement.style.display = 'block';
            
            // 填充批改信息
            if (scoreDisplayElement) {
                scoreDisplayElement.textContent = homework.score || '未评分';
            }
            if (feedbackDisplayElement) {
                feedbackDisplayElement.textContent = homework.feedback || '无评语';
            }
            if (gradedAtElement && homework.gradedAt) {
                gradedAtElement.textContent = new Date(homework.gradedAt).toLocaleString();
            }
            if (document.getElementById('homework-grade-display')) {
                document.getElementById('homework-grade-display').textContent = homework.grade || '未评级';
            }
            
            // 禁用提交按钮
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '已批改';
            }
            
            // 禁用答案输入框
            answerElement.disabled = true;
        } else {
            // 隐藏教师批改信息
            if (gradeInfoElement) {
                gradeInfoElement.style.display = 'none';
            }
            
            // 启用提交按钮
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '提交作业';
            }
            
            // 启用答案输入框
            answerElement.disabled = false;
        }
    }
}

// 关闭作业详情模态框
function closeHomeworkDetailModal() {
    const modal = document.getElementById('homework-detail-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // 重置表单元素
        const answerElement = document.getElementById('homework-answer');
        if (answerElement) {
            answerElement.value = '';
            answerElement.disabled = false;
        }
        
        // 重置提交按钮
        const submitBtn = document.getElementById('submit-homework-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '提交作业';
        }
        
        // 隐藏批改信息
        const gradeInfoElement = document.getElementById('homework-grade-info');
        if (gradeInfoElement) {
            gradeInfoElement.style.display = 'none';
        }
        
        // 清除作业ID
        delete modal.dataset.homeworkId;
    }
}

// 提交作业
async function submitHomework() {
    const modal = document.getElementById('homework-detail-modal');
    const homeworkId = modal.dataset.homeworkId;
    const answer = document.getElementById('homework-answer').value;
    const submitBtn = document.getElementById('submit-homework-btn');
    
    if (!homeworkId || !answer) {
        alert('请输入作业答案');
        return;
    }
    
    // 立即禁用提交按钮，防止重复点击
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
    }
    
    try {
        // 获取当前登录的学生用户名
        const currentUser = localStorage.getItem('username');
        if (!currentUser) {
            alert('请先登录');
            return;
        }
        
        // 从服务器获取所有作业
        const homeworks = await fetchHomeworks();
        
        // 检查是否已经存在该学生对该作业的提交
        const existingSubmission = homeworks.find(hw => hw.id == homeworkId && hw.student === currentUser);
        
        if (existingSubmission) {
            // 更新现有提交
            existingSubmission.status = 'submitted';
            existingSubmission.answer = answer;
            existingSubmission.submittedAt = new Date().toISOString();
            
            // 保存回服务器
            const response = await fetch(`/homeworks/${existingSubmission.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(existingSubmission)
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit homework');
            }
        } else {
            // 创建新提交
            const originalHomework = homeworks.find(hw => hw.id == homeworkId);
            if (!originalHomework) {
                alert('作业不存在');
                return;
            }
            
            const newSubmission = {
                ...originalHomework,
                id: Date.now(),
                student: currentUser,
                status: 'submitted',
                answer: answer,
                submittedAt: new Date().toISOString()
            };
            
            // 保存到服务器
            const response = await fetch('/homeworks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSubmission)
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit homework');
            }
        }
        
        // 关闭模态框
        closeHomeworkDetailModal();
        
        // 重新加载作业列表
        await loadStudentHomeworks();
        
        // 显示成功提示
        alert('作业提交成功！');
    } catch (error) {
        console.error('Error submitting homework:', error);
        alert('作业提交失败，请重试！');
        // 重新启用提交按钮
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '提交作业';
        }
    }
}

// 初始化教师答案发布功能
function initTeacherAnswer() {
    const publishAnswerBtn = document.getElementById('publish-answer-btn');
    const answerModal = document.getElementById('answer-modal');
    const closeBtn = document.querySelector('#answer-modal .close');
    const cancelAnswerBtn = document.getElementById('cancel-answer-btn');
    const answerForm = document.getElementById('answer-form');
    
    if (publishAnswerBtn && answerModal) {
        // 打开模态框
        publishAnswerBtn.addEventListener('click', function() {
            answerModal.style.display = 'block';
        });
        
        // 关闭模态框
        function closeModal() {
            answerModal.style.display = 'none';
            answerForm.reset();
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        if (cancelAnswerBtn) {
            cancelAnswerBtn.addEventListener('click', closeModal);
        }
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(e) {
            if (e.target == answerModal) {
                closeModal();
            }
        });
        
        // 提交答案表单
        if (answerForm) {
            answerForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const answerUrl = document.getElementById('answer-url').value;
                
                if (!answerUrl) {
                    alert('请输入答案图片URL');
                    return;
                }
                
                // 创建答案对象
                const answerData = {
                    url: answerUrl,
                    timestamp: new Date().toISOString()
                };
                
                try {
                    // 发送到服务器
                    const response = await fetch('/teacher-answer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(answerData)
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to publish answer');
                    }
                    
                    // 显示成功提示
                    alert('答案发布成功！');
                    
                    // 关闭模态框
                    closeModal();
                } catch (error) {
                    console.error('Error publishing answer:', error);
                    alert('答案发布失败，请重试！');
                }
            });
        }
    }
}

// 初始化表单提交事件
function initForms() {
    // 加入班级表单
    const joinClassForm = document.getElementById('join-class-form');
    if (joinClassForm) {
        joinClassForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const classCode = document.getElementById('class-code').value;
            alert(`正在加入班级，班级码：${classCode}`);
        });
    }
    
    // 布置作业相关功能
    const assignHomeworkBtn = document.getElementById('assign-homework-btn');
    const homeworkModal = document.getElementById('homework-modal');
    const closeBtn = document.querySelector('.modal .close');
    const cancelHomeworkBtn = document.getElementById('cancel-homework-btn');
    const homeworkForm = document.getElementById('homework-form');
    
    if (assignHomeworkBtn && homeworkModal) {
        // 打开模态框
        assignHomeworkBtn.addEventListener('click', function() {
            homeworkModal.style.display = 'block';
        });
        
        // 关闭模态框
        function closeModal() {
            homeworkModal.style.display = 'none';
            homeworkForm.reset();
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        if (cancelHomeworkBtn) {
            cancelHomeworkBtn.addEventListener('click', closeModal);
        }
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(e) {
            if (e.target == homeworkModal) {
                closeModal();
            }
        });
        
        // 提交作业表单
        if (homeworkForm) {
            homeworkForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const title = document.getElementById('homework-title').value;
                const content = document.getElementById('homework-content').value;
                const deadline = document.getElementById('homework-deadline').value;
                
                // 创建作业对象
                const homework = {
                    id: Date.now(),
                    title: title,
                    content: content,
                    deadline: deadline,
                    assignedAt: new Date().toISOString(),
                    status: 'pending' // pending, submitted, graded
                };
                
                // 向服务器添加作业
                const result = await addHomework(homework);
                
                if (result) {
                    // 关闭模态框
                    closeModal();
                    
                    // 显示成功提示
                    alert('作业发布成功！');
                    
                    // 更新教师端的未批改作业数量
                    await updateTeacherDashboard();
                    
                    // 重新加载已发布标签页
                    const activeTab = document.querySelector('.homework-tabs .tab-btn.active');
                    if (activeTab) {
                        const tab = activeTab.getAttribute('data-tab');
                        await switchHomeworkTab(tab);
                    } else {
                        // 默认加载已发布标签页
                        await switchHomeworkTab('published');
                    }
                } else {
                    // 显示失败提示
                    alert('作业发布失败，请重试！');
                }
            });
        }
    }
    
    // 作业详情模态框事件监听
    const homeworkDetailModal = document.getElementById('homework-detail-modal');
    const closeDetailModalBtn = document.querySelector('#homework-detail-modal .close');
    const cancelHomeworkDetailBtn = document.getElementById('cancel-homework-detail-btn');
    const submitHomeworkBtn = document.getElementById('submit-homework-btn');
    
    if (homeworkDetailModal) {
        // 关闭按钮点击事件
        if (closeDetailModalBtn) {
            closeDetailModalBtn.addEventListener('click', closeHomeworkDetailModal);
        }
        
        // 取消按钮点击事件
        if (cancelHomeworkDetailBtn) {
            cancelHomeworkDetailBtn.addEventListener('click', closeHomeworkDetailModal);
        }
        
        // 提交按钮点击事件
        if (submitHomeworkBtn) {
            submitHomeworkBtn.addEventListener('click', submitHomework);
        }
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(e) {
            if (e.target == homeworkDetailModal) {
                closeHomeworkDetailModal();
            }
        });
    }
    
    // 教师端未批改作业事件监听
    const viewPendingHomeworksBtn = document.getElementById('view-pending-homeworks-btn');
    const pendingHomeworksList = document.getElementById('pending-homeworks-list');
    const gradedHomeworksList = document.getElementById('graded-homeworks-list');
    
    if (viewPendingHomeworksBtn && pendingHomeworksList && gradedHomeworksList) {
        viewPendingHomeworksBtn.addEventListener('click', async function() {
            // 切换未批改作业列表的显示状态
            if (pendingHomeworksList.style.display === 'none') {
                pendingHomeworksList.style.display = 'block';
                gradedHomeworksList.style.display = 'block';
                // 加载未批改作业列表和已批改作业列表
                await loadPendingHomeworks();
                await loadGradedHomeworks();
            } else {
                pendingHomeworksList.style.display = 'none';
                gradedHomeworksList.style.display = 'none';
            }
        });
    }
    
    // 批改作业模态框事件监听
    const gradeHomeworkModal = document.getElementById('grade-homework-modal');
    const closeGradeModalBtn = document.querySelector('#grade-homework-modal .close');
    const cancelGradeHomeworkBtn = document.getElementById('cancel-grade-homework-btn');
    const submitGradeHomeworkBtn = document.getElementById('submit-grade-homework-btn');
    
    if (gradeHomeworkModal) {
        // 关闭按钮点击事件
        if (closeGradeModalBtn) {
            closeGradeModalBtn.addEventListener('click', closeGradeHomeworkModal);
        }
        
        // 取消按钮点击事件
        if (cancelGradeHomeworkBtn) {
            cancelGradeHomeworkBtn.addEventListener('click', closeGradeHomeworkModal);
        }
        
        // 提交按钮点击事件
        if (submitGradeHomeworkBtn) {
            submitGradeHomeworkBtn.addEventListener('click', submitGradeHomework);
        }
        
        // 点击模态框外部关闭
        window.addEventListener('click', function(e) {
            if (e.target == gradeHomeworkModal) {
                closeGradeHomeworkModal();
            }
        });
    }
    
    // 创建班级表单
    const createClassForm = document.getElementById('create-class-form');
    if (createClassForm) {
        createClassForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const className = document.getElementById('class-name').value;
            alert(`班级创建成功：${className}`);
        });
    }
    
    // 创建课程表单
    const createCourseForm = document.getElementById('create-course-form');
    if (createCourseForm) {
        createCourseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const courseName = document.getElementById('course-name').value;
            alert(`课程创建成功：${courseName}`);
        });
    }
    
    // 发布作业表单
    const publishHomeworkForm = document.getElementById('publish-homework-form');
    if (publishHomeworkForm) {
        publishHomeworkForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const homeworkTitle = document.getElementById('homework-title').value;
            const homeworkContent = document.getElementById('homework-content').value;
            
            if (!homeworkTitle || !homeworkContent) {
                alert('请填写作业标题和内容');
                return;
            }
            
            try {
                // 创建作业对象
                const newHomework = {
                    id: Date.now(),
                    title: homeworkTitle,
                    content: homeworkContent,
                    status: 'published',
                    publishedAt: new Date().toISOString(),
                    author: 'teacher'
                };
                
                // 发送到服务器
                const response = await fetch('/teacher-homeworks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newHomework)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to publish homework');
                }
                
                // 显示成功提示
                alert(`作业发布成功：${homeworkTitle}`);
                
                // 重置表单
                publishHomeworkForm.reset();
                
                // 重新加载作业列表
                await loadTeacherHomeworks();
            } catch (error) {
                console.error('Error publishing homework:', error);
                alert('作业发布失败，请重试！');
            }
        });
    }
    
    // 创建互动任务表单
    const createTaskForm = document.getElementById('create-task-form');
    if (createTaskForm) {
        createTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const taskTitle = document.getElementById('task-title').value;
            alert(`互动任务发起成功：${taskTitle}`);
        });
    }
    
    // 反馈表单
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedbackContent = document.getElementById('feedback-content').value;
            alert('反馈提交成功！');
        });
    }
    

    
    // 操作要领分享表单
    const operationTipsForm = document.getElementById('operation-tips-form');
    if (operationTipsForm) {
        operationTipsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const tips = document.getElementById('operation-tips').value;
            const messageElement = document.getElementById('operation-tips-message');
            
            // 模拟提交成功
            messageElement.textContent = '操作要领分享成功！';
            messageElement.className = 'message success';
            
            // 3秒后清除消息
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }, 3000);
            
            // 重置表单
            operationTipsForm.reset();
        });
    }
    
    // 闭眼操作原因分享表单
    const blindOperationForm = document.getElementById('blind-operation-form');
    if (blindOperationForm) {
        blindOperationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const reason = document.getElementById('blind-operation-reason').value;
            const messageElement = document.getElementById('blind-operation-message');
            
            // 模拟提交成功
            messageElement.textContent = '闭眼操作原因分析分享成功！';
            messageElement.className = 'message success';
            
            // 3秒后清除消息
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'message';
            }, 3000);
            
            // 重置表单
            blindOperationForm.reset();
        });
    }
}

// 初始化标签页切换
function initTabs() {
    console.log('初始化标签页切换');
    // 使用事件委托，监听所有.tab-btn的点击事件
    document.addEventListener('click', async function(e) {
        console.log('点击事件:', e.target);
        const tabBtn = e.target.closest('.tab-btn');
        console.log('找到的tabBtn:', tabBtn);
        if (tabBtn) {
            console.log('点击了标签页:', tabBtn.getAttribute('data-tab'));
            const tab = tabBtn.getAttribute('data-tab');
            const parent = tabBtn.closest('.homework-tabs');
            
            // 移除所有标签页活动状态
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // 添加当前标签页活动状态
            tabBtn.classList.add('active');
            
            // 切换标签页内容
            await switchHomeworkTab(tab);
        }
    });
}

// 切换作业标签页
async function switchHomeworkTab(tab) {
    console.log('切换作业标签页:', tab);
    
    // 从服务器获取作业
    const homeworks = await fetchHomeworks();
    console.log('获取到的作业数据:', homeworks);
    
    // 获取作业列表容器
    const homeworkList = document.querySelector('.homework-list');
    console.log('作业列表容器:', homeworkList);
    if (!homeworkList) {
        console.log('未找到作业列表容器');
        return;
    }
    
    // 清空作业列表
    homeworkList.innerHTML = '';
    
    // 根据标签页类型过滤作业
    let filteredHomeworks = [];
    switch(tab) {
        case 'pending':
            // 待批改：学生提交的作业，状态为submitted
            filteredHomeworks = homeworks.filter(homework => homework.status === 'submitted');
            break;
        case 'published':
            // 已发布：教师发布的作业模板，没有student字段
            filteredHomeworks = homeworks.filter(homework => !homework.student && homework.status !== 'graded');
            break;
        case 'completed':
            // 已完成：教师批改过的作业，状态为graded
            filteredHomeworks = homeworks.filter(homework => homework.status === 'graded');
            break;
        default:
            filteredHomeworks = homeworks;
    }
    
    // 如果没有作业，显示提示信息
    if (filteredHomeworks.length === 0) {
        homeworkList.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">暂无作业</p>';
        return;
    }
    
    // 遍历作业，添加到列表
    filteredHomeworks.forEach(homework => {
        const homeworkElement = document.createElement('div');
        homeworkElement.className = 'homework-item';
        homeworkElement.style = 'display: flex; justify-content: space-between; align-items: flex-start; padding: 20px; border-bottom: 1px solid #f0f0f0; transition: all 0.3s ease;';
        
        const deadline = new Date(homework.deadline);
        const now = new Date();
        const isOverdue = now > deadline;
        
        // 构建作业信息
        let homeworkInfo = `
            <div class="homework-info">
                <h3 style="margin-top: 0; font-size: 18px; color: #333;">${homework.title}</h3>
                <p style="margin: 8px 0; font-size: 14px; color: #666;">发布时间：${new Date(homework.assignedAt).toLocaleString()}</p>
                <p style="margin: 8px 0; font-size: 14px; color: ${isOverdue ? '#f44336' : '#666'};">截止时间：${deadline.toLocaleString()}</p>
        `;
        
        // 如果是学生提交的作业，显示学生信息
        if (homework.student) {
            homeworkInfo += `
                <p style="margin: 8px 0; font-size: 14px; color: #666;">学生：${homework.student}</p>
            `;
        }
        
        // 如果是已批改的作业，显示等级和评分
        if (homework.status === 'graded') {
            homeworkInfo += `
                <p style="margin: 8px 0; font-size: 14px; color: #666;">等级：${homework.grade || '未评级'}</p>
                <p style="margin: 8px 0; font-size: 14px; color: #666;">评分：${homework.score || '未评分'}</p>
            `;
        }
        
        homeworkInfo += `
            </div>
            <div class="homework-actions" style="display: flex; flex-direction: column; gap: 10px;">
        `;
        
        // 根据作业状态添加操作按钮
        if (homework.status === 'submitted') {
            // 待批改作业
            homeworkInfo += `
                <button class="btn btn-sm btn-primary grade-homework-btn" data-homework-id="${homework.id}" style="padding: 8px 16px; border-radius: 6px;">批改</button>
                <button class="btn btn-sm btn-secondary view-homework-btn" data-homework-id="${homework.id}" style="padding: 8px 16px; border-radius: 6px;">查看详情</button>
            `;
        } else if (homework.status === 'graded') {
            // 已完成作业
            homeworkInfo += `
                <button class="btn btn-sm btn-primary" style="padding: 8px 16px; border-radius: 6px; background-color: #6c757d; border-color: #6c757d;">已批改</button>
                <button class="btn btn-sm btn-secondary view-homework-btn" data-homework-id="${homework.id}" style="padding: 8px 16px; border-radius: 6px;">查看详情</button>
            `;
        } else {
            // 已发布作业
            homeworkInfo += `
                <button class="btn btn-sm btn-primary view-homework-btn" data-homework-id="${homework.id}" style="padding: 8px 16px; border-radius: 6px;">查看详情</button>
                <button class="btn btn-sm btn-secondary edit-homework-btn" data-homework-id="${homework.id}" style="padding: 8px 16px; border-radius: 6px;">编辑</button>
            `;
        }
        
        homeworkInfo += `
            </div>
        `;
        
        homeworkElement.innerHTML = homeworkInfo;
        homeworkList.appendChild(homeworkElement);
    });
    
    // 添加批改按钮点击事件
    const gradeButtons = homeworkList.querySelectorAll('.grade-homework-btn');
    gradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const homeworkId = btn.getAttribute('data-homework-id');
            // 找到正确的作业对象，考虑ID重复的情况
            const homework = homeworks.find(hw => hw.id == homeworkId && hw.status === 'submitted');
            if (homework) {
                openGradeHomeworkModal(homework);
            } else {
                console.error('未找到待批改的作业:', homeworkId);
            }
        });
    });
    
    // 添加查看详情按钮点击事件
    const viewButtons = homeworkList.querySelectorAll('.view-homework-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const homeworkId = btn.getAttribute('data-homework-id');
            const homework = homeworks.find(hw => hw.id == homeworkId);
            if (homework) {
                openHomeworkDetailModal(homework);
            }
        });
    });
    
    // 添加编辑按钮点击事件
    const editButtons = homeworkList.querySelectorAll('.edit-homework-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const homeworkId = btn.getAttribute('data-homework-id');
            // 这里可以添加编辑作业的逻辑
            console.log('编辑作业:', homeworkId);
        });
    });
}

// 查看作业详情
function viewHomeworkDetails(homeworkId) {
    // 这里可以添加查看作业详情的逻辑
    console.log('查看作业详情:', homeworkId);
}

// 编辑作业
function editHomework(homeworkId) {
    // 这里可以添加编辑作业的逻辑
    console.log('编辑作业:', homeworkId);
}

// 资源按钮点击事件
function initResourceButtons() {
    const resourceButtons = document.querySelectorAll('.resource-item button');
    resourceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resourceItem = this.closest('.resource-item');
            const resourceName = resourceItem.querySelector('.resource-info h5').textContent;
            
            // 模拟资源点击效果
            alert(`正在打开资源：${resourceName}`);
        });
    });
}

// 教师操作按钮点击事件
function initTeacherActionButtons() {
    // 上传资料按钮
    const uploadButtons = document.querySelectorAll('.btn-primary');
    uploadButtons.forEach(button => {
        if (button.textContent.includes('上传')) {
            button.addEventListener('click', function() {
                alert('打开资源上传对话框');
            });
        }
    });
    
    // 查看进度按钮
    const progressButtons = document.querySelectorAll('.btn-secondary');
    progressButtons.forEach(button => {
        if (button.textContent.includes('查看')) {
            button.addEventListener('click', function() {
                alert('查看学生进度');
            });
        }
    });
    
    // 批改作业按钮
    const gradeButtons = document.querySelectorAll('.btn-primary');
    gradeButtons.forEach(button => {
        if (button.textContent.includes('批改')) {
            button.addEventListener('click', function() {
                alert('打开作业批改界面');
            });
        }
    });
    
    // 查看反馈按钮
    const feedbackButtons = document.querySelectorAll('.btn-primary');
    feedbackButtons.forEach(button => {
        if (button.textContent.includes('查看反馈')) {
            button.addEventListener('click', function() {
                alert('查看学生反馈');
            });
        }
    });
}

// 初始化通知功能
function initNotifications() {
    // 通知按钮点击事件
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('查看通知');
        });
    }
    
    // 消息按钮点击事件
    const messageBtn = document.getElementById('message-btn');
    if (messageBtn) {
        messageBtn.addEventListener('click', function() {
            alert('查看消息');
        });
    }
}

// 游戏分享功能
async function loadShareItems() {
    const shareItems = document.getElementById('share-items');
    if (!shareItems) return;
    
    try {
        // 从服务器获取分享数据
        const response = await fetch('game-shares');
        if (!response.ok) {
            throw new Error('Failed to fetch shares');
        }
        const shareData = await response.json();
        
        // 清空现有内容
        shareItems.innerHTML = '';
        
        // 显示分享数据
        if (shareData.length > 0) {
            // 按时间正序排列，最新的消息在最下方
            shareData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            shareData.forEach(data => {
                const shareItem = document.createElement('div');
                // 添加own类，如果是当前用户发送的消息
                shareItem.className = `share-item ${data.team === currentUser ? 'own' : ''}`;
                shareItem.innerHTML = `
                    <div class="share-header">
                        <span class="share-team">${data.team}</span>
                        <span class="share-time">${data.time}</span>
                    </div>
                    <div class="share-content">${data.content}</div>
                `;
                shareItems.appendChild(shareItem);
            });
        } else {
            // 显示空状态
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无分享信息';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#999';
            shareItems.appendChild(emptyMessage);
        }
    } catch (error) {
        console.error('Error loading shares:', error);
        // 加载失败时从localStorage获取作为备份
        const shareData = JSON.parse(localStorage.getItem('gameShares') || '[]');
        
        shareItems.innerHTML = '';
        
        if (shareData.length > 0) {
            // 按时间正序排列，最新的消息在最下方
            shareData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            shareData.forEach(data => {
                const shareItem = document.createElement('div');
                // 添加own类，如果是当前用户发送的消息
                shareItem.className = `share-item ${data.team === currentUser ? 'own' : ''}`;
                shareItem.innerHTML = `
                    <div class="share-header">
                        <span class="share-team">${data.team}</span>
                        <span class="share-time">${data.time}</span>
                    </div>
                    <div class="share-content">${data.content}</div>
                `;
                shareItems.appendChild(shareItem);
            });
        } else {
            // 显示空状态
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无分享信息';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#999';
            shareItems.appendChild(emptyMessage);
        }
    }
}

// 游戏分享功能
const shareBtn = document.getElementById('share-btn');
if (shareBtn) {
    // 页面加载时加载所有分享
    loadShareItems();
    
    shareBtn.addEventListener('click', async function() {
        const shareContent = document.getElementById('share-content');
        const shareItems = document.getElementById('share-items');
        
        if (!shareContent.value.trim()) {
            alert('请输入分享内容！');
            return;
        }
        
        if (!currentUser) {
            alert('请先登录！');
            return;
        }
        
        // 获取当前时间
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN');
        
        // 创建分享数据
        const shareData = {
            team: currentUser,
            content: shareContent.value,
            time: timeString,
            timestamp: now.toISOString()
        };
        
        try {
            // 发送到服务器
            const response = await fetch('game-shares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shareData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to sync share');
            }
            
            // 同时保存到localStorage作为备份
            let teacherShareData = JSON.parse(localStorage.getItem('teacherShareData') || '[]');
            teacherShareData.push(shareData);
            localStorage.setItem('teacherShareData', JSON.stringify(teacherShareData));
            
            // 重新加载所有分享
            loadShareItems();
            
            // 清空表单
            shareContent.value = '';
            
            // 提示成功
            alert('分享成功！');
            
            // 提示同步成功
            console.log('分享已同步到教师端');
        } catch (error) {
            console.error('Error syncing share:', error);
            alert('同步失败，请稍后重试！');
        }
    });
}

// 游戏得分功能
const updateScoreBtn = document.getElementById('update-score');
const syncManualScoreBtn = document.getElementById('sync-manual-score');

if (updateScoreBtn) {
    updateScoreBtn.addEventListener('click', function() {
        const scoreInput = document.getElementById('score-input');
        const manualCarScore = document.getElementById('manual-car-score');
        
        if (!scoreInput.value) {
            alert('请输入得分！');
            return;
        }
        
        const score = parseInt(scoreInput.value);
        manualCarScore.textContent = score;
        alert('手动控制小车得分已更新！');
        
        // 清空输入
        scoreInput.value = '';
    });
}

if (syncManualScoreBtn) {
    syncManualScoreBtn.addEventListener('click', async function() {
        const manualCarScore = document.getElementById('manual-car-score').textContent;
        
        // 获取当前登录的学生用户名
        const currentUser = localStorage.getItem('username') || window.currentUser;
        if (!currentUser) {
            alert('请先登录！');
            return;
        }
        
        // 创建新的得分记录
        const newRecord = {
            student: currentUser,
            score: manualCarScore,
            timestamp: new Date().toISOString()
        };
        
        try {
            // 发送到服务器
            const response = await fetch('game-scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRecord)
            });
            
            if (!response.ok) {
                throw new Error('Failed to sync score');
            }
            
            // 同时保存到localStorage作为备份
            let gameScoreRecords = JSON.parse(localStorage.getItem('gameScoreRecords') || '[]');
            gameScoreRecords.push(newRecord);
            localStorage.setItem('gameScoreRecords', JSON.stringify(gameScoreRecords));
            
            alert(`手动控制小车得分 ${manualCarScore} 已同步到教师端！`);
            console.log('游戏得分已同步到教师端:', newRecord);
        } catch (error) {
            console.error('Error syncing score:', error);
            alert('同步失败，请稍后重试！');
        }
    });
}

// 对比体验分享功能
async function loadComparisonShareItems() {
    const comparisonShareItems = document.querySelector('#student-page #student-comparison-share-items');
    if (!comparisonShareItems) return;
    
    // 显示加载状态
    comparisonShareItems.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">加载中...</p>';
    
    try {
        // 从服务器获取分享数据
        const response = await fetch('comparison-shares');
        if (!response.ok) {
            throw new Error('Failed to fetch shares');
        }
        const shareData = await response.json();
        
        // 清空现有内容
        comparisonShareItems.innerHTML = '';
        
        // 显示分享数据
        if (shareData.length > 0) {
            // 按时间正序排列，最新的消息在最下方
            shareData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            shareData.forEach(data => {
                const shareItem = document.createElement('div');
                shareItem.style = `
                    background-color: ${data.team === currentUser ? '#e8f5e8' : data.team === '教师' ? '#e3f2fd' : '#f3e5f5'};
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    max-width: 80%;
                    width: fit-content;
                    ${data.team === currentUser ? 'margin-left: auto;' : 'margin-right: auto;'}
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                `;
                
                const shareDate = new Date(data.timestamp || data.time);
                
                shareItem.innerHTML = `
                    <div style="display: flex; justify-content: ${data.team === currentUser ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 12px; font-weight: 600; color: ${data.team === currentUser ? '#388e3c' : data.team === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${data.team || data.student}</span>
                        <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
                `;
                
                comparisonShareItems.appendChild(shareItem);
            });
        } else {
            // 显示空状态
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无分享信息';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#999';
            comparisonShareItems.appendChild(emptyMessage);
        }
        
        // 滚动到底部
        comparisonShareItems.scrollTop = comparisonShareItems.scrollHeight;
    } catch (error) {
        console.error('Error loading shares:', error);
        // 加载失败时从localStorage获取作为备份
        const comparisonShareData = JSON.parse(localStorage.getItem('comparisonShareData') || '[]');
        
        comparisonShareItems.innerHTML = '';
        
        if (comparisonShareData.length > 0) {
            // 按时间倒序排列
            comparisonShareData.sort((a, b) => new Date(b.timestamp || b.time) - new Date(a.timestamp || b.time));
            
            comparisonShareData.forEach(data => {
                const shareItem = document.createElement('div');
                shareItem.style = `
                    background-color: ${data.team === currentUser ? '#e8f5e8' : data.team === '教师' ? '#e3f2fd' : '#f3e5f5'};
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    max-width: 80%;
                    width: fit-content;
                    ${data.team === currentUser ? 'margin-left: auto;' : 'margin-right: auto;'}
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                `;
                
                const shareDate = new Date(data.timestamp || data.time);
                
                shareItem.innerHTML = `
                    <div style="display: flex; justify-content: ${data.team === currentUser ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 12px; font-weight: 600; color: ${data.team === currentUser ? '#388e3c' : data.team === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${data.team || data.student}</span>
                        <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
                `;
                
                comparisonShareItems.appendChild(shareItem);
            });
        } else {
            // 显示空状态
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无分享信息';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#999';
            comparisonShareItems.appendChild(emptyMessage);
        }
        
        // 滚动到底部
        comparisonShareItems.scrollTop = comparisonShareItems.scrollHeight;
    }
}

// 学生端对比体验分享按钮
const studentComparisonShareBtn = document.querySelector('#student-page #student-comparison-share-btn');
if (studentComparisonShareBtn) {
    // 页面加载时加载所有分享
    loadComparisonShareItems();
    
    studentComparisonShareBtn.addEventListener('click', async function() {
        const comparisonShareContent = document.querySelector('#student-page #student-comparison-share-content');
        const comparisonShareItems = document.querySelector('#student-page #student-comparison-share-items');
        
        if (!comparisonShareContent.value.trim()) {
            alert('请输入分享内容！');
            return;
        }
        
        if (!currentUser) {
            alert('请先登录！');
            return;
        }
        
        // 获取当前时间
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN');
        
        // 创建分享数据
        const shareData = {
            team: currentUser,
            content: comparisonShareContent.value,
            time: timeString,
            timestamp: now.toISOString()
        };
        
        try {
            // 发送到服务器
            const response = await fetch('comparison-shares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shareData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to sync share');
            }
            
            // 同时保存到localStorage作为备份
            let comparisonShareData = JSON.parse(localStorage.getItem('comparisonShareData') || '[]');
            comparisonShareData.push(shareData);
            localStorage.setItem('comparisonShareData', JSON.stringify(comparisonShareData));
            
            // 重新加载所有分享
            loadComparisonShareItems();
            
            // 清空表单
            comparisonShareContent.value = '';
            
            // 提示成功
            alert('分享成功！');
            
            // 提示同步成功
            console.log('分享已同步到教师端');
        } catch (error) {
            console.error('Error syncing share:', error);
            alert('同步失败，请稍后重试！');
        }
    });
}

// 循迹小车控制表格表单提交
const trackingCarForm = document.getElementById('tracking-car-form');
if (trackingCarForm) {
    trackingCarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const command1 = document.querySelector('input[name="command1"]').value;
        const command2 = document.querySelector('input[name="command2"]').value;
        const command3 = document.querySelector('input[name="command3"]').value;
        
        if (!command1 || !command2 || !command3) {
            alert('请填写所有指令！');
            return;
        }
        
        if (!currentUser) {
            alert('请先登录！');
            return;
        }
        
        // 获取当前时间
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN');
        
        // 准备数据
        const trackingCarData = {
            team: currentUser,
            commands: {
                command1: command1,
                command2: command2,
                command3: command3
            },
            time: timeString
        };
        
        // 发送到服务器
        fetch('tracking-car-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackingCarData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('服务器响应失败');
            }
            return response.json();
        })
        .then(data => {
            console.log('服务器响应:', data);
            // 同时存储到localStorage作为备份
            let trackingCarFormData = JSON.parse(localStorage.getItem('trackingCarFormData') || '[]');
            trackingCarFormData.push(trackingCarData);
            localStorage.setItem('trackingCarFormData', JSON.stringify(trackingCarFormData));
            
            // 提示成功
            alert('提交成功！数据已同步到教师端');
            
            // 清空表单
            trackingCarForm.reset();
        })
        .catch(error => {
            console.error('提交失败:', error);
            // 如果服务器失败，仍然存储到localStorage
            let trackingCarFormData = JSON.parse(localStorage.getItem('trackingCarFormData') || '[]');
            trackingCarFormData.push(trackingCarData);
            localStorage.setItem('trackingCarFormData', JSON.stringify(trackingCarFormData));
            alert('提交成功！数据已保存到本地');
            
            // 清空表单
            trackingCarForm.reset();
        });
    });
}

// 教师端显示学生分享信息
const teacherShareItems = document.getElementById('teacher-share-items');
if (teacherShareItems) {
    // 从localStorage读取分享数据
    const teacherShareData = JSON.parse(localStorage.getItem('teacherShareData') || '[]');
    const comparisonShareData = JSON.parse(localStorage.getItem('comparisonShareData') || '[]');
    const trackingCarFormData = JSON.parse(localStorage.getItem('trackingCarFormData') || '[]');
    const principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
    
    // 合并所有分享数据
    const allShareData = [...teacherShareData, ...comparisonShareData, ...principleShareData];
    
    // 清空现有内容
    teacherShareItems.innerHTML = '';
    
    // 显示分享数据
    if (allShareData.length > 0) {
        // 按时间倒序排列
        allShareData.sort((a, b) => new Date(b.timestamp || b.time) - new Date(a.timestamp || a.time));
        
        allShareData.forEach(data => {
            const shareItem = document.createElement('div');
            shareItem.className = 'share-item';
            shareItem.innerHTML = `
                <div class="share-header">
                    <span class="share-team">${data.team}</span>
                    <span class="share-time">${data.time}</span>
                </div>
                <div class="share-content">${data.content}</div>
            `;
            teacherShareItems.appendChild(shareItem);
        });
    } else {
        // 显示空状态
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '暂无学生分享信息';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        emptyMessage.style.color = '#999';
        teacherShareItems.appendChild(emptyMessage);
    }
    
    // 显示循迹小车表格数据
    if (trackingCarFormData.length > 0) {
        trackingCarFormData.forEach(data => {
            const formItem = document.createElement('div');
            formItem.className = 'share-item';
            formItem.innerHTML = `
                <div class="share-header">
                    <span class="share-team">${data.team}</span>
                    <span class="share-time">${data.time}</span>
                </div>
                <div class="share-content">
                    <h4>循迹小车控制逻辑表</h4>
                    <p>正在线上：${data.commands.command1}</p>
                    <p>车身偏右：${data.commands.command2}</p>
                    <p>车身偏左：${data.commands.command3}</p>
                </div>
            `;
            teacherShareItems.appendChild(formItem);
        });
    }
}

// 原理升华分享功能
function loadPrincipleShareItems() {
    const principleShareItems = document.getElementById('principle-share-items');
    if (!principleShareItems) return;
    
    // 从localStorage读取分享数据
    const principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
    
    // 清空现有内容
    principleShareItems.innerHTML = '';
    
    // 显示分享数据
    if (principleShareData.length > 0) {
        // 按时间倒序排列
        principleShareData.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        principleShareData.forEach(data => {
            const shareItem = document.createElement('div');
            // 添加own类，如果是当前用户发送的消息
            shareItem.className = `share-item ${data.team === currentUser ? 'own' : ''}`;
            shareItem.innerHTML = `
                <div class="share-header">
                    <span class="share-team">${data.team}</span>
                    <span class="share-time">${data.time}</span>
                </div>
                <div class="share-content">${data.content}</div>
            `;
            principleShareItems.appendChild(shareItem);
        });
    } else {
        // 显示空状态
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '暂无分享信息';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        emptyMessage.style.color = '#999';
        principleShareItems.appendChild(emptyMessage);
    }
}

// 原理升华分享按钮
const principleShareBtn = document.getElementById('principle-share-btn');
if (principleShareBtn) {
    // 页面加载时加载所有分享
    loadPrincipleShareItems();
    
    // 每5秒自动刷新一次分享内容
    setInterval(loadPrincipleShareItems, 5000);
    
    principleShareBtn.addEventListener('click', async function() {
        const principleShareContent = document.getElementById('principle-share-content');
        const principleShareItems = document.getElementById('principle-share-items');
        
        if (!principleShareContent.value.trim()) {
            alert('请输入分享内容！');
            return;
        }
        
        if (!currentUser) {
            alert('请先登录！');
            return;
        }
        
        // 获取当前时间
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN');
        
        // 创建分享数据
        const shareData = {
            team: currentUser,
            content: principleShareContent.value,
            time: timeString,
            timestamp: now.toISOString()
        };
        
        try {
            // 发送到服务器
            const response = await fetch('/principle-shares', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shareData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to sync share');
            }
            
            // 同时保存到localStorage作为备份
            let principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
            principleShareData.push(shareData);
            localStorage.setItem('principleShareData', JSON.stringify(principleShareData));
            
            // 重新加载所有分享
            loadPrincipleShareItems();
            
            // 清空表单
            principleShareContent.value = '';
            
            // 提示成功
            alert('分享成功！');
            
            // 提示同步成功
            console.log('分享已同步到教师端');
        } catch (error) {
            console.error('Error syncing share:', error);
            // 如果服务器失败，仍然存储到localStorage
            let principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
            principleShareData.push(shareData);
            localStorage.setItem('principleShareData', JSON.stringify(principleShareData));
            
            // 重新加载所有分享
            loadPrincipleShareItems();
            
            // 清空表单
            principleShareContent.value = '';
            
            // 提示成功
            alert('分享成功！数据已保存到本地');
        }
    });
}

// 教师端原理升华分享功能
async function initTeacherPrincipleShare() {
    const teacherPrincipleShareBtn = document.querySelector('#teacher-page #teacher-principle-share-btn');
    if (!teacherPrincipleShareBtn) return;
    
    // 移除现有的事件监听器，避免重复绑定
    teacherPrincipleShareBtn.removeEventListener('click', handleTeacherPrincipleShare);
    
    // 初始加载分享内容
    loadTeacherPrincipleShareItems();
    
    // 每5秒自动刷新一次分享内容
    setInterval(loadTeacherPrincipleShareItems, 5000);
    
    teacherPrincipleShareBtn.addEventListener('click', handleTeacherPrincipleShare);
}

// 教师端原理升华页面消息发送处理函数
async function handleTeacherPrincipleShare() {
    const teacherPrincipleShareContent = document.querySelector('#teacher-page #teacher-principle-share-content');
    if (!teacherPrincipleShareContent) return;
    
    const content = teacherPrincipleShareContent.value.trim();
    if (!content) {
        alert('请输入信息内容');
        return;
    }
    
    // 禁用按钮，防止重复点击
    const teacherPrincipleShareBtn = document.querySelector('#teacher-page #teacher-principle-share-btn');
    if (teacherPrincipleShareBtn) {
        teacherPrincipleShareBtn.disabled = true;
        teacherPrincipleShareBtn.textContent = '发送中...';
    }
    
    // 获取当前时间
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN');
    
    // 创建分享数据
    const newShare = {
        team: '教师',
        content: content,
        time: timeString,
        timestamp: now.toISOString()
    };
    
    try {
        // 发送到服务器
        const response = await fetch('/principle-shares', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShare)
        });
        
        if (!response.ok) {
            throw new Error('Failed to sync share');
        }
        
        // 同时保存到localStorage作为备份
        let principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
        principleShareData.push(newShare);
        localStorage.setItem('principleShareData', JSON.stringify(principleShareData));
        
        // 清空输入框
        teacherPrincipleShareContent.value = '';
        
        // 重新加载分享内容
        loadTeacherPrincipleShareItems();
        
        // 显示成功提示
        alert('信息发送成功！');
    } catch (error) {
        console.error('Error syncing share:', error);
        // 如果服务器失败，仍然存储到localStorage
        let principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
        principleShareData.push(newShare);
        localStorage.setItem('principleShareData', JSON.stringify(principleShareData));
        
        // 清空输入框
        teacherPrincipleShareContent.value = '';
        
        // 重新加载分享内容
        loadTeacherPrincipleShareItems();
        
        // 显示成功提示
        alert('信息发送成功！数据已保存到本地');
    } finally {
        // 重新启用按钮
        if (teacherPrincipleShareBtn) {
            teacherPrincipleShareBtn.disabled = false;
            teacherPrincipleShareBtn.textContent = '发送';
        }
    }
}



// 加载教师端原理升华页面的分享内容
async function loadTeacherPrincipleShareItems() {
    const principleShareItems = document.querySelector('#teacher-page #teacher-principle-share-items');
    if (!principleShareItems) {
        console.error('teacher-principle-share-items element not found in teacher page');
        return;
    }
    
    // 显示加载状态
    principleShareItems.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">加载中...</p>';
    
    try {
        // 从服务器获取分享数据
        const response = await fetch('/principle-shares');
        
        if (response.ok) {
            const shareData = await response.json();
            
            // 清空现有内容
            principleShareItems.innerHTML = '';
            
            // 显示分享数据
            if (shareData.length > 0) {
                // 按时间正序排列，最新的消息在最下方
                shareData.sort((a, b) => new Date(a.timestamp || b.time) - new Date(b.timestamp || b.time));
                
                shareData.forEach(data => {
                    const shareItem = document.createElement('div');
                    // 处理乱码问题
                    const teamName = data.team === '鏁欏笀' ? '教师' : data.team;
                    shareItem.style = `
                        background-color: ${teamName === '教师' ? '#e3f2fd' : '#f3e5f5'};
                        border-radius: 12px;
                        padding: 12px 16px;
                        margin-bottom: 12px;
                        max-width: 80%;
                        width: fit-content;
                        ${teamName === '教师' ? 'margin-left: auto;' : 'margin-right: auto;'}
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    `;
                    
                    const shareDate = new Date(data.timestamp || data.time);
                    
                    shareItem.innerHTML = `
                        <div style="display: flex; justify-content: ${teamName === '教师' ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 12px; font-weight: 600; color: ${teamName === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${teamName || data.student}</span>
                            <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                        </div>
                        <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
                    `;
                    
                    principleShareItems.appendChild(shareItem);
                });
            } else {
                // 显示空状态
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = '暂无分享信息';
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.padding = '20px';
                emptyMessage.style.color = '#999';
                principleShareItems.appendChild(emptyMessage);
            }
            
            // 保存到本地存储
            localStorage.setItem('principleShareData', JSON.stringify(shareData));
            
            // 滚动到底部
            principleShareItems.scrollTop = principleShareItems.scrollHeight;
            return;
        }
    } catch (error) {
        console.error('Error loading from server:', error);
    }
    
    // 加载失败时从localStorage获取作为备份
    const principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
    
    principleShareItems.innerHTML = '';
    
    if (principleShareData.length > 0) {
        // 按时间正序排列，最新的消息在最下方
        principleShareData.sort((a, b) => new Date(a.timestamp || b.time) - new Date(b.timestamp || b.time));
        
        principleShareData.forEach(data => {
            const shareItem = document.createElement('div');
            // 处理乱码问题
            const teamName = data.team === '鏁欏笀' ? '教师' : data.team;
            shareItem.style = `
                background-color: ${teamName === '教师' ? '#e3f2fd' : '#f3e5f5'};
                border-radius: 12px;
                padding: 12px 16px;
                margin-bottom: 12px;
                max-width: 80%;
                width: fit-content;
                ${teamName === '教师' ? 'margin-left: auto;' : 'margin-right: auto;'}
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            `;
            
            const shareDate = new Date(data.timestamp || data.time);
            
            shareItem.innerHTML = `
                <div style="display: flex; justify-content: ${teamName === '教师' ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; color: ${teamName === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${teamName || data.student}</span>
                    <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                </div>
                <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
            `;
            
            principleShareItems.appendChild(shareItem);
        });
    } else {
        // 显示空状态
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '暂无分享信息';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        emptyMessage.style.color = '#999';
        principleShareItems.appendChild(emptyMessage);
    }
    
    // 滚动到底部
    principleShareItems.scrollTop = principleShareItems.scrollHeight;
}

// 加载学生端原理升华分享内容
async function loadPrincipleShareItems() {
    const principleShareItems = document.getElementById('principle-share-items');
    if (!principleShareItems) return;
    
    try {
        // 从服务器获取分享数据
        const response = await fetch('/principle-shares');
        if (!response.ok) {
            throw new Error('Failed to fetch shares');
        }
        const shareData = await response.json();
        
        // 清空现有内容
        principleShareItems.innerHTML = '';
        
        // 显示分享数据
        if (shareData.length > 0) {
            // 按时间正序排列，最新的消息在最下方
            shareData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            shareData.forEach(data => {
                const shareItem = document.createElement('div');
                shareItem.style = `
                    background-color: ${data.team === currentUser ? '#e8f5e8' : data.team === '教师' ? '#e3f2fd' : '#f3e5f5'};
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    max-width: 80%;
                    width: fit-content;
                    ${data.team === currentUser ? 'margin-left: auto;' : 'margin-right: auto;'}
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                `;
                
                const shareDate = new Date(data.timestamp || data.time);
                
                shareItem.innerHTML = `
                    <div style="display: flex; justify-content: ${data.team === currentUser ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 12px; font-weight: 600; color: ${data.team === currentUser ? '#388e3c' : data.team === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${data.team || data.student}</span>
                        <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
                `;
                
                principleShareItems.appendChild(shareItem);
            });
        } else {
            // 显示空状态
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无分享信息';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#999';
            principleShareItems.appendChild(emptyMessage);
        }
        
        // 滚动到底部
        principleShareItems.scrollTop = principleShareItems.scrollHeight;
    } catch (error) {
        console.error('Error loading shares:', error);
        // 加载失败时从localStorage获取作为备份
        const principleShareData = JSON.parse(localStorage.getItem('principleShareData') || '[]');
        
        principleShareItems.innerHTML = '';
        
        if (principleShareData.length > 0) {
            // 按时间正序排列，最新的消息在最下方
            principleShareData.sort((a, b) => new Date(a.timestamp || b.time) - new Date(b.timestamp || b.time));
            
            principleShareData.forEach(data => {
                const shareItem = document.createElement('div');
                shareItem.style = `
                    background-color: ${data.team === currentUser ? '#e8f5e8' : data.team === '教师' ? '#e3f2fd' : '#f3e5f5'};
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    max-width: 80%;
                    width: fit-content;
                    ${data.team === currentUser ? 'margin-left: auto;' : 'margin-right: auto;'}
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                `;
                
                const shareDate = new Date(data.timestamp || data.time);
                
                shareItem.innerHTML = `
                    <div style="display: flex; justify-content: ${data.team === currentUser ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 12px; font-weight: 600; color: ${data.team === currentUser ? '#388e3c' : data.team === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${data.team || data.student}</span>
                        <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
                `;
                
                principleShareItems.appendChild(shareItem);
            });
        } else {
            // 显示空状态
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无分享信息';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.color = '#999';
            principleShareItems.appendChild(emptyMessage);
        }
        
        // 滚动到底部
        principleShareItems.scrollTop = principleShareItems.scrollHeight;
    }
}











// 教师端对比体验页面消息发送功能
async function initTeacherComparisonShare() {
    const teacherComparisonShareBtn = document.querySelector('#teacher-page #teacher-comparison-share-btn');
    if (!teacherComparisonShareBtn) return;
    
    // 移除现有的事件监听器，避免重复绑定
    teacherComparisonShareBtn.removeEventListener('click', handleTeacherComparisonShare);
    
    // 添加新的事件监听器
    teacherComparisonShareBtn.addEventListener('click', handleTeacherComparisonShare);
    
    // 初始加载分享内容
    loadTeacherComparisonShareItems();
}

// 教师端对比体验页面消息发送处理函数
async function handleTeacherComparisonShare() {
    const teacherComparisonShareContent = document.querySelector('#teacher-page #teacher-comparison-share-content');
    if (!teacherComparisonShareContent) return;
    
    const content = teacherComparisonShareContent.value.trim();
    if (!content) {
        alert('请输入信息内容');
        return;
    }
    
    // 禁用按钮，防止重复点击
    const teacherComparisonShareBtn = document.querySelector('#teacher-page #teacher-comparison-share-btn');
    if (teacherComparisonShareBtn) {
        teacherComparisonShareBtn.disabled = true;
        teacherComparisonShareBtn.textContent = '发送中...';
    }
    
    // 获取当前时间
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN');
    
    // 创建分享数据
    const newShare = {
        team: '教师',
        content: content,
        time: timeString,
        timestamp: now.toISOString()
    };
    
    try {
        // 发送到服务器
        console.log('Sending share to server:', newShare);
        const response = await fetch('comparison-shares', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newShare)
        });
        
        if (!response.ok) {
            throw new Error('Failed to sync share');
        }
        
        // 同时保存到localStorage作为备份
        let comparisonShareData = JSON.parse(localStorage.getItem('comparisonShareData') || '[]');
        comparisonShareData.push(newShare);
        localStorage.setItem('comparisonShareData', JSON.stringify(comparisonShareData));
        
        // 清空输入框
        teacherComparisonShareContent.value = '';
        
        // 重新加载分享内容
        loadTeacherComparisonShareItems();
        
        // 显示成功提示
        alert('信息发送成功！');
    } catch (error) {
        console.error('Error syncing share:', error);
        alert('同步失败，请稍后重试！');
    } finally {
        // 重新启用按钮
        if (teacherComparisonShareBtn) {
            teacherComparisonShareBtn.disabled = false;
            teacherComparisonShareBtn.textContent = '发送';
        }
    }
}

// 加载教师端对比体验页面的分享内容
async function loadTeacherComparisonShareItems() {
    const comparisonShareItems = document.querySelector('#teacher-page #teacher-comparison-share-items');
    if (!comparisonShareItems) {
        console.error('teacher-comparison-share-items element not found in teacher page');
        return;
    }
    
    // 显示加载状态
    comparisonShareItems.innerHTML = '<p style="text-align: center; color: #666; margin: 20px 0;">加载中...</p>';
    
    try {
        // 从服务器获取分享数据
        console.log('Attempting to load from server');
        const response = await fetch('comparison-shares');
        console.log('Response status:', response.status);
        
        if (response.ok) {
            console.log('Response is ok, parsing JSON');
            const shareData = await response.json();
            console.log('Share data loaded:', shareData.length, 'items');
            
            // 清空现有内容
            comparisonShareItems.innerHTML = '';
            
            // 显示分享数据
            if (shareData.length > 0) {
                // 按时间正序排列，最新的消息在最下方
                shareData.sort((a, b) => new Date(a.timestamp || b.time) - new Date(b.timestamp || b.time));
                
                console.log('Displaying share data');
                shareData.forEach(data => {
                    const shareItem = document.createElement('div');
                    // 处理乱码问题，将乱码的"鏁欏笀"转换为"教师"，"灏忕粍"转换为"小组"
                    const teamName = data.team === '鏁欏笀' ? '教师' : data.team === '灏忕粍1' ? '小组1' : data.team;
                    shareItem.style = `
                        background-color: ${teamName === '教师' ? '#e3f2fd' : '#f3e5f5'};
                        border-radius: 12px;
                        padding: 12px 16px;
                        margin-bottom: 12px;
                        max-width: 80%;
                        width: fit-content;
                        ${teamName === '教师' ? 'margin-left: auto;' : 'margin-right: auto;'}
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    `;
                    
                    const shareDate = new Date(data.timestamp || data.time);
                    
                    shareItem.innerHTML = `
                        <div style="display: flex; justify-content: ${teamName === '教师' ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 12px; font-weight: 600; color: ${teamName === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${teamName || data.student}</span>
                            <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                        </div>
                        <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
                    `;
                    
                    comparisonShareItems.appendChild(shareItem);
                });
            } else {
                // 显示空状态
                console.log('No share data found');
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = '暂无分享信息';
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.padding = '20px';
                emptyMessage.style.color = '#999';
                comparisonShareItems.appendChild(emptyMessage);
            }
            
            // 保存到本地存储
            localStorage.setItem('comparisonShareData', JSON.stringify(shareData));
            console.log('Share data saved to localStorage');
            
            // 滚动到底部
            comparisonShareItems.scrollTop = comparisonShareItems.scrollHeight;
            console.log('Scrolling to bottom');
            return;
        }
    } catch (error) {
        console.error('Error loading from server:', error);
    }
    
    try {
        // 尝试直接加载comparison_shares.json文件
        console.log('Attempting to load comparison_shares.json');
        const response = await fetch('comparison_shares.json');
        console.log('Response status:', response.status);
        
        if (response.ok) {
            console.log('Response is ok, parsing JSON');
            const shareData = await response.json();
            console.log('Share data loaded:', shareData.length, 'items');
            
            // 清空现有内容
            comparisonShareItems.innerHTML = '';
            
            // 显示分享数据
            if (shareData.length > 0) {
                // 按时间正序排列，最新的消息在最下方
                shareData.sort((a, b) => new Date(a.timestamp || b.time) - new Date(b.timestamp || b.time));
                
                console.log('Displaying share data');
                shareData.forEach(data => {
                    const shareItem = document.createElement('div');
                    // 处理乱码问题，将乱码的"鏁欏笀"转换为"教师"，"灏忕粍"转换为"小组"
                    const teamName = data.team === '鏁欏笀' ? '教师' : data.team === '灏忕粍1' ? '小组1' : data.team;
                    shareItem.style = `
                        background-color: ${teamName === '教师' ? '#e3f2fd' : '#f3e5f5'};
                        border-radius: 12px;
                        padding: 12px 16px;
                        margin-bottom: 12px;
                        max-width: 80%;
                        width: fit-content;
                        ${teamName === '教师' ? 'margin-left: auto;' : 'margin-right: auto;'}
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    `;
                    
                    const shareDate = new Date(data.timestamp || data.time);
                    
                    shareItem.innerHTML = `
                        <div style="display: flex; justify-content: ${teamName === '教师' ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                            <span style="font-size: 12px; font-weight: 600; color: ${teamName === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${teamName || data.student}</span>
                            <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                        </div>
                        <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
                    `;
                    
                    comparisonShareItems.appendChild(shareItem);
                });
            } else {
                // 显示空状态
                console.log('No share data found');
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = '暂无分享信息';
                emptyMessage.style.textAlign = 'center';
                emptyMessage.style.padding = '20px';
                emptyMessage.style.color = '#999';
                comparisonShareItems.appendChild(emptyMessage);
            }
            
            // 保存到本地存储
            localStorage.setItem('comparisonShareData', JSON.stringify(shareData));
            console.log('Share data saved to localStorage');
            
            // 滚动到底部
            comparisonShareItems.scrollTop = comparisonShareItems.scrollHeight;
            console.log('Scrolling to bottom');
            return;
        }
    } catch (error) {
        console.error('Error loading comparison_shares.json:', error);
    }
    
    // 加载失败时从localStorage获取作为备份
    console.log('Attempting to load from localStorage');
    const comparisonShareData = JSON.parse(localStorage.getItem('comparisonShareData') || '[]');
    console.log('LocalStorage data:', comparisonShareData.length, 'items');
    
    comparisonShareItems.innerHTML = '';
    
    if (comparisonShareData.length > 0) {
        // 按时间倒序排列
        comparisonShareData.sort((a, b) => new Date(b.timestamp || b.time) - new Date(a.timestamp || b.time));
        
        console.log('Displaying data from localStorage');
        comparisonShareData.forEach(data => {
                const shareItem = document.createElement('div');
                // 处理乱码问题，将乱码的"鏁欏笀"转换为"教师"，"灏忕粍"转换为"小组"
                const teamName = data.team === '鏁欏笀' ? '教师' : data.team === '灏忕粍1' ? '小组1' : data.team;
                shareItem.style = `
                    background-color: ${teamName === '教师' ? '#e3f2fd' : '#f3e5f5'};
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    max-width: 80%;
                    width: fit-content;
                    ${teamName === '教师' ? 'margin-left: auto;' : 'margin-right: auto;'}
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                `;
            
            const shareDate = new Date(data.timestamp || data.time);
            
            shareItem.innerHTML = `
                <div style="display: flex; justify-content: ${teamName === '教师' ? 'flex-end' : 'flex-start'}; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; color: ${teamName === '教师' ? '#1976d2' : '#7b1fa2'}; margin-right: 8px;">${teamName || data.student}</span>
                    <span style="font-size: 10px; color: #999;">${shareDate.toLocaleString()}</span>
                </div>
                <div style="font-size: 14px; line-height: 1.4; color: #333;">${data.content}</div>
            `;
            
            comparisonShareItems.appendChild(shareItem);
        });
    } else {
        // 显示空状态
        console.log('No data found in localStorage');
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '暂无分享信息';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        emptyMessage.style.color = '#999';
        comparisonShareItems.appendChild(emptyMessage);
    }
    
    // 滚动到底部
    comparisonShareItems.scrollTop = comparisonShareItems.scrollHeight;
    console.log('Scrolling to bottom');
}

// 获取教师答案
async function getTeacherAnswer() {
    try {
        const response = await fetch('/teacher-answer');
        if (!response.ok) {
            throw new Error('Failed to fetch teacher answer');
        }
        const answer = await response.json();
        return answer;
    } catch (error) {
        console.error('Error fetching teacher answer:', error);
        return null;
    }
}

// 显示教师答案
async function displayTeacherAnswer() {
    const teacherAnswer = await getTeacherAnswer();
    const answerContainer = document.getElementById('teacher-answer');
    const answerImage = document.getElementById('teacher-answer-image');
    
    if (teacherAnswer && teacherAnswer.url && answerContainer && answerImage) {
        answerImage.src = teacherAnswer.url;
        answerContainer.style.display = 'block';
    }
}

// 显示/隐藏闭环方框图
function toggleDiagram() {
    const container = document.getElementById('diagramContainer');
    const button = document.getElementById('toggleDiagramBtn');
    
    if (container.style.display === 'none') {
        container.style.display = 'flex';
        button.textContent = '隐藏闭环控制系统方框图';
    } else {
        container.style.display = 'none';
        button.textContent = '闭环控制系统方框图';
    }
}

// 加载学生提交的循迹小车逻辑表数据
function loadStudentTrackingData() {
    const studentTrackingData = document.getElementById('student-tracking-data');
    if (!studentTrackingData) {
        console.error('student-tracking-data element not found');
        return;
    }
    
    // 从服务器获取数据
    fetch('tracking-car-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('服务器响应失败');
            }
            return response.json();
        })
        .then(trackingCarFormData => {
            console.log('Tracking car form data from server:', trackingCarFormData);
            
            // 清空现有内容
            studentTrackingData.innerHTML = '';
            
            // 显示学生提交的数据
            if (trackingCarFormData.length > 0) {
                console.log('Displaying tracking car data');
                trackingCarFormData.forEach(data => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.team}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.time}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command1}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command2}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command3}</td>
                    `;
                    studentTrackingData.appendChild(row);
                });
            } else {
                // 显示空状态
                console.log('No tracking car data found from server');
                // 尝试从localStorage读取作为备份
                const localData = JSON.parse(localStorage.getItem('trackingCarFormData') || '[]');
                if (localData.length > 0) {
                    console.log('Displaying tracking car data from localStorage');
                    localData.forEach(data => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.team}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.time}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command1}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command2}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command3}</td>
                        `;
                        studentTrackingData.appendChild(row);
                    });
                } else {
                    const emptyRow = document.createElement('tr');
                    emptyRow.innerHTML = `
                        <td colspan="5" style="border: 1px solid #ddd; padding: 20px; text-align: center; color: #999;">暂无学生提交数据</td>
                    `;
                    studentTrackingData.appendChild(emptyRow);
                }
            }
        })
        .catch(error => {
            console.error('获取数据失败:', error);
            // 尝试从localStorage读取作为备份
            const localData = JSON.parse(localStorage.getItem('trackingCarFormData') || '[]');
            
            // 清空现有内容
            studentTrackingData.innerHTML = '';
            
            if (localData.length > 0) {
                console.log('Displaying tracking car data from localStorage');
                localData.forEach(data => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.team}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.time}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command1}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command2}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.commands.command3}</td>
                    `;
                    studentTrackingData.appendChild(row);
                });
            } else {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `
                    <td colspan="5" style="border: 1px solid #ddd; padding: 20px; text-align: center; color: #999;">暂无学生提交数据</td>
                `;
                studentTrackingData.appendChild(emptyRow);
            }
        });
}

// 加载学生提交的系统建模答案
function loadStudentModelingData() {
    const studentModelingData = document.getElementById('student-modeling-data');
    if (!studentModelingData) return;
    
    // 清空现有内容
    studentModelingData.innerHTML = '';
    
    // 从服务器获取系统建模数据
    fetch('modeling-data')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('获取数据失败:', data.error);
                // 从localStorage读取作为备份
                loadModelingDataFromLocalStorage();
            } else {
                // 显示学生提交的数据
                if (data.length > 0) {
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.team || '未知'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.time || new Date(item.timestamp).toLocaleString('zh-CN')}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.detector || '未填写'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.controller || '未填写'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.executor || '未填写'}</td>
                            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.object || '未填写'}</td>
                        `;
                        studentModelingData.appendChild(row);
                    });
                } else {
                    // 显示空状态
                    const emptyRow = document.createElement('tr');
                    emptyRow.innerHTML = `
                        <td colspan="6" style="border: 1px solid #ddd; padding: 20px; text-align: center; color: #999;">暂无学生提交数据</td>
                    `;
                    studentModelingData.appendChild(emptyRow);
                }
            }
        })
        .catch(error => {
            console.error('获取数据失败:', error);
            // 从localStorage读取作为备份
            loadModelingDataFromLocalStorage();
        });
}

function loadModelingDataFromLocalStorage() {
    const studentModelingData = document.getElementById('student-modeling-data');
    if (!studentModelingData) return;
    
    // 从localStorage读取学生提交的数据
    const modelingFormData = JSON.parse(localStorage.getItem('modelingFormData') || '[]');
    
    // 显示学生提交的数据
    if (modelingFormData.length > 0) {
        modelingFormData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.team}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.time}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.answers.detector || '未填写'}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.answers.controller || '未填写'}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.answers.executor || '未填写'}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${data.answers.object || '未填写'}</td>
            `;
            studentModelingData.appendChild(row);
        });
    } else {
        // 显示空状态
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" style="border: 1px solid #ddd; padding: 20px; text-align: center; color: #999;">暂无学生提交数据</td>
        `;
        studentModelingData.appendChild(emptyRow);
    }
}



// 学生提交系统建模答案
function submitModelingAnswer() {
    // 获取学生填写的答案
    const detector = document.getElementById('modeling-detector').value;
    const controller = document.getElementById('modeling-controller').value;
    const executor = document.getElementById('modeling-executor').value;
    const object = document.getElementById('modeling-object').value;
    
    // 检查是否所有答案都已填写
    if (!detector || !controller || !executor || !object) {
        alert('请填写所有答案！');
        return;
    }
    
    // 获取当前登录的学生用户名
    if (!currentUser) {
        alert('请先登录！');
        return;
    }
    
    // 获取当前时间
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN');
    
    // 创建答案数据
    const answerData = {
        team: currentUser,
        time: timeString,
        answers: {
            detector: detector,
            controller: controller,
            executor: executor,
            object: object
        }
    };
    
    // 从localStorage读取现有数据
    let modelingFormData = JSON.parse(localStorage.getItem('modelingFormData') || '[]');
    
    // 检查是否已经提交过答案
    const existingIndex = modelingFormData.findIndex(data => data.team === currentUser);
    if (existingIndex !== -1) {
        // 更新现有答案
        modelingFormData[existingIndex] = answerData;
    } else {
        // 添加新答案
        modelingFormData.push(answerData);
    }
    
    // 保存到localStorage
    localStorage.setItem('modelingFormData', JSON.stringify(modelingFormData));
    
    // 发送到服务器
    const modelingData = {
        id: Date.now(),
        team: currentUser,
        time: timeString,
        detector: detector,
        controller: controller,
        executor: executor,
        object: object,
        timestamp: now.toISOString()
    };
    
    fetch('modeling-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(modelingData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('提交失败:', data.error);
            alert('答案已保存到本地，但提交到服务器失败，请重试');
        } else {
            // 显示成功提示
            alert('答案提交成功！教师将看到你的答案。');
        }
    })
    .catch(error => {
        console.error('提交失败:', error);
        alert('答案已保存到本地，但提交到服务器失败，请重试');
    });
    
    console.log('系统建模答案已提交:', answerData);
}

// ==================== 自由讨论模块功能 ====================

// 加载讨论消息
async function loadDiscussionMessages() {
    console.log('开始加载讨论消息');
    
    // 获取讨论消息容器
    const studentContainer = document.getElementById('student-discussion-messages');
    const teacherContainer = document.getElementById('teacher-discussion-messages');
    
    // 如果容器不存在，直接返回
    if (!studentContainer && !teacherContainer) {
        console.log('讨论消息容器不存在');
        return;
    }
    
    try {
        console.log('发送请求到 /discussion-messages');
        const response = await fetch('/discussion-messages');
        console.log('响应状态:', response.status);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await response.json();
        console.log('获取到的消息:', messages);
        
        // 按时间正序排列，最新的消息在最下方
        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // 保存到localStorage作为备份
        localStorage.setItem('discussionMessages', JSON.stringify(messages));
        console.log('消息已保存到localStorage');
        
        displayDiscussionMessages(messages);
    } catch (error) {
        console.error('加载讨论消息失败:', error);
        // 加载失败时从localStorage获取作为备份
        const savedMessages = JSON.parse(localStorage.getItem('discussionMessages') || '[]');
        console.log('从localStorage获取备份消息:', savedMessages);
        
        // 按时间正序排列，最新的消息在最下方
        savedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        displayDiscussionMessages(savedMessages);
    }
}

// 显示讨论消息
function displayDiscussionMessages(messages) {
    console.log('开始显示讨论消息');
    console.log('消息数量:', messages.length);
    
    const studentContainer = document.getElementById('student-discussion-messages');
    const teacherContainer = document.getElementById('teacher-discussion-messages');
    
    console.log('学生讨论消息容器:', studentContainer);
    console.log('教师讨论消息容器:', teacherContainer);
    
    const messagesHTML = messages.map(msg => createMessageHTML(msg)).join('');
    console.log('生成的消息HTML:', messagesHTML);
    
    if (studentContainer) {
        console.log('更新学生讨论消息容器');
        studentContainer.innerHTML = messagesHTML;
        studentContainer.scrollTop = studentContainer.scrollHeight;
    }
    if (teacherContainer) {
        console.log('更新教师讨论消息容器');
        teacherContainer.innerHTML = messagesHTML;
        teacherContainer.scrollTop = teacherContainer.scrollHeight;
    }
}

// 创建消息HTML
function createMessageHTML(message) {
    const isTeacher = message.role === 'teacher';
    const isSelf = message.username === (currentUser || '匿名用户');
    
    return `
        <div class="discussion-message" style="margin-bottom: 15px; display: flex; ${isSelf ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}">
            <div style="max-width: 70%; ${isSelf ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;' : isTeacher ? 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white;' : 'background-color: white; border: 1px solid #e0e0e0;'} border-radius: 12px; padding: 12px 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 600; ${isSelf || isTeacher ? 'opacity: 0.9;' : 'color: #667eea;'}">${message.username}</span>
                    ${isTeacher ? '<span style="font-size: 10px; background-color: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 10px;">教师</span>' : ''}
                    <span style="font-size: 10px; ${isSelf || isTeacher ? 'opacity: 0.7;' : 'color: #999;'}">${formatTime(message.timestamp)}</span>
                </div>
                <div style="font-size: 14px; line-height: 1.5; word-wrap: break-word;">${escapeHtml(message.content)}</div>
            </div>
        </div>
    `;
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// 转义HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 学生发送讨论消息
async function sendDiscussionMessage() {
    const input = document.getElementById('student-discussion-input');
    const content = input.value.trim();
    
    if (!content) {
        alert('请输入内容');
        return;
    }
    
    const messageData = {
        id: Date.now(),
        username: currentUser || '匿名用户',
        role: 'student',
        content: content,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/discussion-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });
        
        if (response.ok) {
            input.value = '';
            await loadDiscussionMessages();
        } else {
            alert('发送失败，请重试');
        }
    } catch (error) {
        console.error('发送讨论消息失败:', error);
        alert('发送失败，请重试');
    }
}

// 教师发送讨论消息
async function sendTeacherDiscussionMessage() {
    const input = document.getElementById('teacher-discussion-input');
    const content = input.value.trim();
    
    if (!content) {
        alert('请输入内容');
        return;
    }
    
    const messageData = {
        id: Date.now(),
        username: currentUser || '教师',
        role: 'teacher',
        content: content,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch('/discussion-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });
        
        if (response.ok) {
            input.value = '';
            await loadDiscussionMessages();
        } else {
            alert('发送失败，请重试');
        }
    } catch (error) {
        console.error('发送讨论消息失败:', error);
        alert('发送失败，请重试');
    }
}

// 智能助手功能
function toggleAiAssistant() {
    const aiAssistant = document.getElementById('ai-assistant');
    aiAssistant.classList.toggle('active');
}

function sendAiMessage() {
    const input = document.getElementById('ai-assistant-input');
    const message = input.value.trim();
    if (!message) return;
    
    // 添加用户消息
    addUserMessage(message);
    input.value = '';
    
    // 显示加载状态
    addAiMessage('正在思考...');
    
    // 调用服务器端API获取AI回复
    fetch('ai-assistant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: message })
    })
    .then(response => response.json())
    .then(data => {
        // 移除加载状态消息
        const messagesContainer = document.getElementById('ai-assistant-messages');
        messagesContainer.removeChild(messagesContainer.lastChild);
        
        if (data.error) {
            addAiMessage('抱歉，我暂时无法回答你的问题。请稍后再试。');
        } else {
            addAiMessage(data.response);
        }
    })
    .catch(error => {
        console.error('Error calling AI service:', error);
        // 移除加载状态消息
        const messagesContainer = document.getElementById('ai-assistant-messages');
        messagesContainer.removeChild(messagesContainer.lastChild);
        addAiMessage('抱歉，我暂时无法回答你的问题。请稍后再试。');
    });
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'user-message';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addAiMessage(message) {
    const messagesContainer = document.getElementById('ai-assistant-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getAiResponse(message) {
    // 简单的回复逻辑
    message = message.toLowerCase();
    
    if (message.includes('你好') || message.includes('hello') || message.includes('hi')) {
        return '你好！我是智能助手，有什么可以帮助你的吗？';
    } else if (message.includes('闭环控制系统') || message.includes('循迹小车')) {
        return '闭环控制系统是一种通过反馈机制实现精确控制的系统。在循迹小车中，它通过传感器检测小车的位置，与预设轨迹进行比较，然后调整电机的转速，使小车保持在轨迹上行驶。';
    } else if (message.includes('登录') || message.includes('账号')) {
        return '你可以使用以下账号登录：\n学生账号：小组1 / 1111\n教师账号：teacher / 123456';
    } else if (message.includes('帮助') || message.includes('功能')) {
        return '本平台提供以下功能：\n1. 游戏体验：体验智能驾驶和手动驾驶\n2. 情景警示：了解疲劳驾驶的危害\n3. 对比体验：对比自动驾驶和人工驾驶的差异\n4. 动手实操：学习循迹小车的工作原理和系统建模\n5. 原理升华：了解从循迹到智能驾驶的技术演进\n6. 作业管理：提交和批改作业\n7. 学情分析：分析学生的学习情况';
    } else if (message.includes('拍照') || message.includes('摄像头')) {
        return '你可以在动手实操页面点击"拍照提交给教师端"按钮来使用摄像头功能，支持拍照、重拍和上传功能。';
    } else if (message.includes('游戏') || message.includes('驾驶')) {
        return '本平台提供两种驾驶体验：\n1. 手动控制小车：体验人工驾驶的挑战\n2. AI游戏小车：体验智能驾驶的优势\n你可以在游戏体验和对比体验页面找到这些游戏。';
    } else if (message.includes('作业')) {
        return '你可以在课后作业页面查看和提交作业，教师会在作业管理页面批改作业并给出反馈。';
    } else if (message.includes('天气') || message.includes('温度')) {
        return '我无法实时获取天气信息，但你可以通过天气应用或网站查看当前天气情况。';
    } else if (message.includes('时间') || message.includes('几点')) {
        const now = new Date();
        const time = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        return `当前时间是 ${time}。`;
    } else if (message.includes('日期') || message.includes('今天')) {
        const now = new Date();
        const date = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
        return `今天是 ${date}。`;
    } else if (message.includes('你是谁') || message.includes('你的名字')) {
        return '我是智能助手，专为闭环控制系统课堂设计，能够回答关于课程内容和平台使用的问题，也可以回答一些一般性问题。';
    } else if (message.includes('谢谢') || message.includes('感谢')) {
        return '不客气！如果还有其他问题，随时告诉我。';
    } else if (message.includes('再见') || message.includes('拜拜')) {
        return '再见！祝你学习愉快！';
    } else if (message.includes('音乐') || message.includes('歌曲')) {
        return '我无法播放音乐，但你可以使用音乐流媒体服务如网易云音乐、QQ音乐等来收听你喜欢的歌曲。';
    } else if (message.includes('电影') || message.includes('电影推荐')) {
        return '最近有很多好看的电影，你可以查看豆瓣电影或其他电影评分网站来获取推荐。';
    } else if (message.includes('体育') || message.includes('运动')) {
        return '保持运动对身体健康非常重要！你喜欢什么运动呢？';
    } else if (message.includes('健康') || message.includes('身体')) {
        return '保持健康的生活方式包括均衡饮食、适量运动、充足睡眠和保持良好的心态。如果有健康问题，建议咨询专业医生。';
    } else if (message.includes('学习') || message.includes('读书')) {
        return '学习是一个持续的过程，保持好奇心和毅力很重要。你最近在学习什么呢？';
    } else if (message.includes('科技') || message.includes('技术')) {
        return '科技发展日新月异，人工智能、物联网、区块链等技术正在改变我们的生活。你对哪方面的技术感兴趣？';
    } else if (message.includes('旅行') || message.includes('旅游')) {
        return '旅行可以开阔眼界，增长见识。你最近有什么旅行计划吗？';
    } else if (message.includes('食物') || message.includes('美食')) {
        return '美食是生活的乐趣之一！你喜欢什么类型的食物呢？';
    } else if (message.includes('编程') || message.includes('代码')) {
        return '编程是一项很有价值的技能，它可以帮助我们解决问题和创造新事物。你在学习什么编程语言？';
    } else {
        return '我理解你的问题，虽然我可能没有所有问题的答案，但我会尽力帮助你。你可以尝试更具体地描述你的问题，或者询问关于闭环控制系统、平台使用的相关问题。';
    }
}

// 监听回车键发送消息
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('ai-assistant-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAiMessage();
            }
        });
    }
});

// 拍照功能
let capturedImage = null;
let mediaStream = null;

function takePhoto() {
    console.log('开始拍照功能');
    
    // 检查是否在安全上下文中
    if (!window.isSecureContext) {
        console.warn('不在安全上下文中，摄像头访问可能受限');
        // 对于 localhost 和局域网 IP，尝试继续
        if (window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.')) {
            console.log('在本地或局域网环境中，尝试继续访问摄像头');
        } else {
            console.error('不在安全上下文中，摄像头访问可能受限');
            alert('摄像头访问需要安全上下文（HTTPS 或本地服务器）');
            return;
        }
    }
    
    // 检查浏览器是否支持摄像头 API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('浏览器不支持摄像头 API');
        alert('您的浏览器不支持摄像头功能，请使用 Chrome、Firefox、Edge 等现代浏览器');
        return;
    }
    
    // 打开模态框
    const modal = document.getElementById('camera-modal');
    modal.style.display = 'flex';
    
    // 准备视频约束
    const constraints = {
        video: {
            facingMode: 'environment' // 优先使用后置摄像头（如果可用）
        }
    };
    
    // 请求摄像头权限
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            console.log('成功获取摄像头流');
            mediaStream = stream;
            
            // 获取视频元素
            const video = document.getElementById('camera-video');
            
            // 处理不同浏览器的视频流设置
            if (video.srcObject !== undefined) {
                video.srcObject = stream;
            } else if (window.URL && window.URL.createObjectURL) {
                video.src = window.URL.createObjectURL(stream);
            } else if (window.webkitURL && window.webkitURL.createObjectURL) {
                video.src = window.webkitURL.createObjectURL(stream);
            }
            
            // 显示摄像头预览，隐藏拍照预览
            document.getElementById('camera-preview').style.display = 'block';
            document.getElementById('photo-preview').style.display = 'none';
        })
        .catch(function(err) {
            console.error('无法访问摄像头:', err);
            
            // 关闭模态框
            closeCameraModal();
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                alert('摄像头权限被拒绝，请在浏览器设置中允许访问摄像头');
            } else if (err.name === 'NotFoundError') {
                alert('未找到摄像头设备，请确保摄像头已连接');
            } else if (err.name === 'NotReadableError') {
                alert('摄像头被其他应用占用，请关闭其他使用摄像头的应用');
            } else if (err.name === 'OverconstrainedError') {
                alert('摄像头设备无法满足要求，请尝试使用其他摄像头');
            } else {
                alert('无法访问摄像头，请检查权限设置和设备连接。错误: ' + err.message);
            }
        });
}

function capturePhoto() {
    if (!mediaStream) {
        alert('摄像头未启动');
        return;
    }
    
    // 获取视频元素
    const video = document.getElementById('camera-video');
    
    // 创建一个画布用于捕获图像
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    
    // 捕获图像
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage = canvas.toDataURL('image/jpeg');
    
    // 显示拍照预览，隐藏摄像头预览
    document.getElementById('camera-preview').style.display = 'none';
    document.getElementById('photo-preview').style.display = 'block';
    document.getElementById('captured-photo').src = capturedImage;
}

function retakePhoto() {
    // 显示摄像头预览，隐藏拍照预览
    document.getElementById('camera-preview').style.display = 'block';
    document.getElementById('photo-preview').style.display = 'none';
}

function submitPhoto() {
    if (!capturedImage) {
        alert('请先拍照');
        return;
    }
    
    // 显示加载状态
    const submitButton = document.getElementById('submit-photo-btn');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '上传中...';
    submitButton.disabled = true;
    
    // 准备表单数据
    const formData = new FormData();
    
    // 将 base64 图像转换为 Blob
    fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
            const username = currentUser || localStorage.getItem('username') || '未登录用户';
            formData.append('photo', blob, username + '_photo_' + Date.now() + '.jpg');
            
            // 发送照片到服务器（学生照片）
            return fetch('/student-photos', {
                method: 'POST',
                body: formData
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            // 准备资源库上传的表单数据
            const resourceFormData = new FormData();
            
            // 再次将 base64 图像转换为 Blob
            return fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const username = currentUser || localStorage.getItem('username') || '未登录用户';
                    resourceFormData.append('resource', blob, username + '_resource_' + Date.now() + '.jpg');
                    
                    // 发送照片到资源库
                    return fetch('/resources', {
                        method: 'POST',
                        body: resourceFormData
                    });
                });
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            alert('照片上传成功！');
            // 关闭模态框
            closeCameraModal();
            // 清空捕获的图像
            capturedImage = null;
            document.getElementById('captured-photo').src = '';
        })
        .catch(error => {
            console.error('上传失败:', error);
            alert('上传失败，请重试: ' + error.message);
        })
        .finally(() => {
            // 恢复按钮状态
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
}

function closeCameraModal() {
    // 停止视频流
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    
    // 隐藏模态框
    const modal = document.getElementById('camera-modal');
    modal.style.display = 'none';
    
    // 清空捕获的图像
    capturedImage = null;
    document.getElementById('captured-photo').src = '';
    
    // 重置预览状态
    document.getElementById('camera-preview').style.display = 'block';
    document.getElementById('photo-preview').style.display = 'none';
}

// 加载学生上传的照片（教师端）
function loadStudentPhotos() {
    fetch('/student-photos')
        .then(response => response.json())
        .then(photos => {
            const container = document.getElementById('student-photos-container');
            if (container) {
                if (photos.length === 0) {
                    container.innerHTML = `
                        <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: #999; border: 1px dashed #ddd; border-radius: 8px;">
                            暂无学生上传照片
                        </div>
                    `;
                } else {
                    container.innerHTML = '';
                    photos.forEach(photo => {
                        const photoElement = document.createElement('div');
                        photoElement.style.cssText = `
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        `;
                        photoElement.innerHTML = `
                            <img src="${photo.url}" alt="${photo.name}" style="width: 100%; height: 150px; object-fit: cover;">
                            <div style="padding: 10px;">
                                <p style="margin: 0; font-size: 14px; color: #666;">${photo.name}</p>
                                <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">${new Date(photo.timestamp).toLocaleString()}</p>
                            </div>
                        `;
                        container.appendChild(photoElement);
                    });
                }
            }
        })
        .catch(error => {
            console.error('加载照片失败:', error);
        });
}

// 加载资源库中的资源（教师端）
function loadResources() {
    fetch('/resources')
        .then(response => response.json())
        .then(resources => {
            const container = document.getElementById('resources-container');
            if (container) {
                if (resources.length === 0) {
                    container.innerHTML = `
                        <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: #999; border: 1px dashed #ddd; border-radius: 8px;">
                            暂无资源
                        </div>
                    `;
                } else {
                    container.innerHTML = '';
                    resources.forEach(resource => {
                        const resourceElement = document.createElement('div');
                        resourceElement.style.cssText = `
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        `;
                        
                        let resourceContent = '';
                        if (resource.type === 'photo' || resource.url.endsWith('.jpg') || resource.url.endsWith('.jpeg') || resource.url.endsWith('.png') || resource.url.endsWith('.gif')) {
                            resourceContent = `<img src="${resource.url}" alt="${resource.name}" style="width: 100%; height: 150px; object-fit: cover;">`;
                        } else {
                            resourceContent = `<div style="width: 100%; height: 150px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center; font-size: 48px;">📄</div>`;
                        }
                        
                        resourceElement.innerHTML = `
                            ${resourceContent}
                            <div style="padding: 10px;">
                                <p style="margin: 0; font-size: 14px; color: #666;">${resource.name}</p>
                                <p style="margin: 5px 0 10px 0; font-size: 12px; color: #999;">${new Date(resource.timestamp).toLocaleString()}</p>
                                <button class="btn btn-sm btn-danger" onclick="deleteResource(${resource.id})" style="font-size: 12px; padding: 4px 8px;">删除</button>
                            </div>
                        `;
                        container.appendChild(resourceElement);
                    });
                }
            }
        })
        .catch(error => {
            console.error('加载资源失败:', error);
        });
}

// 删除资源
function deleteResource(resourceId) {
    if (confirm('确定要删除这个资源吗？')) {
        fetch(`/resources/${resourceId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('删除失败: ' + data.error);
            } else {
                alert('删除成功！');
                loadResources();
            }
        })
        .catch(error => {
            console.error('删除失败:', error);
            alert('删除失败，请重试');
        });
    }
}

// 在教师页面加载时加载学生照片和资源
document.addEventListener('DOMContentLoaded', function() {
    // 当教师切换到动手实操页面时，加载学生照片
    const teacherPractice = document.getElementById('teacher-practice');
    if (teacherPractice) {
        // 检查是否当前页面是教师页面的动手实操页面
        if (teacherPractice.classList.contains('active')) {
            loadStudentPhotos();
        }
    }
    
    // 当教师切换到资源库页面时，加载资源
    const teacherResources = document.getElementById('teacher-resources');
    if (teacherResources) {
        // 检查是否当前页面是教师页面的资源库页面
        if (teacherResources.classList.contains('active')) {
            loadResources();
        }
    }
    
    // 监听菜单切换
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menu = this.getAttribute('data-menu');
            if (menu === 'practice') {
                setTimeout(loadStudentPhotos, 100);
            } else if (menu === 'resources') {
                setTimeout(loadResources, 100);
            }
        });
    });
});