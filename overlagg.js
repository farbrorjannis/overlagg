// Hämta canvas-element
const canvas = document.getElementById('bildCanvas');
const ctx = canvas.getContext('2d');

// Variabler
let originalBild = null;
let bildLaddad = false;

// Standardinställningar
let overlaggTyp = 'tredjedelar';
let opacitet = 0.5;
let farg = [255, 0, 0]; // Röd som standard

// Lyssna på uppladdning
document.getElementById('bildUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                originalBild = img;
                bildLaddad = true;
                
                // Sätt canvas-storlek
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Begränsa storlek för att passa sidan
                if (canvas.width > 800) {
                    const ratio = 800 / canvas.width;
                    canvas.width = 800;
                    canvas.height = img.height * ratio;
                }
                
                ritaCanvas();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Lyssna på ändringar i verktyg
document.getElementById('overlaggTyp').addEventListener('change', function(e) {
    overlaggTyp = e.target.value;
    ritaCanvas();
});

document.getElementById('opacitet').addEventListener('input', function(e) {
    opacitet = e.target.value / 100;
    document.getElementById('opacitetVarde').textContent = e.target.value + '%';
    ritaCanvas();
});

document.getElementById('fargValj').addEventListener('change', function(e) {
    farg = e.target.value.split(',').map(Number);
    ritaCanvas();
});

// Rita canvas med bild och överlägg
function ritaCanvas() {
    if (!bildLaddad || !originalBild) return;
    
    // Rensa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Rita bilden
    ctx.drawImage(originalBild, 0, 0, canvas.width, canvas.height);
    
    // Rita överlägg baserat på vald typ
    ctx.globalAlpha = opacitet;
    ctx.strokeStyle = `rgb(${farg[0]}, ${farg[1]}, ${farg[2]})`;
    ctx.lineWidth = 2;
    
    switch(overlaggTyp) {
        case 'tredjedelar':
            ritaTredjedelsregeln();
            break;
        case 'gylleneSpiral':
            ritaGylleneSpiralen();
            break;
        case 'diagonaler':
            ritaDiagonaler();
            break;
        case 'gylleneTrianglar':
            ritaGylleneTrianglar();
            break;
        case 'rutnat':
            ritaRutnat();
            break;
        case 'cirkel':
            ritaCirkel();
            break;
    }
    
    ctx.globalAlpha = 1.0;
}

// Tredjedelsregeln
function ritaTredjedelsregeln() {
    const tredjedelBredd = canvas.width / 3;
    const tredjedelHojd = canvas.height / 3;
    
    ctx.beginPath();
    
    // Lodräta linjer
    ctx.moveTo(tredjedelBredd, 0);
    ctx.lineTo(tredjedelBredd, canvas.height);
    
    ctx.moveTo(tredjedelBredd * 2, 0);
    ctx.lineTo(tredjedelBredd * 2, canvas.height);
    
    // Vågräta linjer
    ctx.moveTo(0, tredjedelHojd);
    ctx.lineTo(canvas.width, tredjedelHojd);
    
    ctx.moveTo(0, tredjedelHojd * 2);
    ctx.lineTo(canvas.width, tredjedelHojd * 2);
    
    ctx.stroke();
    
    // Rita punkter i skärningspunkterna
    ctx.fillStyle = `rgb(${farg[0]}, ${farg[1]}, ${farg[2]})`;
    const punkter = [
        [tredjedelBredd, tredjedelHojd],
        [tredjedelBredd * 2, tredjedelHojd],
        [tredjedelBredd, tredjedelHojd * 2],
        [tredjedelBredd * 2, tredjedelHojd * 2]
    ];
    
    punkter.forEach(p => {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Gyllene spiralen (Fibonaccispiral)
function ritaGylleneSpiralen() {
    const phi = 1.618; // Gyllene snittet
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxSize = Math.min(canvas.width, canvas.height) * 0.4;
    
    ctx.beginPath();
    
    // Rita spiral från mitten och utåt
    let x = centerX;
    let y = centerY;
    let size = maxSize / 10;
    let direction = 0; // 0=höger, 1=upp, 2=vänster, 3=ner
    
    ctx.moveTo(x, y);
    
    for (let i = 0; i < 8; i++) {
        ctx.arc(x, y, size, direction * Math.PI/2, (direction + 0.5) * Math.PI/2);
        
        // Uppdatera position baserat på riktning
        switch(direction) {
            case 0: x += size; break; // höger
            case 1: y -= size; break; // upp
            case 2: x -= size; break; // vänster
            case 3: y += size; break; // ner
        }
        
        size *= phi;
        direction = (direction + 1) % 4;
    }
    
    ctx.stroke();
}

// Diagonalmetoden
function ritaDiagonaler() {
    ctx.beginPath();
    
    // Diagonal från övre vänster till nedre höger
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    
    // Diagonal från övre höger till nedre vänster
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    
    ctx.stroke();
}

// Gyllene trianglar
function ritaGylleneTrianglar() {
    const phi = 0.618; // Gyllene snittet inverterat
    
    ctx.beginPath();
    
    // Baserat på en huvuddiagonal (övre vänster till nedre höger)
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    
    // Linjer från de andra hörnen vinkelrätt mot diagonalen
    const x1 = canvas.width * phi;
    const y1 = 0;
    const x2 = 0;
    const y2 = canvas.height * phi;
    
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(x1, y1);
    
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(x2, y2);
    
    ctx.stroke();
}

// Rutnät 10×10
function ritaRutnat() {
    const stegX = canvas.width / 10;
    const stegY = canvas.height / 10;
    
    ctx.beginPath();
    
    // Lodräta linjer
    for (let i = 1; i < 10; i++) {
        ctx.moveTo(i * stegX, 0);
        ctx.lineTo(i * stegX, canvas.height);
    }
    
    // Vågräta linjer
    for (let i = 1; i < 10; i++) {
        ctx.moveTo(0, i * stegY);
        ctx.lineTo(canvas.width, i * stegY);
    }
    
    ctx.stroke();
}

// Cirkel / centralpunkt
function ritaCirkel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radie = Math.min(canvas.width, canvas.height) * 0.3;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radie, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Rita centrumpunkt
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(${farg[0]}, ${farg[1]}, ${farg[2]})`;
    ctx.fill();
}

// Återställ / ta bort bild
function resetBild() {
    originalBild = null;
    bildLaddad = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
    document.getElementById('bildUpload').value = '';
}

// Ladda om vid fönsterändring (för responsivitet)
window.addEventListener('resize', function() {
    if (bildLaddad && originalBild) {
        const gammalBredd = canvas.width;
        const gammalHojd = canvas.height;
        
        if (canvas.width > 800) {
            const ratio = 800 / originalBild.width;
            canvas.width = 800;
            canvas.height = originalBild.height * ratio;
            ritaCanvas();
        }
    }
});
