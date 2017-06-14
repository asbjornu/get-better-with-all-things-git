function showPancakes() {
    Reveal.addEventListener('fragmentshown', function() {
        var step = Reveal.getIndices().f;
        var pancakes = document.querySelectorAll('.pancakes section.present img.pancake');
        if (!pancakes || pancakes.length != 2) {
            Reveal.removeEventListener('fragmentshown', this);
            return;
        }

        switch (step) {
            case 0:
                pancakes[0].style.left = '1%';
                pancakes[1].style.left = '55%';
                break;

            case 1:
                pancakes[0].style.left = '30%';
                pancakes[1].style.left = '30%';
                break;
        }
    });
}
