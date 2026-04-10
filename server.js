const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// OpenAI API 配置
const OPENAI_API_KEY = 'your-openai-api-key'; // 请替换为您的OpenAI API密钥
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const PORT = 8080;
const BASE_DIR = __dirname;

// 数据文件路径
const GAME_SCORES_FILE = './game_scores.json';
const GAME_SHARES_FILE = './game_shares.json';
const HOMEWORKS_FILE = './homeworks.json';
const GRADED_HOMEWORKS_FILE = './graded_homeworks.json';
const PIGAI_FILE = './pigai.json';
const COMPARISON_SHARES_FILE = './comparison_shares.json';
const PRINCIPLE_SHARES_FILE = './principle_shares.json';
const DISCUSSION_MESSAGES_FILE = './discussion_messages.json';
const TRACKING_CAR_DATA_FILE = './tracking_car_data.json';
const MODELING_DATA_FILE = './modeling_data.json';
const STUDENT_PHOTOS_FILE = './student_photos.json';
const RESOURCES_FILE = './resources.json';

// 照片存储目录
const PHOTOS_DIR = './photos';
if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
    console.log(`Created ${PHOTOS_DIR} directory`);
}

// 资源库目录
const RESOURCES_DIR = './resources';
if (!fs.existsSync(RESOURCES_DIR)) {
    fs.mkdirSync(RESOURCES_DIR, { recursive: true });
    console.log(`Created ${RESOURCES_DIR} directory`);
}

// 初始化数据文件
function initDataFile(filePath, defaultContent) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultContent));
        console.log(`Created ${filePath}`);
    }
}

// 初始化所有数据文件
initDataFile(GAME_SCORES_FILE, []);
initDataFile(GAME_SHARES_FILE, []);
initDataFile(HOMEWORKS_FILE, []);
initDataFile(GRADED_HOMEWORKS_FILE, []);
initDataFile(PIGAI_FILE, []);
initDataFile(COMPARISON_SHARES_FILE, []);
initDataFile(PRINCIPLE_SHARES_FILE, []);
initDataFile(DISCUSSION_MESSAGES_FILE, []);
initDataFile(TRACKING_CAR_DATA_FILE, []);
initDataFile(MODELING_DATA_FILE, []);
initDataFile(STUDENT_PHOTOS_FILE, []);
initDataFile(RESOURCES_FILE, []);

// 读取数据
function readData(filePath) {
    initDataFile(filePath, []);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// 写入数据
function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 调用OpenAI API
function callOpenAI(prompt, callback) {
    const postData = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: '你是一个智能助手，专为闭环控制系统课堂设计，能够回答关于课程内容、平台使用的问题，也可以回答一些一般性问题。你的回答应该友好、专业，并且能够帮助学生和教师更好地理解闭环控制系统相关知识。'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 500
    });

    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.choices && response.choices.length > 0) {
                    callback(null, response.choices[0].message.content);
                } else {
                    callback(new Error('No response from OpenAI'));
                }
            } catch (error) {
                callback(error);
            }
        });
    });

    req.on('error', (error) => {
        callback(error);
    });

    req.write(postData);
    req.end();
}

// 静态文件类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// 创建服务器
const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url} by method ${req.method}`);
    
    // 处理API请求
    if (req.url === '/game-scores' && req.method === 'GET') {
        // 获取游戏得分记录
        const gameScores = readData(GAME_SCORES_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(gameScores));
        return;
    } else if (req.url === '/game-scores' && req.method === 'POST') {
        // 添加游戏得分记录
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newRecord = JSON.parse(body);
                const gameScores = readData(GAME_SCORES_FILE);
                gameScores.push(newRecord);
                writeData(GAME_SCORES_FILE, gameScores);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newRecord));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/game-shares' && req.method === 'GET') {
        // 获取游戏分享记录
        const gameShares = readData(GAME_SHARES_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(gameShares));
        return;
    } else if (req.url === '/game-shares' && req.method === 'POST') {
        // 添加游戏分享记录
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newShare = JSON.parse(body);
                const gameShares = readData(GAME_SHARES_FILE);
                gameShares.push(newShare);
                writeData(GAME_SHARES_FILE, gameShares);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newShare));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/homeworks' && req.method === 'GET') {
        // 获取作业列表
        const homeworks = readData(HOMEWORKS_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(homeworks));
        return;
    } else if (req.url === '/homeworks' && req.method === 'POST') {
        // 添加作业
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newHomework = JSON.parse(body);
                const homeworks = readData(HOMEWORKS_FILE);
                homeworks.push(newHomework);
                writeData(HOMEWORKS_FILE, homeworks);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newHomework));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url.match(/^\/homeworks\/\d+$/) && req.method === 'PUT') {
        // 更新作业
        const homeworkId = req.url.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedHomework = JSON.parse(body);
                const homeworks = readData(HOMEWORKS_FILE);
                const homeworkIndex = homeworks.findIndex(hw => hw.id == homeworkId);
                if (homeworkIndex === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Homework not found' }));
                    return;
                }
                homeworks[homeworkIndex] = updatedHomework;
                writeData(HOMEWORKS_FILE, homeworks);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedHomework));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/graded-homeworks' && req.method === 'GET') {
        // 获取已批改作业
        const gradedHomeworks = readData(GRADED_HOMEWORKS_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(gradedHomeworks));
        return;
    } else if (req.url === '/graded-homeworks' && req.method === 'POST') {
        // 添加已批改作业
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newGradedHomework = JSON.parse(body);
                const gradedHomeworks = readData(GRADED_HOMEWORKS_FILE);
                gradedHomeworks.push(newGradedHomework);
                writeData(GRADED_HOMEWORKS_FILE, gradedHomeworks);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newGradedHomework));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/pigai' && req.method === 'POST') {
        // 添加作业评价反馈
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newPigaiRecord = JSON.parse(body);
                const pigaiRecords = readData(PIGAI_FILE);
                pigaiRecords.push(newPigaiRecord);
                writeData(PIGAI_FILE, pigaiRecords);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newPigaiRecord));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/comparison-shares' && req.method === 'GET') {
        // 获取对比体验分享
        const comparisonShares = readData(COMPARISON_SHARES_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comparisonShares));
        return;
    } else if (req.url === '/comparison-shares' && req.method === 'POST') {
        // 添加对比体验分享
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newShare = JSON.parse(body);
                const comparisonShares = readData(COMPARISON_SHARES_FILE);
                comparisonShares.push(newShare);
                writeData(COMPARISON_SHARES_FILE, comparisonShares);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newShare));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/principle-shares' && req.method === 'GET') {
        // 获取原理升华分享
        const principleShares = readData(PRINCIPLE_SHARES_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(principleShares));
        return;
    } else if (req.url === '/principle-shares' && req.method === 'POST') {
        // 添加原理升华分享
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newShare = JSON.parse(body);
                const principleShares = readData(PRINCIPLE_SHARES_FILE);
                principleShares.push(newShare);
                writeData(PRINCIPLE_SHARES_FILE, principleShares);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newShare));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/discussion-messages' && req.method === 'GET') {
        // 获取讨论消息
        const discussionMessages = readData(DISCUSSION_MESSAGES_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(discussionMessages));
        return;
    } else if (req.url === '/discussion-messages' && req.method === 'POST') {
        // 添加讨论消息
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newMessage = JSON.parse(body);
                const discussionMessages = readData(DISCUSSION_MESSAGES_FILE);
                discussionMessages.push(newMessage);
                writeData(DISCUSSION_MESSAGES_FILE, discussionMessages);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newMessage));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/tracking-car-data' && req.method === 'GET') {
        // 获取循迹小车数据
        const trackingCarData = readData(TRACKING_CAR_DATA_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(trackingCarData));
        return;
    } else if (req.url === '/tracking-car-data' && req.method === 'POST') {
        // 添加循迹小车数据
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                const trackingCarData = readData(TRACKING_CAR_DATA_FILE);
                trackingCarData.push(newData);
                writeData(TRACKING_CAR_DATA_FILE, trackingCarData);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newData));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/modeling-data' && req.method === 'GET') {
        // 获取建模数据
        const modelingData = readData(MODELING_DATA_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(modelingData));
        return;
    } else if (req.url === '/modeling-data' && req.method === 'POST') {
        // 添加建模数据
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                const modelingData = readData(MODELING_DATA_FILE);
                modelingData.push(newData);
                writeData(MODELING_DATA_FILE, modelingData);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newData));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid data' }));
            }
        });
        return;
    } else if (req.url === '/student-photos' && req.method === 'GET') {
        // 获取学生照片列表
        const photos = readData(STUDENT_PHOTOS_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(photos));
        return;
    } else if (req.url === '/student-photos' && req.method === 'POST') {
        // 处理照片上传
        let body = [];
        
        req.on('data', chunk => {
            body.push(chunk);
        });
        
        req.on('end', () => {
            try {
                const bodyBuffer = Buffer.concat(body);
                
                // 检查Content-Type头
                if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
                    console.error('Invalid content type:', req.headers['content-type']);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid content type' }));
                    return;
                }
                
                // 提取boundary
                const contentType = req.headers['content-type'];
                const boundaryMatch = contentType.match(/boundary=(.+)/);
                if (!boundaryMatch) {
                    console.error('No boundary found in content type');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No boundary found' }));
                    return;
                }
                const boundary = boundaryMatch[1];
                const boundaryBuffer = Buffer.from('--' + boundary);
                
                // 分割请求体（使用Buffer分割，避免二进制数据损坏）
                let parts = [];
                let start = 0;
                while (start < bodyBuffer.length) {
                    const index = bodyBuffer.indexOf(boundaryBuffer, start);
                    if (index === -1) break;
                    parts.push(bodyBuffer.slice(start, index));
                    start = index + boundaryBuffer.length;
                }
                
                let photoBuffer = null;
                let filename = '';
                
                for (const part of parts) {
                    // 找到Content-Disposition头
                    const partStr = part.toString();
                    if (partStr.includes('Content-Disposition')) {
                        // 找到文件部分
                        if (partStr.includes('filename=')) {
                            // 提取文件名
                            const filenameMatch = partStr.match(/filename="([^"]+)"/);
                            if (filenameMatch) {
                                filename = filenameMatch[1];
                            }
                            
                            // 提取文件内容（使用Buffer操作，避免数据损坏）
                            const contentStartStr = '\r\n\r\n';
                            const contentStartBuffer = Buffer.from(contentStartStr);
                            const contentStart = part.indexOf(contentStartBuffer);
                            if (contentStart > -1) {
                                const contentStartPos = contentStart + contentStartBuffer.length;
                                // 去除末尾的\r\n
                                let contentEnd = part.length;
                                const contentEndBuffer = Buffer.from('\r\n');
                                if (part.slice(-2).equals(contentEndBuffer)) {
                                    contentEnd = part.length - 2;
                                }
                                
                                photoBuffer = part.slice(contentStartPos, contentEnd);
                                break;
                            }
                        }
                    }
                }
                
                if (!photoBuffer || !filename) {
                    console.error('No file uploaded:', { photoBuffer: !!photoBuffer, filename: filename });
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No file uploaded' }));
                    return;
                }
                
                // 确保photos目录存在
                if (!fs.existsSync(PHOTOS_DIR)) {
                    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
                }
                
                // 生成唯一的文件名
                const uniqueFilename = Date.now() + '_' + filename;
                const photoPath = path.join(PHOTOS_DIR, uniqueFilename);
                
                // 保存照片文件
                fs.writeFileSync(photoPath, photoBuffer);
                console.log('Photo saved:', photoPath);
                
                // 保存照片信息到数据文件
                const photos = readData(STUDENT_PHOTOS_FILE);
                const newPhoto = {
                    id: Date.now(),
                    name: filename,
                    filename: uniqueFilename,
                    url: `/photos/${uniqueFilename}`,
                    timestamp: new Date().toISOString()
                };
                photos.push(newPhoto);
                writeData(STUDENT_PHOTOS_FILE, photos);
                console.log('Photo info saved:', newPhoto);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newPhoto));
            } catch (error) {
                console.error('Error uploading photo:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error uploading photo: ' + error.message }));
            }
        });
        return;
    } else if (req.url === '/ai-assistant' && req.method === 'POST') {
        // 处理智能助手请求
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const prompt = data.prompt;
                
                if (!prompt) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No prompt provided' }));
                    return;
                }
                
                // 调用OpenAI API
                callOpenAI(prompt, (error, response) => {
                    if (error) {
                        console.error('Error calling OpenAI:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error calling AI service' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ response: response }));
                    }
                });
            } catch (error) {
                console.error('Error processing AI request:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request data' }));
            }
        });
        return;
    } else if (req.url === '/resources' && req.method === 'GET') {
        // 获取资源库中的所有资源
        const resources = readData(RESOURCES_FILE);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resources));
        return;
    } else if (req.url === '/resources' && req.method === 'POST') {
        // 上传资源到资源库
        let body = [];
        
        req.on('data', chunk => {
            body.push(chunk);
        });
        
        req.on('end', () => {
            try {
                const bodyBuffer = Buffer.concat(body);
                
                // 检查Content-Type头
                if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
                    console.error('Invalid content type:', req.headers['content-type']);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid content type' }));
                    return;
                }
                
                // 提取boundary
                const contentType = req.headers['content-type'];
                const boundaryMatch = contentType.match(/boundary=(.+)/);
                if (!boundaryMatch) {
                    console.error('No boundary found in content type');
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No boundary found' }));
                    return;
                }
                const boundary = boundaryMatch[1];
                const boundaryBuffer = Buffer.from('--' + boundary);
                
                // 分割请求体（使用Buffer分割，避免二进制数据损坏）
                let parts = [];
                let start = 0;
                while (start < bodyBuffer.length) {
                    const index = bodyBuffer.indexOf(boundaryBuffer, start);
                    if (index === -1) break;
                    parts.push(bodyBuffer.slice(start, index));
                    start = index + boundaryBuffer.length;
                }
                
                let resourceBuffer = null;
                let filename = '';
                let resourceType = 'photo'; // 默认资源类型
                
                for (const part of parts) {
                    // 找到Content-Disposition头
                    const partStr = part.toString();
                    if (partStr.includes('Content-Disposition')) {
                        // 找到文件部分
                        if (partStr.includes('filename=')) {
                            // 提取文件名
                            const filenameMatch = partStr.match(/filename="([^"]+)"/);
                            if (filenameMatch) {
                                filename = filenameMatch[1];
                            }
                            
                            // 提取文件内容（使用Buffer操作，避免数据损坏）
                            const contentStartStr = '\r\n\r\n';
                            const contentStartBuffer = Buffer.from(contentStartStr);
                            const contentStart = part.indexOf(contentStartBuffer);
                            if (contentStart > -1) {
                                const contentStartPos = contentStart + contentStartBuffer.length;
                                // 去除末尾的\r\n
                                let contentEnd = part.length;
                                const contentEndBuffer = Buffer.from('\r\n');
                                if (part.slice(-2).equals(contentEndBuffer)) {
                                    contentEnd = part.length - 2;
                                }
                                
                                resourceBuffer = part.slice(contentStartPos, contentEnd);
                            }
                        }
                    }
                }
                
                if (!resourceBuffer || !filename) {
                    console.error('No file uploaded:', { resourceBuffer: !!resourceBuffer, filename: filename });
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No file uploaded' }));
                    return;
                }
                
                // 确保resources目录存在
                if (!fs.existsSync(RESOURCES_DIR)) {
                    fs.mkdirSync(RESOURCES_DIR, { recursive: true });
                }
                
                // 生成唯一的文件名
                const uniqueFilename = Date.now() + '_' + filename;
                const resourcePath = path.join(RESOURCES_DIR, uniqueFilename);
                
                // 保存资源文件
                fs.writeFileSync(resourcePath, resourceBuffer);
                console.log('Resource saved:', resourcePath);
                
                // 保存资源信息到数据文件
                const resources = readData(RESOURCES_FILE);
                const newResource = {
                    id: Date.now(),
                    name: filename,
                    filename: uniqueFilename,
                    type: resourceType,
                    url: `/resources/${uniqueFilename}`,
                    timestamp: new Date().toISOString()
                };
                resources.push(newResource);
                writeData(RESOURCES_FILE, resources);
                console.log('Resource info saved:', newResource);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newResource));
            } catch (error) {
                console.error('Error uploading resource:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error uploading resource: ' + error.message }));
            }
        });
        return;
    } else if (req.url.match(/^\/resources\/\d+$/) && req.method === 'DELETE') {
        // 从资源库中删除资源
        const resourceId = req.url.split('/')[2];
        
        try {
            const resources = readData(RESOURCES_FILE);
            const resourceIndex = resources.findIndex(r => r.id == resourceId);
            
            if (resourceIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Resource not found' }));
                return;
            }
            
            // 删除资源文件
            const resource = resources[resourceIndex];
            const resourcePath = path.join(RESOURCES_DIR, resource.filename);
            if (fs.existsSync(resourcePath)) {
                fs.unlinkSync(resourcePath);
                console.log('Resource file deleted:', resourcePath);
            }
            
            // 从数据文件中删除资源信息
            resources.splice(resourceIndex, 1);
            writeData(RESOURCES_FILE, resources);
            console.log('Resource info deleted:', resourceId);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Resource deleted successfully' }));
        } catch (error) {
            console.error('Error deleting resource:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error deleting resource: ' + error.message }));
        }
        return;
    }
    
    // 处理静态文件请求
    if (req.method === 'GET') {
        // 处理URL编码的路径，特别是中文文件名
        let decodedUrl = decodeURI(req.url);
        let filePath = '.' + decodedUrl;
        if (filePath === './') {
            filePath = './index.html';
        }
        
        // 确保路径是安全的，防止路径遍历攻击
        filePath = path.normalize(filePath);
        
        // 处理照片文件的静态请求
        if (decodedUrl.startsWith('/photos/')) {
            const photoFilename = path.basename(decodedUrl);
            // 使用绝对路径确保正确找到照片文件
            const photoPath = path.resolve(BASE_DIR, 'photos', photoFilename);
            
            console.log('Requesting photo:', photoPath);
            
            if (fs.existsSync(photoPath)) {
                console.log('Photo found:', photoPath);
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                // 读取文件并直接发送
                fs.readFile(photoPath, (error, content) => {
                    if (error) {
                        console.error('Error reading photo file:', error);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Server error');
                    } else {
                        res.end(content);
                    }
                });
                return;
            } else {
                console.log('Photo not found:', photoPath);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Photo not found');
                return;
            }
        } else if (decodedUrl.startsWith('/resources/')) {
            const resourceFilename = path.basename(decodedUrl);
            // 使用绝对路径确保正确找到资源文件
            const resourcePath = path.resolve(BASE_DIR, 'resources', resourceFilename);
            
            console.log('Requesting resource:', resourcePath);
            
            if (fs.existsSync(resourcePath)) {
                console.log('Resource found:', resourcePath);
                // 根据文件扩展名设置Content-Type
                const extname = path.extname(resourceFilename);
                let contentType = 'application/octet-stream';
                if (extname === '.jpg' || extname === '.jpeg') {
                    contentType = 'image/jpeg';
                } else if (extname === '.png') {
                    contentType = 'image/png';
                } else if (extname === '.gif') {
                    contentType = 'image/gif';
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                // 读取文件并直接发送
                fs.readFile(resourcePath, (error, content) => {
                    if (error) {
                        console.error('Error reading resource file:', error);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Server error');
                    } else {
                        res.end(content);
                    }
                });
                return;
            } else {
                console.log('Resource not found:', resourcePath);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Resource not found');
                return;
            }
        }
        
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        
        // 对于视频文件，确保设置正确的Content-Type
        if (extname === '.mp4') {
            res.writeHead(200, { 
                'Content-Type': 'video/mp4',
                'Accept-Ranges': 'bytes'
            });
            // 使用流来读取大文件，避免内存问题
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
            stream.on('error', (error) => {
                console.error('Error reading file:', error);
                res.statusCode = 404;
                res.end('File not found');
            });
        } else {
            // 对于其他文件，使用常规读取方式
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    if(error.code == 'ENOENT') {
                        // 文件不存在
                        res.writeHead(404);
                        res.end('File not found');
                    } else {
                        // 服务器错误
                        res.writeHead(500);
                        res.end('Server error: ' + error.code);
                    }
                } else {
                    // 文件存在，返回文件内容
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                }
            });
        }
    } else {
        // 处理其他POST请求
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('POST body:', body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'POST request received' }));
        });
    }
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// 处理服务器错误
server.on('error', (error) => {
    console.error('Server error:', error);
});

// 处理SIGINT信号（Ctrl+C）
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server stopped');
        process.exit(0);
    });
});