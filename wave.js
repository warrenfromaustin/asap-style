/* wave.js
 * River of Talent browser behavior scripts.
 * Loaded and injected by src/river_style.py via get_scroll_down_script().
 *
 * Auto-scrolls the chat view to the latest message whenever this script
 * runs (e.g. after a new chat message is submitted/rendered).
 */
(function() {
    let scrollTimeout;
    function scrollToBottom() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const elements = window.parent.document.querySelectorAll('.stChatMessage');
            if (elements.length > 0) {
                elements[elements.length - 1].scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                });
            }
        }, 100);
    }
    scrollToBottom();
})();
