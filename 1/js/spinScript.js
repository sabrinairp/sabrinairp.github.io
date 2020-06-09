var resultWrapper = document.querySelector('.spin-result-wrapper');
var wheel = document.querySelector('.wheel-img');

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 1000);
});

function spin() {
    if (wheel.classList.contains('rotated')) {
        resultWrapper.style.display = "block";
    } else {
        wheel.classList.add('super-rotation');
        setTimeout(function () {
            resultWrapper.style.display = "block";
        }, 8000);
        setTimeout(function () {
            $('.spin-wrapper').slideUp();
            $('.order_block').slideDown();
            makeTimer();
        }, 10000);
        wheel.classList.add('rotated');
    }
}
var closePopup = document.querySelector('.close-popup');
$('.close-popup, .pop-up-button').click(function (e) {
    e.preventDefault();
    $('.spin-result-wrapper').fadeOut();
});





$('a').click(function (e) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $('#form').offset().top
    }, 1000);
})


function makeTimer() {
    var minBox = document.querySelector('#min'),
        secBox = document.querySelector('#sec'),
        time = 600;

    var timer = setInterval(function () {
        if (time === 0) {
            clearInterval(timer)
        } else {
            minBox.textContent = (Math.floor(time / 60)) < 10 ? ('0' + (Math.floor(time / 60))) : (Math.floor(time / 60));
            secBox.textContent = (time % 60) < 10 ? ('0' + (time % 60)) : (time % 60)

            time -= 1;
        }
    }, 1000)
}


//Script for autocomments
window.addEventListener('DOMContentLoaded', function () {
    var commentsList = document.querySelectorAll('.autoComments__item'),
        refresh = document.querySelector('.refreshBox'),
        currentComment = 0;

    setInterval(function () {
        

        setTimeout(function () {
            commentsList[currentComment].classList.add('active');
        }, 0)

        currentComment++;

        if (currentComment === commentsList.length) {
            currentComment = 0;
        }
    }, 6000)

    setTimeout(function(){
        setInterval(function(){
            clearCLass(commentsList);
        }, 6000)
    }, 4000)



    function clearCLass(elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('active');
        }
    }

})