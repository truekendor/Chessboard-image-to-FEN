import { DetectionCanvas } from "./detectionCanvas";
import { NN } from "../nnHelper";
import { ChessBoardCanvas } from "./previewCanvas";
import { detectionCanvasList } from "../renderBoxes";
import { Sidebar } from "./sidebar";
import { normalizeFenString } from "../utils";

const outlineSVG = document.querySelector(".outline-svg_svg")!;

export function createSidebarCard(
  detectionCanvas: DetectionCanvas,
  fenWhite: string,
  fenBlack: string
) {
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("detection-card");

  // * ============
  // * button panel

  const previewPredictionBtn = document.createElement("button");
  previewPredictionBtn.textContent = "preview";
  previewPredictionBtn.classList.add(`data-predict-id-${detectionCanvas.id}`);

  const predictBtn = document.createElement("button");
  predictBtn.textContent = "predict";

  const deleteCardBtn = document.createElement("button");
  deleteCardBtn.textContent = "delete";

  const buttonsPanel = document.createElement("image");
  buttonsPanel.append(predictBtn, previewPredictionBtn, deleteCardBtn);
  buttonsPanel.classList.add("detection-card__btn-panel");

  predictBtn.addEventListener("click", () => {
    previewPredictionBtn.textContent = "preview";

    const [f1, f2] = NN.classification.classifyCanvas(
      detectionCanvas.toGrayScale().canvas
    );

    setWhiteFENVal(f1);
    setBlackFENVal(f2);

    const helperCanvas = new ChessBoardCanvas(
      detectionCanvas.width,
      detectionCanvas.height
    );
    const normFen = normalizeFenString(f1).filter((el) => el !== "/");
    helperCanvas.drawChessboardFromFen(normFen);

    previewCanvas.width = detectionCanvas.width;
    previewCanvas.height = detectionCanvas.height;

    previewCtx.putImageData(helperCanvas.imageData, 0, 0);
  });

  deleteCardBtn.addEventListener("click", () => {
    const index = detectionCanvasList.findIndex((el) => {
      return el.id === detectionCanvas.id;
    });

    detectionCanvasList.splice(index, 1);

    const cards = Sidebar.getPredictionCards();

    cards.forEach((card) => {
      const cardCanvas = card.querySelector("canvas")!;
      const dataId = parseInt(cardCanvas.getAttribute("data-id")!);

      if (dataId === detectionCanvas.id) {
        Sidebar.removeCard(card);
      }
    });

    const groups = outlineSVG.querySelectorAll("g");
    groups.forEach((group) => {
      const dataId = parseInt(group.getAttribute("data-id")!);

      if (dataId === detectionCanvas.id) {
        outlineSVG.removeChild(group);
      }
    });
  });

  // * ============
  // * fen

  const fenContainer = document.createElement("image");
  fenContainer.classList.add("fen-container");

  const [whiteFENWrapper, setWhiteFENVal] = createSidebarOutputWrapper(
    "White's perspective",
    fenWhite
  );
  const [blackFENWrapper, setBlackFENVal] = createSidebarOutputWrapper(
    "Black's perspective",
    fenBlack
  );

  // todo delete
  fenContainer.append(whiteFENWrapper, blackFENWrapper);

  const canvasWrapper = document.createElement("image");
  canvasWrapper.classList.add("detection-card__canvas-wrapper");

  const normFen = normalizeFenString(fenWhite).filter((el) => el !== "/");
  const helperCanvas = new ChessBoardCanvas(
    detectionCanvas.width,
    detectionCanvas.height
  );

  helperCanvas.drawChessboardFromFen(normFen);

  const previewCanvas = document.createElement("canvas");
  const previewCtx = previewCanvas.getContext("2d")!;
  previewCanvas.width = detectionCanvas.width;
  previewCanvas.height = detectionCanvas.height;

  previewCanvas.classList.add("preview-canvas");
  previewCanvas.classList.add("hidden");

  previewCtx.putImageData(helperCanvas.imageData, 0, 0);

  canvasWrapper.append(detectionCanvas.canvas, previewCanvas);
  // * ============

  previewPredictionBtn.addEventListener("pointerdown", () => {
    previewCanvas.classList.remove("hidden");
  });

  previewPredictionBtn.addEventListener("pointerup", () => {
    previewCanvas.classList.add("hidden");
  });

  cardWrapper.append(buttonsPanel, canvasWrapper, fenContainer);

  return {
    card: cardWrapper,
    appendCardToSidebar: () => {
      Sidebar.addCard(cardWrapper);
    },
  } as const;
}

function createSidebarOutputWrapper(text: string, fen: string) {
  const wrapper = document.createElement("label");
  wrapper.classList.add("fen-output-wrapper");

  const inputElem = document.createElement("input");

  const inputWrapper = document.createElement("image");
  inputWrapper.classList.add("input-wrapper");

  const copyFENBtn = document.createElement("button");
  copyFENBtn.classList.add("copy-fen-btn");

  const img = document.createElement("img");
  img.alt = "Copy";
  img.src = "copy.svg";

  copyFENBtn.append(img);

  copyFENBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(fen);
  });

  const textElem = document.createElement("p");
  textElem.textContent = text;

  inputElem.disabled = true;
  inputElem.value = fen;

  inputWrapper.append(inputElem, copyFENBtn);

  wrapper.append(textElem, inputWrapper);

  function setVal(value: string) {
    inputElem.value = value;
  }

  return [wrapper, setVal] as const;
}
