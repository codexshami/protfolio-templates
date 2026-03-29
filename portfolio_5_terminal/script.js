// 1. Matrix Background
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    columns = canvas.width / fontSize;
    drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
});

// 2. Terminal Logic
const cmdInput = document.getElementById('cmd-input');
const terminalBody = document.getElementById('terminal-output');

// Keep focus on input
document.addEventListener('click', () => cmdInput.focus());

const commands = {
    help: `Available commands:
    <span class="cmd-highlight">about</span>    - View developer profile
    <span class="cmd-highlight">skills</span>   - List technical skills
    <span class="cmd-highlight">projects</span> - View project repository
    <span class="cmd-highlight">contact</span>  - Establish communication
    <span class="cmd-highlight">github</span>   - Open github profile
    <span class="cmd-highlight">clear</span>    - Clear terminal output`,
    
    about: `Hi, I'm a Backend / DevOps Engineer.
I spend my time in the terminal, optimizing server architectures, building APIs, and automating deployments. If it runs on Linux, I can probably fix it (or break it first).`,
    
    skills: `> LANGUAGES: Python, Go, Bash, JS/TS, SQL
> CLOUD: AWS, GCP, DigitalOcean
> DEVOPS: Docker, Kubernetes, CI/CD, Terraform
> DATABASES: PostgreSQL, Redis, MongoDB`,
    
    projects: `[1] SECURE-API-GATEWAY - High-performance rate-limiting gateway (Go)
[2] K8S-AUTO-SCALER - Custom metric-based pod scaler (Python)
[3] TERRAFORM-BASE - Reusable infrastructure modules (HCL)
<br>Type <span class="cmd-highlight">github</span> to go to profile.`,
    
    contact: `Email: <a href="mailto:sysadmin@dev.local">sysadmin@dev.local</a>
LinkedIn: <a href="#">linkedin.com/in/sysadmin</a>
Twitter: @sysadmin`,

    github: `Opening GitHub request... (Simulated link).`
};

cmdInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const val = this.value.trim().toLowerCase();
        
        // Print the command entered
        const cmdLog = document.createElement('div');
        cmdLog.innerHTML = `<span class="prompt">root@dev:~#</span> ${this.value}`;
        
        // Output response
        const response = document.createElement('div');
        response.className = 'output-response';
        
        if (val === 'clear') {
            terminalBody.innerHTML = '';
            terminalBody.appendChild(document.querySelector('.cmd-line'));
            this.value = '';
            cmdInput.focus();
            return;
        }
        
        if (val === '') {
            response.innerHTML = '';
        } else if (commands[val]) {
            response.innerHTML = commands[val].replace(/\n/g, '<br>');
        } else {
            response.innerHTML = `bash: ${val}: command not found`;
        }
        
        // Insert before the input line
        const cmdLine = document.querySelector('.cmd-line');
        terminalBody.insertBefore(cmdLog, cmdLine);
        terminalBody.insertBefore(response, cmdLine);
        
        // Scroll to bottom
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        this.value = '';
    }
});

// Cursor blink effect right inside input field
setInterval(() => {
    cmdInput.style.borderRight = cmdInput.style.borderRight === '12px solid rgb(0, 255, 0)' ? '12px solid transparent' : '12px solid rgb(0, 255, 0)';
}, 500);
