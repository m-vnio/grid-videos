if (!localStorage.getItem("ls-array-url")) {
  localStorage.setItem("ls-array-url", "[]");
}

const $ = (query) => {
  return document.querySelector(query);
};

function reproducirHLS(videoElement, videoURL) {
  if (Hls.isSupported()) {
    let hls = new Hls();
    hls.loadSource(videoURL);
    hls.attachMedia(videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement
        .play()
        .catch((error) =>
          console.error("Error al reproducir el video:", error)
        );
    });
  } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    // Para Safari y dispositivos que soportan HLS nativamente
    videoElement.src = videoURL;
    videoElement.addEventListener("loadedmetadata", () => {
      videoElement
        .play()
        .catch((error) =>
          console.error("Error al reproducir el video:", error)
        );
    });
  } else {
    console.error("El navegador no soporta HLS.");
  }
}

function renderUrl(array) {
  $("#itemUrl").innerHTML = array
    .map((url) => {
      return `<div class="div_4gabf29" data-url="${url}" data-item></div>`;
    })
    .join("");
}

$("#buttonAdd").addEventListener("click", () => {
  const url = prompt("Ingrese una url");

  try {
    new URL(url);

    localStorage.setItem(
      "ls-array-url",
      JSON.stringify(
        JSON.parse(localStorage.getItem("ls-array-url")).concat(url)
      )
    );

    $("#itemUrl").insertAdjacentHTML(
      "beforeend",
      `<div class="div_4gabf29" data-url="${url}" data-item></div>`
    );
  } catch (error) {
    alert("la url no es valida");
  }
});

$("#itemUrl").addEventListener("click", (e) => {
  const $item = e.target.closest("[data-item]");
  if ($item) {
    if (!$item.querySelector("video")) {
      const $video = document.createElement("video");

      $video.addEventListener("loadedmetadata", () => {
        $video.setAttribute("controls", "");
      });

      if ($item.getAttribute("data-url").includes(".m3u8")) {
        reproducirHLS($video, $item.getAttribute("data-url"));
      } else {
        $video.src = $item.getAttribute("data-url");
      }

      $item.append($video);
    }
  }
});

$("#itemUrl").addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const $item = e.target.closest("[data-item]");
  if ($item) {
    if (confirm("¿Eliminar?")) {
      localStorage.setItem(
        "ls-array-url",
        JSON.stringify(
          JSON.parse(localStorage.getItem("ls-array-url")).filter((url) => {
            return url !== $item.getAttribute("data-url");
          })
        )
      );

      $item.remove();
    }
  }
});

$("#select").addEventListener("change", () => {
  $("#itemUrl").style.gridTemplateColumns = "";
  if ($("#select").value != 0) {
    $("#itemUrl").style.gridTemplateColumns = `repeat(${
      $("#select").value
    }, 1fr)`;
  }
});

renderUrl(JSON.parse(localStorage.getItem("ls-array-url")));

new Sortable($("#itemUrl"), {
  animation: 150, // Suaviza el movimiento
  //   ghostClass: "sortable-ghost", // Clase CSS temporal al mover
});
