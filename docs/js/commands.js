function showCommands() {
    Reveal.addEventListener('fragmentshown', function() {
        var step = Reveal.getIndices().f;
        var commands = document.querySelectorAll('.commands section.present .git-commands span');
        if (!commands || commands.length == 0) {
            Reveal.removeEventListener('commands', this);
            return;
        }

        switch (step) {
            case 0:
                for (var command of commands) {
                    var className = command.getAttribute('class');
                    command.style = className.indexOf('porcelain') !== -1
                        ? 'opacity: 1'
                        : 'opacity: 0.2';
                }
                break;

            case 1:
                for (var command of commands) {
                    var className = command.getAttribute('class');
                    command.style = className.indexOf('plumbing') !== -1
                        ? 'opacity: 1'
                        : 'opacity: 0.2';
                }
                break;

            case 2:
                for (var command of commands) {
                    var className = command.getAttribute('class');
                    command.style = className.indexOf('common') !== -1
                        ? 'opacity: 1'
                        : 'opacity: 0.2';
                }
                break;
        }
    });
}
