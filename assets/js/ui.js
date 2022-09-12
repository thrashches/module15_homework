btnWithIcon.addEventListener('click', () => {
    const button = document.getElementById('btnWithIcon');
    const icons = button.querySelectorAll('.icon');

    for (let icon of icons) {
        if (icon.classList.contains('hidden')) {
            icon.classList.remove('hidden');
        }
        else {
            icon.classList.add('hidden');
        }
    }
})

getScreenSize.addEventListener('click', () => {
    const height = window.screen.height;
    const width = window.screen.width;
    alert(`Высота: ${height}, Ширина: ${width}`);
})