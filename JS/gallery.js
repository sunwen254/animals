// 图片过滤功能
document.addEventListener('DOMContentLoaded', function() {
    const animalFilter = document.getElementById('animalFilter');
    const regionFilter = document.getElementById('regionFilter');
    const themeFilter = document.getElementById('themeFilter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function filterGallery() {
        const selectedAnimal = animalFilter.value;
        const selectedRegion = regionFilter.value;
        const selectedTheme = themeFilter.value;

        galleryItems.forEach(item => {
            const animal = item.dataset.animal;
            const region = item.dataset.region;
            const theme = item.dataset.theme;

            const animalMatch = selectedAnimal === 'all' || animal === selectedAnimal;
            const regionMatch = selectedRegion === 'all' || region === selectedRegion;
            const themeMatch = selectedTheme === 'all' || theme === selectedTheme;

            if (animalMatch && regionMatch && themeMatch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    animalFilter.addEventListener('change', filterGallery);
    regionFilter.addEventListener('change', filterGallery);
    themeFilter.addEventListener('change', filterGallery);
});