$(document).ready(function() {
    var isDragging = false;
    var startY;
    var startHeight;

    $('.handle').on('mousedown touchstart', function(e) {
        isDragging = true;
        startY = e.clientY || e.originalEvent.touches[0].clientY;
        startHeight = $('.content').height();
        e.preventDefault(); // Prevent text selection and other default actions
    });

    $(document).on('mouseup touchend', function() {
        isDragging = false;
    });

    $(document).on('mousemove touchmove', function(e) {
        if (isDragging) {
            var currentY = e.clientY || e.originalEvent.touches[0].clientY;
            var diff = startY - currentY;

            var newHeight = startHeight + diff;

            // Calculate maximum height based on navbar position
            var maxHeight = $(window).height() - $('.route-navbar').outerHeight() - $('.handle').outerHeight();

            // Restrict minimum and maximum height
            if (newHeight < 50) {
                newHeight = 50;
            } else if (newHeight > maxHeight) {
                newHeight = maxHeight;
            }

            $('.content').css('height', newHeight + 'px');
        }
    });

    $('#zoomable-image').on('click', function() {
        if ($(this).css('cursor') === 'zoom-in') {
            $(this).css({
                'transform': 'scale(2)',
                'cursor': 'zoom-out'
            });
        } else {
            $(this).css({
                'transform': 'scale(1)',
                'cursor': 'zoom-in'
            });
        }
    });
});
