$(function () {
    var dataset = [
        {
            value: 25,
            color: "#F8E1D9",
        },
        {
            value: 55,
            color: "#A8C1F3",
        },
        {
            value: 20,
            color: "#BFD4E8",
        },
    ];

    var maxValue = 25;
    var container = $(".contact__chart");

    var addSector = function (data, startAngle, collapse) {
        var sectorDeg = 3.6 * data.value;
        var skewDeg = 90 + sectorDeg;
        var rotateDeg = startAngle;
        if (collapse) {
            skewDeg++;
        }

        var sector = $("<div>", {
            class: "sector",
        }).css({
            background: data.color,
            transform: "rotate(" + rotateDeg + "deg) skewY(" + skewDeg + "deg)",
        });
        container.append(sector);

        return startAngle + sectorDeg;
    };

    dataset.reduce(function (prev, curr) {
        return (function addPart(data, angle) {
            if (data.value <= maxValue) {
                return addSector(data, angle, false);
            }

            return addPart(
                {
                    value: data.value - maxValue,
                    color: data.color,
                },
                addSector(
                    {
                        value: maxValue,
                        color: data.color,
                    },
                    angle,
                    true
                )
            );
        })(curr, prev);
    }, 0);
    //start gallery=========================================================================================================
    $('[data-fancybox="images"]').fancybox({
        loop: true,
        gutter: 0,
        idleTime: 3,
        maxWidth: 900,
        maxHeight: 600,
        baseClass: "slider__wrapper",
        transitionDuration: 800,
        keyboard: false,
        btnTpl: {
            arrowLeft:
                '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 444.819 444.819" style="enable-background:new 0 0 444.819 444.819;" xml:space="preserve" class="fancybox-svg"><g transform="matrix(-1 1.22465e-16 -1.22465e-16 -1 444.819 444.819)"><g>' +
                '<path class="fancybox-icon" d="M352.025,196.712L165.884,10.848C159.029,3.615,150.469,0,140.187,0c-10.282,0-18.842,3.619-25.697,10.848L92.792,32.264   c-7.044,7.043-10.566,15.604-10.566,25.692c0,9.897,3.521,18.56,10.566,25.981l138.753,138.473L92.786,361.168   c-7.042,7.043-10.564,15.604-10.564,25.693c0,9.896,3.521,18.562,10.564,25.98l21.7,21.413   c7.043,7.043,15.612,10.564,25.697,10.564c10.089,0,18.656-3.521,25.697-10.564l186.145-185.864   c7.046-7.423,10.571-16.084,10.571-25.981C362.597,212.321,359.071,203.755,352.025,196.712z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/> </g></g>' +
                "</svg>" +
                "</button>",

            arrowRight:
                '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 444.819 444.819" style="enable-background:new 0 0 444.819 444.819;" xml:space="preserve" class="fancybox-svg"><g><g>' +
                '<path class="fancybox-icon" d="M352.025,196.712L165.884,10.848C159.029,3.615,150.469,0,140.187,0c-10.282,0-18.842,3.619-25.697,10.848L92.792,32.264   c-7.044,7.043-10.566,15.604-10.566,25.692c0,9.897,3.521,18.56,10.566,25.981l138.753,138.473L92.786,361.168   c-7.042,7.043-10.564,15.604-10.564,25.693c0,9.896,3.521,18.562,10.564,25.98l21.7,21.413   c7.043,7.043,15.612,10.564,25.697,10.564c10.089,0,18.656-3.521,25.697-10.564l186.145-185.864   c7.046-7.423,10.571-16.084,10.571-25.981C362.597,212.321,359.071,203.755,352.025,196.712z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/> </g></g>' +
                "</svg>" +
                "</button>",
        },
    });
    //end gallery===========================================================================================================
    //start fixed arrow-button-up===========================================================================================
    function backToTop() {
        let button = $(".back-top");
        $(window).on("scroll", () => {
            if ($(this).scrollTop() >= 1400) {
                button.fadeIn();
            } else {
                button.fadeOut();
            }
        });
    }
    backToTop();
    //end fixed arrow-button-up=============================================================================================
    //start anchor==========================================================================================================
    $("body").on(
        "click",
        ".description__link, .header__btn, .link, .journal__link, .place",
        function (e) {
            e.preventDefault();
            $(".input__row--first").focus();
        }
    );
    //end anchor============================================================================================================
    //start video===========================================================================================================
    function findVideos() {
        let videos = document.querySelectorAll(".video");

        for (let i = 0; i < videos.length; i++) {
            setupVideo(videos[i]);
        }
    }

    function setupVideo(video) {
        let link = video.querySelector(".video__link");
        let media = video.querySelector(".video__media");
        let button = video.querySelector(".video__button");
        let id = parseMediaURL(media);

        video.addEventListener("click", () => {
            let iframe = createIframe(id);

            link.remove();
            button.remove();
            video.appendChild(iframe);
        });

        link.removeAttribute("href");
        video.classList.add("video--enabled");
    }

    function parseMediaURL(media) {
        let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/maxresdefault\.jpg/i;
        let url = media.src;
        let match = url.match(regexp);

        return match[1];
    }

    function createIframe(id) {
        let iframe = document.createElement("iframe");

        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("src", generateURL(id));
        iframe.classList.add("video__media");

        return iframe;
    }

    function generateURL(id) {
        let query = "?rel=0&showinfo=0&autoplay=1";

        return "https://www.youtube.com/embed/" + id + query;
    }

    findVideos();
    //end video============================================================================================================
    //start animation======================================================================================================
    AOS.init({
        once: true,
    });
    //end animation========================================================================================================
    //start event click menu===============================================================================================
    $(".header__dropdown").on("click", function () {
        $(".header__list").slideToggle();
    });

    var windowWidth = $(window).width();
    if (windowWidth <= "768") {
        $(".header__link").on("click", function () {
            $(".header__list").css({ display: "none" });
        });
    }
    //end event click menu=================================================================================================
    //E-mail Ajax Send=====================================================================================================
    $("form").submit(function () {
        //Change
        var th = $(this);
        $.ajax({
            type: "POST",
            url: "mail.php", //Change
            data: th.serialize(),
        }).done(function () {
            setTimeout(function () {
                // Done Functions
                $(".contact__form").addClass("contact__form--active");
                $(".contact__popup-wrapper").addClass("contact__popup-wrapper--active");
                $(".contact__icon").addClass("contact__icon--active");
                th.trigger("reset");
            }, 1000);
        });
        return false;
    });
    // End E-mail Ajax Send=================================================================================================
});
