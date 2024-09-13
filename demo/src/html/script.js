document.getElementById('simulateButton').addEventListener('click', simulateBuffonsNeedle);

function simulateBuffonsNeedle() {
    const numDrops = parseInt(document.getElementById('numDrops').value);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const needleLength = 40;
    const lineSpacing = 50;
    let crossCount = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw parallel lines
    for (let i = 0; i < canvas.height; i += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    function dropNeedle(x, y, angle) {
        const xEnd = x + needleLength * Math.cos(angle);
        const yEnd = y + needleLength * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xEnd, yEnd);
        ctx.strokeStyle = 'red';
        ctx.stroke();

        return Math.floor(y / lineSpacing) !== Math.floor(yEnd / lineSpacing);
    }

    function animateDrops(i) {
        if (i < numDrops) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const angle = Math.random() * Math.PI;

            if (dropNeedle(x, y, angle)) {
                crossCount++;
            }

            requestAnimationFrame(() => animateDrops(i + 1));
        } else {
            const piEstimate = (2 * needleLength * numDrops) / (crossCount * lineSpacing);
            document.getElementById('result').textContent = `Estimated Pi: ${piEstimate.toFixed(5)}`;
        }
    }

    animateDrops(0);
}