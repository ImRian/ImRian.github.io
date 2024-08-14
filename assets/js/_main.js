$(document).ready(function () {
  // 기존의 FitVids 초기화
  $("#main").fitVids();

  // Follow 메뉴 드롭다운 이벤트 핸들러
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").toggleClass("is--visible");
    $(".author__urls-wrapper").find("button").toggleClass("open");
  });

  // Esc 키로 검색 화면 닫기
  $(document).keyup(function (e) {
    if (e.keyCode === 27) {
      if ($(".initial-content").hasClass("is--hidden")) {
        $(".search-content").toggleClass("is--visible");
        $(".initial-content").toggleClass("is--hidden");
      }
    }
  });

  // 검색 토글 이벤트 핸들러
  $(".search__toggle").on("click", function () {
    $(".search-content").toggleClass("is--visible");
    $(".initial-content").toggleClass("is--hidden");
    // 검색 input에 포커스 설정
    setTimeout(function () {
      $(".search-content input").focus();
    }, 400);
  });

  // Smooth 스크롤 설정
  var scroll = new SmoothScroll('a[href*="#"]', {
    offset: 20,
    speed: 400,
    speedAsDuration: true,
    durationMax: 500,
  });

  // Gumshoe 스크롤 스파이 초기화
  if ($("nav.toc").length > 0) {
    var spy = new Gumshoe("nav.toc a", {
      // 활성화 클래스
      navClass: "active", // 네비게이션 목록 아이템에 적용
      contentClass: "active", // 콘텐츠에 적용

      // 중첩된 네비게이션
      nested: false, // true이면, 활성화 링크의 부모에게 클래스 추가
      nestedClass: "active", // 부모 아이템에 적용할 클래스

      // Offset 및 리플로우
      offset: 20, // 페이지 상단에서 콘텐츠 영역을 활성화할 거리
      reflow: true, // true이면 리플로우 리스닝

      // 이벤트 지원
      events: true, // true이면, 커스텀 이벤트 발행
    });
  }

  // Sticky ToC와 콘텐츠 자동 스크롤
  const scrollTocToContent = function (event) {
    var target = event.target;
    var scrollOptions = { behavior: "auto", block: "nearest", inline: "start" };

    var tocElement = document.querySelector("aside.sidebar__right.sticky");
    if (!tocElement) return;
    if (window.getComputedStyle(tocElement).position !== "sticky") return;

    if (target.parentElement.classList.contains("toc__menu") && target == target.parentElement.firstElementChild) {
      // 대신 상단으로 스크롤
      document.querySelector("nav.toc header").scrollIntoView(scrollOptions);
    } else {
      target.scrollIntoView(scrollOptions);
    }
  };

  // Firefox에 문제가 있어, Chrome만 화이트리스트에 추가
  if (!!window.chrome) {
    document.addEventListener("gumshoeActivate", scrollTocToContent);
  }

  // 모든 이미지 링크에 lightbox 클래스 추가
  $(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']"
  ).has("> img").addClass("image-popup");

  // Magnific-Popup 옵션
  $(".image-popup").magnificPopup({
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1], // 0 - 현재 이전, 1 - 현재 이미지 이후 미리 로드
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // 팝업이 제거되기 전 지연 시간 (밀리초)
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function () {
        // mfp-anim 클래스를 마크업에 추가하는 해킹
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      },
    },
    closeOnContentClick: true,
    midClick: true, // 중간 마우스 클릭으로 팝업 열기 허용
  });

  // 사이드바 카테고리 토글 기능 추가 (이 부분 추가됨)
  $(".sidebar li").on("click", function(e) {
    // 클릭된 항목의 하위 목록을 토글
    $(this).children("ul").slideToggle(200);

    // 다른 열린 항목 닫기
    $(this).siblings("li").find("ul").slideUp(200);

    // active 클래스 관리
    $(this).siblings("li").removeClass("active");
    $(this).toggleClass("active");

    e.stopPropagation();  // 클릭 이벤트 상위로 전파 방지
  });

  // 헤딩에 앵커 추가
  document
    .querySelector(".page__content")
    .querySelectorAll("h1, h2, h3, h4, h5, h6")
    .forEach(function (element) {
      var id = element.getAttribute("id");
      if (id) {
        var anchor = document.createElement("a");
        anchor.className = "header-link";
        anchor.href = "#" + id;
        anchor.innerHTML =
          '<span class="sr-only">Permalink</span><i class="fas fa-link"></i>';
        anchor.title = "Permalink";
        element.appendChild(anchor);
      }
    });

  // <pre> 블록에 복사 버튼 추가
  var copyText = function (text) {
    if (document.queryCommandEnabled("copy") && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => true,
        () => console.error("Failed to copy text to clipboard: " + text)
      );
      return true;
    } else {
      var isRTL = document.documentElement.getAttribute("dir") === "rtl";

      var textarea = document.createElement("textarea");
      textarea.className = "clipboard-helper";
      textarea.style[isRTL ? "right" : "left"] = "-9999px";
      // 세로 위치 동일하게 이동
      var yPosition = window.pageYOffset || document.documentElement.scrollTop;
      textarea.style.top = yPosition + "px";

      textarea.setAttribute("readonly", "");
      textarea.value = text;
      document.body.appendChild(textarea);

      var success = true;
      try {
        textarea.select();
        success = document.execCommand("copy");
      } catch (e) {
        success = false;
      }
      textarea.parentNode.removeChild(textarea);
      return success;
    }
  };

  var copyButtonEventListener = function (event) {
    var thisButton = event.target;

    // <code> 요소 찾기
    var codeBlock = thisButton.nextElementSibling;
    while (codeBlock && codeBlock.tagName.toLowerCase() !== "code") {
      codeBlock = codeBlock.nextElementSibling;
    }
    if (!codeBlock) {
      // <code>가 없으면 에러 처리
      console.warn(thisButton);
      throw new Error("No code block found for this button.");
    }

    // 라인 번호가 있으면 건너뜀 (예: {% highlight lineno %})
    var realCodeBlock = codeBlock.querySelector("td.code, td.rouge-code");
    if (realCodeBlock) {
      codeBlock = realCodeBlock;
    }
    var result = copyText(codeBlock.innerText);
    // 버튼에 포커스 복원
    thisButton.focus();
    if (result) {
      if (thisButton.interval !== null) {
        clearInterval(thisButton.interval);
      }
      thisButton.classList.add('copied');
      thisButton.interval = setTimeout(function () {
        thisButton.classList.remove('copied');
        clearInterval(thisButton.interval);
        thisButton.interval = null;
      }, 1500);
    }
    return result;
  };

  if (window.enable_copy_code_button) {
    document
      .querySelectorAll(".page__content pre.highlight > code")
      .forEach(function (element, index, parentList) {
        // <pre> 요소 찾기
        var container = element.parentElement;
        // 기존에 버튼이 없으면 새로 추가
        if (container.firstElementChild.tagName.toLowerCase() !== "code") {
          return;
        }
        var copyButton = document.createElement("button");
        copyButton.title = "Copy to clipboard";
        copyButton.className = "clipboard-copy-button";
        copyButton.innerHTML = '<span class="sr-only">Copy code</span><i class="far fa-fw fa-copy"></i><i class="fas fa-fw fa-check copied"></i>';
        copyButton.addEventListener("click", copyButtonEventListener);
        container.prepend(copyButton);
      });
  }
});
